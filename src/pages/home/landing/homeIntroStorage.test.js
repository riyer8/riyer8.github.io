import {
  HOME_INTRO_STORAGE_KEY,
  clearHomeIntroCover,
  hasSeenHomeIntro,
  isHomePath,
  markHomeIntroSeen,
  shouldPlayHomeIntro,
  startHomeIntroCoverFade,
  stripIntroSkipFromHtml,
} from "./homeIntroStorage";

const mockStorage = (initial = {}) => {
  const data = { ...initial };
  return {
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = String(value);
    },
  };
};

describe("isHomePath", () => {
  it("treats /, trailing slashes, and index.html as home", () => {
    expect(isHomePath("/")).toBe(true);
    expect(isHomePath("")).toBe(true);
    expect(isHomePath("/index.html")).toBe(true);
    expect(isHomePath("/ramya")).toBe(false);
    expect(isHomePath("/recent-reads")).toBe(false);
  });
});

describe("shouldPlayHomeIntro", () => {
  it("plays on home when this session has not seen the intro", () => {
    expect(shouldPlayHomeIntro("/", mockStorage())).toBe(true);
  });

  it("does not play after the intro has been seen this session", () => {
    const storage = mockStorage({ [HOME_INTRO_STORAGE_KEY]: "true" });
    expect(shouldPlayHomeIntro("/", storage)).toBe(false);
  });

  it("does not play on other routes even for first-time visitors", () => {
    expect(shouldPlayHomeIntro("/ramya", mockStorage())).toBe(false);
  });

  it("persists seen state", () => {
    const storage = mockStorage();
    expect(hasSeenHomeIntro(storage)).toBe(false);
    markHomeIntroSeen(storage);
    expect(hasSeenHomeIntro(storage)).toBe(true);
  });
});

describe("stripIntroSkipFromHtml", () => {
  it("removes crawler skip flags so first-time visitors still get the wall", () => {
    const html =
      '<html lang="en" data-skip-intro="true" data-prerender-ready="true">';
    expect(stripIntroSkipFromHtml(html)).toBe(
      '<html lang="en" data-prerender-ready="true">'
    );
  });
});

describe("intro cover flags", () => {
  afterEach(() => {
    document.documentElement.removeAttribute("data-skip-intro");
    document.documentElement.removeAttribute("data-intro-fading");
    document.documentElement.removeAttribute("data-intro-theme");
    document.documentElement.style.removeProperty("--intro-cover-fade-ms");
  });

  it("fades the static wall without skipping it yet", () => {
    startHomeIntroCoverFade(420);
    expect(document.documentElement.getAttribute("data-intro-fading")).toBe(
      "true"
    );
    expect(
      document.documentElement.style.getPropertyValue("--intro-cover-fade-ms")
    ).toBe("420ms");
    expect(document.documentElement.hasAttribute("data-skip-intro")).toBe(
      false
    );
  });

  it("hides the wall after the intro finishes", () => {
    startHomeIntroCoverFade(650);
    clearHomeIntroCover();
    expect(document.documentElement.getAttribute("data-skip-intro")).toBe(
      "true"
    );
    expect(document.documentElement.hasAttribute("data-intro-fading")).toBe(
      false
    );
  });
});

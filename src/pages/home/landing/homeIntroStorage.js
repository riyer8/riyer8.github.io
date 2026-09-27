export const HOME_INTRO_STORAGE_KEY = "homeIntroSeen";

export function isHomePath(pathname = "") {
  const path =
    String(pathname)
      .replace(/\/index\.html$/i, "")
      .replace(/\/+$/, "") || "/";
  return path === "/";
}

export function hasSeenHomeIntro(storage) {
  try {
    const store = storage ?? window.sessionStorage;
    return store.getItem(HOME_INTRO_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function markHomeIntroSeen(storage) {
  try {
    const store = storage ?? window.sessionStorage;
    store.setItem(HOME_INTRO_STORAGE_KEY, "true");
  } catch {
    // Private mode can throw; skip persistence and still let the intro finish.
  }
}

export function shouldPlayHomeIntro(pathname, storage) {
  return isHomePath(pathname) && !hasSeenHomeIntro(storage);
}

/** Hide the static intro wall (return visits, other routes, intro finished). */
export function clearHomeIntroCover() {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-skip-intro", "true");
  root.removeAttribute("data-intro-fading");
  root.removeAttribute("data-intro-theme");
  root.removeAttribute("data-show-intro");
  root.style.removeProperty("--intro-cover-fade-ms");
}

/** Fade the static wall with the landing overlay so home is revealed, not popped. */
export function startHomeIntroCoverFade(fadeMs = 650) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--intro-cover-fade-ms", `${fadeMs}ms`);
  root.setAttribute("data-intro-fading", "true");
}

/** Prerender snapshots inherit the crawler's skip flag; strip it so visitors get the wall. */
export function stripIntroSkipFromHtml(html) {
  return String(html)
    .replace(/\sdata-skip-intro(?:=(?:"[^"]*"|'[^']*'|[^\s>]+))?/gi, "")
    .replace(/\sdata-intro-fading(?:=(?:"[^"]*"|'[^']*'|[^\s>]+))?/gi, "")
    .replace(/\sdata-show-intro(?:=(?:"[^"]*"|'[^']*'|[^\s>]+))?/gi, "");
}

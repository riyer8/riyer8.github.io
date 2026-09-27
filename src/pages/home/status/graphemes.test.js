import { splitGraphemes, takeGraphemes } from "./graphemes";

describe("splitGraphemes", () => {
  it("keeps ascii letters as one unit each", () => {
    expect(splitGraphemes("abc")).toEqual(["a", "b", "c"]);
  });

  it("keeps emoji sequences together", () => {
    expect(splitGraphemes("cafe ☕️")).toEqual(["c", "a", "f", "e", " ", "☕️"]);
    expect(splitGraphemes("hi 🍽️").at(-1)).toBe("🍽️");
  });

  it("returns an empty list for empty input", () => {
    expect(splitGraphemes("")).toEqual([]);
    expect(splitGraphemes(null)).toEqual([]);
  });
});

describe("takeGraphemes", () => {
  it("does not slice through an emoji", () => {
    expect(takeGraphemes("hi 🌈", 4)).toBe("hi 🌈");
    expect(takeGraphemes("hi 🌈", 3)).toBe("hi ");
  });
});

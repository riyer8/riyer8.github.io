import { slugifyPrinciple } from "./noteIds";

describe("slugifyPrinciple", () => {
  it("builds a kebab-case slug with an index suffix", () => {
    expect(slugifyPrinciple("take swings early.", 0)).toBe("take-swings-early-0");
  });

  it("avoids collisions with the index suffix", () => {
    const a = slugifyPrinciple("be kind.", 0);
    const b = slugifyPrinciple("be kind.", 1);
    expect(a).not.toBe(b);
    expect(a).toBe("be-kind-0");
    expect(b).toBe("be-kind-1");
  });
});

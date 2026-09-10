import { createAdviceDealer } from "./adviceDealer";

describe("createAdviceDealer", () => {
  it("does not repeat until the pool is exhausted", () => {
    const pool = ["a", "b", "c"];
    const dealer = createAdviceDealer(pool, () => 0);
    const firstCycle = [dealer.next(), dealer.next(), dealer.next()];
    expect(new Set(firstCycle).size).toBe(3);
    expect(firstCycle.sort()).toEqual(["a", "b", "c"]);
  });

  it("reshuffles after the pool is exhausted", () => {
    const pool = ["a", "b"];
    const dealer = createAdviceDealer(pool, () => 0);
    const seen = [dealer.next(), dealer.next(), dealer.next(), dealer.next()];
    expect(seen).toHaveLength(4);
    expect(seen.every((item) => pool.includes(item))).toBe(true);
  });
});

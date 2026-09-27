export const createAdviceDealer = (pool, rng = Math.random) => {
  let bag = [];
  let last = null;

  const refill = () => {
    bag = pool.slice();
    for (let i = bag.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
    if (bag.length > 1 && last && bag[bag.length - 1] === last) {
      const swapAt = Math.max(0, bag.length - 2);
      [bag[swapAt], bag[bag.length - 1]] = [bag[bag.length - 1], bag[swapAt]];
    }
  };

  refill();

  return {
    next() {
      if (!pool.length) return null;
      if (!bag.length) refill();
      last = bag.pop();
      return last;
    },
  };
};

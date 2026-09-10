let hasLogged = false;

export const logConsoleEgg = () => {
  if (hasLogged) return;
  if (typeof window === "undefined") return;
  hasLogged = true;
  console.log(
    "hi, fellow inspector.\nlike what you see? it's open source →\nhttps://github.com/riyer8/riyer8.github.io"
  );
};

export const debounceFunction = (f, delay = 1000) => {
  let timeOut = null;
  return (...args) => {
    clearTimeout(timeOut);
    timeOut = setTimeout(
      () => f.apply(null, args),
      delay
    );
  }
};
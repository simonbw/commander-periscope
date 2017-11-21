// TODO: Do we want this to send a minimum number of times?
export const debounceAction = (f, delay = 1000) => {
  let timeOut = null;
  return (...args) => (dispatch) => {
    clearTimeout(timeOut);
    timeOut = setTimeout(
      () => dispatch(f.apply(null, args)),
      delay
    );
  }
};
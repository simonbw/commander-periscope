export const LoggingMiddleware = (store) => (next) => (action) => {
  console.log('dispatching', action);
  next(action);
};
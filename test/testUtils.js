// Use as the first argument to .then() on a promise that should reject:
// promiseThatShouldFail.then(shouldReject, (error) => { /* your expectations */ })
export const shouldReject = () => {
  throw new Error('Expected rejection');
};
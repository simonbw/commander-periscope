// Use as the first argument to .then() on a promise that should reject:
// promiseThatShouldFail.then(shouldReject, (error) => { /* your expectations */ })
export function shouldReject() {
  throw new Error('Expected rejection');
}

// Returns a new version of this module
export function requireFresh(module) {
  delete require.cache[require.resolve(module)];
  return require(module)
}

export function wait(millis) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), millis);
  });
}
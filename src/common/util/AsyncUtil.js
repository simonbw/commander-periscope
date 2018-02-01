// Waits until a promise is either resolved or rejected
export async function waitForSettled(promise) {
  try {
    await promise;
  } catch (e) {
    // We don't care if the last update succeeded or failed,
    // we just wanna do something when it's over
  }
}

// Resolves after the given number of milliseconds
export function wait(millis) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), millis);
  });
}
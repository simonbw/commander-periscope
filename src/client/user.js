import Cookies from 'js-cookie';

/**
 * Retrieve the userId. Generate one if one isn't found. Remember it for next time.
 * NOTE: We should only ever need to generate the userId in development when we're
 * serving stuff from webpack-dev-server. Otherwise the application should guarantee
 * a userId cookie on every page load.
 */
export function getUserId() {
  const userId = window._userId || Cookies.get('userId') || generateUserId();
  Cookies.set('userId', userId, { expires: 365 * 10 });
  window._userId = userId;
  return userId;
}

// Characters used to generate a userId
const userIdChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890_-";

function generateUserId() {
  let source = new Uint32Array(10);
  window.crypto.getRandomValues(source);
  let userId = '';
  source.forEach((i) => {
    userId += userIdChars[i % userIdChars.length];
  });
  return userId;
}
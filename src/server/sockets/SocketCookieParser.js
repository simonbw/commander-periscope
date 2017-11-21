import CookieParser from 'cookie-parser';

export default () => {
  const cookieParser = new CookieParser();
  return (socket, next) => cookieParser(socket.request, null, next);
}
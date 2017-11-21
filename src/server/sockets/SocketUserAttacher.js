/**
 * Gets the userId
 */
export default () => (socket, next) => {
  const userId = socket.request.cookies.userId;
  if (!userId) {
    throw new Error('No userId cookie found');
  }
  socket.userId = userId;
  
  next();
}

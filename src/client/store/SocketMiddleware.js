import { SEND_MESSAGE } from '../actions/GeneralActions';

// Catches all actions with type SEND_MESSAGE and sends them to the server over socket.io
export default (getSocket) => (store) => (next) => (action) => {
  if (action.type === SEND_MESSAGE) {
    getSocket().emit(action.messageType, action.messageData);
  } else {
    next(action);
  }
}
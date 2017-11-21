import * as GeneralLobbyActions from '../actions/GeneralActions';

export default (connected = false, action) => {
  switch (action.type) {
    case GeneralLobbyActions.CONNECTED:
      return true;
    case GeneralLobbyActions.DISCONNECTED:
      return false;
  }
  return connected;
}
import {
  CUSTOM_LOBBY_READY_MESSAGE,
  CUSTOM_LOBBY_SELECT_ROLE_MESSAGE,
  CUSTOM_LOBBY_SET_USERNAME_MESSAGE,
  CUSTOM_LOBBY_UNREADY_MESSAGE,
  JOIN_CUSTOM_LOBBY_MESSAGE,
  LEAVE_CUSTOM_LOBBY_MESSAGE
} from '../../common/Messages';
import { setUrlForLobby, setUrlForMenu } from '../navigation';
import { debounceAction } from './ActionUtils';
import { sendMessage } from './GeneralActions';

export const JOIN_CUSTOM_LOBBY = 'joinCustomLobby';
export const LEAVE_CUSTOM_LOBBY = 'leaveCustomLobby';

// pass null to create a new lobby
export const joinCustomLobby = (lobbyId) => {
  setUrlForLobby(lobbyId);
  const username = window.localStorage.getItem('username');
  return [
    { type: JOIN_CUSTOM_LOBBY },
    sendMessage(JOIN_CUSTOM_LOBBY_MESSAGE, { lobbyId, username })
  ];
};

export const leaveCustomLobby = () => {
  setUrlForMenu();
  return ([
    { type: LEAVE_CUSTOM_LOBBY },
    sendMessage(LEAVE_CUSTOM_LOBBY_MESSAGE)
  ]);
};

export const selectRole = (role, team) => (
  sendMessage(CUSTOM_LOBBY_SELECT_ROLE_MESSAGE, { role, team })
);

export const ready = () => {
  return (
    sendMessage(CUSTOM_LOBBY_READY_MESSAGE)
  );
};

export const unready = () => (
  sendMessage(CUSTOM_LOBBY_UNREADY_MESSAGE)
);

export const setUsername = debounceAction((username) => {
  window.localStorage.setItem('username', username);
  return sendMessage(CUSTOM_LOBBY_SET_USERNAME_MESSAGE, { username });
}, 200);

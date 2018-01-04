import {
  CUSTOM_LOBBY_READY, CUSTOM_LOBBY_SELECT_ROLE, CUSTOM_LOBBY_SET_USERNAME, CUSTOM_LOBBY_UNREADY,
  JOIN_CUSTOM_LOBBY, LEAVE_CUSTOM_LOBBY
} from '../../common/Messages';
import { CUSTOM_LOBBY_PAGE } from '../models/Page';
import { debounceAction } from './ActionUtils';
import { changePage, sendMessage } from './GeneralActions';

export const createCustomLobby = () => {
  const username = window.localStorage.getItem('username') || undefined;
  return [
    changePage(CUSTOM_LOBBY_PAGE),
    sendMessage(JOIN_CUSTOM_LOBBY, { username })
  ];
};

export const joinCustomLobby = (lobbyId) => {
  const username = window.localStorage.getItem('username') || undefined;
  return [
    changePage(CUSTOM_LOBBY_PAGE),
    sendMessage(JOIN_CUSTOM_LOBBY, { lobbyId, username })
  ];
};

export const leaveCustomLobby = () => ([
  changePage(CUSTOM_LOBBY_PAGE), // TODO: Change url
  sendMessage(LEAVE_CUSTOM_LOBBY)
]);

export const selectRole = (role, team) => (
  sendMessage(CUSTOM_LOBBY_SELECT_ROLE, { role, team })
);

export const ready = () => {
  return (
    sendMessage(CUSTOM_LOBBY_READY)
  );
};

export const unready = () => (
  sendMessage(CUSTOM_LOBBY_UNREADY)
);

export const setUsername = debounceAction((username) => {
  window.localStorage.setItem('username', username);
  return sendMessage(CUSTOM_LOBBY_SET_USERNAME, { username });
}, 200);

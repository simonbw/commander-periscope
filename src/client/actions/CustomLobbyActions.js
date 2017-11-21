import * as Page from '../models/Page';
import { debounceAction } from './ActionUtils';
import { changePage, sendMessage } from './GeneralActions';

// Sent by server
export const JOINED = 'custom_lobby_joined';
export const PLAYER_ADDED = 'custom_lobby_player_added';
export const PLAYER_LEFT = 'custom_lobby_player_left';
export const PLAYER_READIED = 'custom_lobby_player_readied';
export const PLAYER_UNREADIED = 'custom_lobby_player_unreadied';
export const ROLE_SELECTED = 'custom_lobby_role_selected';
export const PLAYER_SET_USERNAME = 'custom_lobby_player_set_username';

export const createCustomLobby = () => {
  const username = window.localStorage.getItem('username') || undefined;
  return [
    changePage(Page.CUSTOM_LOBBY),
    sendMessage('join_custom_lobby', { username })
  ];
};

export const joinCustomLobby = (lobbyId) => {
  const username = window.localStorage.getItem('username') || undefined;
  return [
    changePage(Page.CUSTOM_LOBBY),
    sendMessage('join_custom_lobby', { lobbyId, username })
  ];
};

export const leaveCustomLobby = () => ([
  changePage(Page.CUSTOM_LOBBY),
  sendMessage('leave_custom_lobby')
]);

export const selectRole = (role, team) => (
  sendMessage('custom_lobby_select_role', { role, team })
);

export const ready = () => (
  sendMessage('custom_lobby_ready')
);

export const unready = () => (
  sendMessage('custom_lobby_unready')
);

export const setUsername = debounceAction((username) => {
  window.localStorage.setItem('username', username);
  return sendMessage('custom_lobby_set_username', { username });
}, 200);

import { setUrlForLobby, setUrlForMenu } from '../navigation';

export const JOIN_CUSTOM_LOBBY = 'joinCustomLobby';
export const LEAVE_CUSTOM_LOBBY = 'leaveCustomLobby';

// pass null to create a new lobby
export const joinCustomLobby = (lobbyId) => {
  setUrlForLobby(lobbyId);
  return [
    { type: JOIN_CUSTOM_LOBBY },
  ];
};

export const leaveCustomLobby = () => {
  setUrlForMenu();
  return ([
    { type: LEAVE_CUSTOM_LOBBY },
  ]);
};

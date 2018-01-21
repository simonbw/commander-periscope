import { joinCustomLobby, leaveCustomLobby } from './CustomLobbyActions';

export const goToCustomLobby = (lobbyId) => {
  return [
    // TODO: pushState
    joinCustomLobby(lobbyId)
  ];
};

export const goToMainMenu = () => {
  // TODO: pushState
  return [
    leaveCustomLobby()
  ];
};

// TODO: Popstate
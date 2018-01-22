import { joinCustomLobby, leaveCustomLobby } from './actions/CustomLobbyActions';

const CUSTOM_LOBBY_PREFIX = '/';

export function getUrlForLobby(lobbyId) {
  return `${CUSTOM_LOBBY_PREFIX}${lobbyId}`;
}

export function getLobbyIdFromUrl(pathname) {
  if (pathname.length > CUSTOM_LOBBY_PREFIX.length) {
    return pathname.substring(CUSTOM_LOBBY_PREFIX.length);
  }
  return null;
}

export function setUrlForLobby(lobbyId) {
  if (lobbyId && getLobbyIdFromUrl(window.location.pathname) !== lobbyId) {
    window.history.pushState('Custom Lobby', undefined, getUrlForLobby(lobbyId));
  }
}

export function setUrlForMenu() {
  if (getLobbyIdFromUrl(window.location.pathname)) {
    console.log('leaving lobby', getLobbyIdFromUrl(window.location.pathname.length));
    window.history.pushState('Main Menu', undefined, '/');
  }
}

export function initNavigation(getStore) {
  window.history.replaceState('First Page', undefined); // TODO: Why?
  
  window.addEventListener('popstate', (event) => {
    console.log('popstate:', event.state);
    
    const lobbyId = getLobbyIdFromUrl(window.location.pathname);
    if (lobbyId) {
      getStore().dispatch(joinCustomLobby(lobbyId));
    } else {
      getStore().dispatch(leaveCustomLobby());
    }
  });
}

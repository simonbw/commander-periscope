import Immutable from 'immutable';
import { CAPTAIN, ENGINEER, FIRST_MATE, RADIO_OPERATOR } from '../../common/Role';
import { GAME_ID, ID, PLAYERS, READIED, TEAMS, USERNAMES } from '../../common/StateFields';
import { BLUE, RED } from '../../common/Team';
import { getPlayerPosition } from '../../common/util/GameUtils';
import { shouldStartGame } from './CustomLobbyUtils';
import Games from './Games';
import Resource from './Resource';

const log = require('debug')('commander-periscope:server');

// TODO: Custom Lobby Fields In Constants
function createCustomLobby(id) {
  return Immutable.Map({
    id,
    created: Date.now(),
    players: Immutable.Set(),
    usernames: Immutable.Map(),
    readied: Immutable.Set(),
    teams: Immutable.Map({
      [RED]: createEmptyTeam(), [BLUE]: createEmptyTeam()
    })
  });
}

function createEmptyTeam() {
  return Immutable.Map({
    [CAPTAIN]: null,
    [FIRST_MATE]: null,
    [RADIO_OPERATOR]: null,
    [ENGINEER]: null,
  });
}

const CustomLobbies = new Resource('lobby', 'custom_lobby', createCustomLobby, true);

CustomLobbies.addPlayer = (lobbyId, playerId, username) => (
  CustomLobbies.update(lobbyId, 'player_added', { playerId }, (lobby) =>
    lobby
      .update(PLAYERS, (players) => players.add(playerId))
      .update(USERNAMES, (usernames) => username ? usernames.set(playerId, username) : usernames)
  )
);

CustomLobbies.removePlayer = async (lobbyId, playerId) => {
  const updatedLobby = await CustomLobbies.update(lobbyId, 'player_left', { playerId }, (lobby) =>
    lobby
      .update(PLAYERS, (players) => players.remove(playerId))
      .update(READIED, (ready) => ready.remove(playerId))
      .update(USERNAMES, (usernames) => usernames.remove(playerId))
      .update(TEAMS, (teams) =>
        teams.map((team) => team.map(
          (p) => p === playerId ? null : p
        ))));
  if (updatedLobby.get(PLAYERS).isEmpty()) {
    return CustomLobbies.remove(updatedLobby.get(ID));
  }
  return updatedLobby;
};

CustomLobbies.setUsername = (lobbyId, playerId, username) => (
  CustomLobbies.update(lobbyId, 'player_set_username', { playerId, username }, (lobby) =>
    lobby.update(USERNAMES, (usernames) => usernames.set(playerId, username))
  )
);

// Pass null for team and role to deselect
CustomLobbies.selectRole = (lobbyId, playerId, team, role) => (
  CustomLobbies.update(lobbyId, 'role_selected', { team, role }, async (lobby) => {
    const currentPlayer = lobby.getIn([TEAMS, team, role]);
    if (team && role && currentPlayer && currentPlayer !== playerId) {
      throw new Error(`That position is already taken ${team} ${role} by ${currentPlayer}`);
    }
    
    const position = getPlayerPosition(lobby.get(TEAMS), playerId);
    if (position) {
      lobby = lobby.setIn([TEAMS, position.team, position.role], null);
    }
    
    if (team && role) {
      lobby = lobby.setIn([TEAMS, team, role], playerId);
    } else { // unready when removing role
      lobby = lobby.update(READIED, (readied) => readied.remove(playerId))
    }
    if (shouldStartGame(lobby)) {
      return await startGameIfShould(lobby);
    }
    return lobby;
  })
);

CustomLobbies.ready = (lobbyId, playerId) => (
  CustomLobbies.update(lobbyId, 'player_readied', { playerId }, (lobby) => {
    if (!getPlayerPosition(lobby.get(TEAMS), playerId)) {
      throw new Error('Cannot ready without a role');
    }
    log(`${playerId} readied`);
    lobby = lobby.update(READIED, (readied) => readied.add(playerId));
    return startGameIfShould(lobby);
  })
);

CustomLobbies.unready = (lobbyId, playerId) => (
  CustomLobbies.update(lobbyId, 'player_unreadied', { playerId }, (lobby) =>
    lobby.update(READIED, (readied) => readied.remove(playerId))
  )
);

const startGameIfShould = async (lobby) => {
  if (shouldStartGame(lobby)) {
    const game = await Games.createFromLobby(lobby);
    const gameId = game.get(ID);
    const updatedLobby = lobby.set(GAME_ID, gameId);
    log(`starting game ${gameId}`);
    CustomLobbies.publish(updatedLobby, 'game_start', { gameId });
    return updatedLobby;
  } else {
    return lobby;
  }
};

export default CustomLobbies;

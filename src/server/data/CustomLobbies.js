import Immutable from 'immutable';
import { CAPTAIN, ENGINEER, FIRST_MATE, RADIO_OPERATOR } from '../../common/Role';
import { BLUE, RED } from '../../common/Team';
import { shouldStartGame } from './CustomLobbyUtils';
import Games from './Games';
import { getPlayerPosition } from './GameUtils';
import Resource from './Resource';

const log = require('debug')('commander-periscope:server');

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
      .update('players', (players) => players.add(playerId))
      .update('usernames', (usernames) => username ? usernames.set(playerId, username) : usernames)
  )
);

CustomLobbies.removePlayer = async (lobbyId, playerId) => {
  const updatedLobby = await CustomLobbies.update(lobbyId, 'player_left', { playerId }, (lobby) =>
    lobby
      .update('players', (players) => players.remove(playerId))
      .update('readied', (ready) => ready.remove(playerId))
      .update('usernames', (usernames) => usernames.remove(playerId))
      .update('teams', (teams) =>
        teams.map((team) => team.map(
          (p) => p === playerId ? null : p
        ))));
  if (updatedLobby.get('players').isEmpty()) {
    return CustomLobbies.remove(updatedLobby.get('id'));
  }
  return updatedLobby;
};

CustomLobbies.setUsername = (lobbyId, playerId, username) => (
  CustomLobbies.update(lobbyId, 'player_set_username', { playerId, username }, (lobby) =>
    lobby.update('usernames', (usernames) => usernames.set(playerId, username))
  )
);

// Pass null for team and role to unselect
CustomLobbies.selectRole = (lobbyId, playerId, team, role) => (
  CustomLobbies.update(lobbyId, 'role_selected', { team, role }, async (lobby) => {
    const currentPlayer = lobby.getIn(['teams', team, role]);
    if (team && role && currentPlayer && currentPlayer !== playerId) {
      throw new Error(`That position is already taken ${team} ${role} by ${currentPlayer}`);
    }
    
    const position = getPlayerPosition(lobby.get('teams'), playerId);
    if (position) {
      lobby = lobby.setIn(['teams', position.team, position.role], null);
    }
    
    if (team && role) {
      lobby = lobby.setIn(['teams', team, role], playerId);
    } else { // unready when removing role
      lobby = lobby.update('readied', (readied) => readied.remove(playerId))
    }
    if (shouldStartGame(lobby)) {
      return await startGameIfShould(lobby);
    }
    return lobby;
  })
);

CustomLobbies.ready = (lobbyId, playerId) => (
  CustomLobbies.update(lobbyId, 'player_readied', { playerId }, (lobby) => {
    if (!getPlayerPosition(lobby.get('teams'), playerId)) {
      throw new Error('Cannot ready without a role');
    }
    lobby = lobby.update('readied', (readied) => readied.add(playerId));
    return startGameIfShould(lobby);
  })
);

CustomLobbies.unready = (lobbyId, playerId) => (
  CustomLobbies.update(lobbyId, 'player_unreadied', { playerId }, (lobby) =>
    lobby.update('readied', (readied) => readied.remove(playerId))
  )
);

const startGameIfShould = async (lobby) => {
  if (shouldStartGame(lobby)) {
    const game = await Games.create(null, {
      players: lobby.get('players'),
      usernames: lobby.get('usernames'),
      teams: lobby.get('teams')
    });
    const gameId = game.get('id');
    const updatedLobby = lobby.set('gameId', gameId);
    log(`starting game ${gameId}`);
    CustomLobbies.publish(updatedLobby, 'game_start', { gameId });
    return updatedLobby;
  } else {
    return lobby;
  }
};

export default CustomLobbies;

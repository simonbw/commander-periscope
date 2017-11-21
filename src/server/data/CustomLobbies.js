import Immutable from 'immutable';
import { shouldStartGame } from './CustomLobbyUtils';
import Games from './Games';
import Resource from './Resource';

// TODO: Unit test all of this

function createCustomLobby(id) {
  return Immutable.Map({
    id,
    created: Date.now(),
    players: Immutable.Set(),
    usernames: Immutable.Map(),
    readied: Immutable.Set(),
    teams: Immutable.Map({
      RED: createEmptyTeam(), BLUE: createEmptyTeam()
    })
  });
}

function createEmptyTeam() {
  return Immutable.Map({
    'captain': null,
    'first_mate': null,
    'radio_operator': null,
    'engineer': null,
  });
}

const CustomLobbies = new Resource('lobby', 'custom_lobby', createCustomLobby, true);

CustomLobbies.addPlayer = (lobbyId, playerId, username) => (
  CustomLobbies.update(lobbyId, 'player_added', { playerId }, (lobby) =>
    lobby
      .update('players', (players) => players.add(playerId))
      .update('usernames', (usernames) => {
        if (username) {
          return usernames.set(playerId, username);
        }
        return usernames;
      })
  )
);

CustomLobbies.removePlayer = (lobbyId, playerId) => (
  CustomLobbies.update(lobbyId, 'player_left', { playerId }, (lobby) =>
    lobby
      .update('players', (players) => players.remove(playerId))
      .update('readied', (ready) => ready.remove(playerId))
      .update('usernames', (usernames) => usernames.delete(playerId))
      .update('teams', (teams) =>
        teams.map((team) => team.map(
          (p) => p === playerId ? null : p
        )))
  ).then((lobby) => {
    if (lobby.get('players').isEmpty()) {
      CustomLobbies.remove(lobby.get('id'));
    }
    return lobby;
  })
);

CustomLobbies.setUsername = (lobbyId, playerId, username) => (
  CustomLobbies.update(lobbyId, 'player_set_username', { playerId, username }, (lobby) =>
    lobby.update('usernames', (usernames) => usernames.set(playerId, username))
  )
);

// Pass null for team and role to unselect
CustomLobbies.selectRole = (lobbyId, playerId, team, role) => (
  // TODO: Don't let someone select a role that someone else has
  CustomLobbies.update(lobbyId, 'role_selected', { team, role }, (lobby) => {
    lobby = lobby.update('teams', (teams) =>
      teams.map((team) => team.map(
        (p) => p === playerId ? null : p
      )));
    if (team && role) {
      lobby = lobby.setIn(['teams', team, role], playerId);
    }
    // TODO: Do you need to have a role to be ready? (should we unready here?)
    return lobby;
  })
);

CustomLobbies.ready = (lobbyId, playerId) => (
  CustomLobbies.update(lobbyId, 'player_readied', { playerId }, (lobby) => {
      // TODO: Do you need to have a role to be ready?
      lobby = lobby.update('readied', (readied) => readied.add(playerId));
      if (shouldStartGame(lobby)) {
        return startGame(lobby);
      }
      return lobby;
    }
  )
);

CustomLobbies.unready = (lobbyId, playerId) => (
  CustomLobbies.update(lobbyId, 'player_unreadied', { playerId }, (lobby) =>
    lobby.update('readied', (readied) => readied.remove(playerId))
  )
);

const startGame = (lobby) => (
  Games.create(null, {
    players: lobby.get('players'),
    usernames: lobby.get('usernames'),
    teams: lobby.get('teams')
  }) // TODO: Pass data to game on creation
    .then((game) => {
      const gameId = game.get('id');
      CustomLobbies.publish(lobby, 'game_start', { gameId });
      return lobby.set('gameId', gameId);
    })
);

export default CustomLobbies;

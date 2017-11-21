import CustomLobbies from '../../src/data/CustomLobbies';
import { getPlayerPosition } from '../../src/data/GameUtils';
import expect from '../expect';

describe('CustomLobbyUtils', () => {
  it('.getPlayerPosition', () => {
    return CustomLobbies.addPlayer('lobbyId', 'player1', 'username1')
      .then(() => CustomLobbies.addPlayer('lobbyId', 'player2', 'username2'))
      .then(() => CustomLobbies.selectRole('lobbyId', 'player1', 'RED', 'captain')) // TODO: Get constants for these
      .then(() => CustomLobbies.selectRole('lobbyId', 'player2', 'BLUE', 'engineer')) // TODO: Get constants for these
      .then(lobby => {
        expect(lobby).to.exist;
        expect(getPlayerPosition(lobby.get('teams'), 'player1')).to.deep.equal({ team: 'RED', role: 'captain' });
        expect(getPlayerPosition(lobby.get('teams'), 'player2')).to.deep.equal({ team: 'BLUE', role: 'engineer' });
      });
  });
  
  // TODO: test shouldStartGame
});
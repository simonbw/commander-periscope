import CustomLobbies from '../../src/data/CustomLobbies';
import { getPlayerPosition } from '../../src/data/GameUtils';
import expect from '../expect';

describe('CustomLobbies', () => {
  it('addPlayer', () => {
    return CustomLobbies.addPlayer('lobbyId', 'player1', 'username1')
      .then(() => CustomLobbies.addPlayer('lobbyId', 'player2', 'username2'))
      .then(() => CustomLobbies.addPlayer('lobbyId', 'player3', 'username3'))
      .then(() => CustomLobbies.selectRole('lobbyId', 'player1', 'RED', 'captain')) // TODO: Get constants for these
      .then(() => CustomLobbies.selectRole('lobbyId', 'player2', 'RED', 'captain')) // TODO: Get constants for these
      .then(lobby => {
        expect(lobby).to.exist;
        expect(getPlayerPosition(lobby.get('teams'), 'player1')).to.be.undefined;
        expect(getPlayerPosition(lobby.get('teams'), 'player2')).to.deep.equal({ team: 'RED', role: 'captain' });
      });
  });
  
  // TODO: Test ready / unready
  
  // TODO: Test removePlayer
  
  // TODO:
});
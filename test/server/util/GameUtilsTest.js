import { CAPTAIN, ENGINEER } from '../../../src/common/Role';
import { TEAMS } from '../../../src/common/StateFields';
import { BLUE, RED } from '../../../src/common/Team';
import { getPlayerPosition } from '../../../src/common/util/GameUtils';
import expect from '../../expect';

describe('GameUtils', () => {
  let CustomLobbies;
  beforeEach(() => {
    delete require.cache[require.resolve('../../../src/server/data/CustomLobbies')];
    CustomLobbies = require('../../../src/server/data/CustomLobbies').default;
  });
  
  it('.getPlayerPosition', async () => {
    await CustomLobbies.addPlayer('lobbyId', 'player1', 'username1');
    await CustomLobbies.addPlayer('lobbyId', 'player2', 'username2');
    
    await CustomLobbies.selectRole('lobbyId', 'player1', RED, CAPTAIN);
    await CustomLobbies.selectRole('lobbyId', 'player2', BLUE, ENGINEER);
    
    const lobby = await CustomLobbies.get('lobbyId');
    expect(lobby).to.exist;
    expect(getPlayerPosition(lobby.get(TEAMS), 'player1')).to.deep.equal({ team: RED, role: CAPTAIN });
    expect(getPlayerPosition(lobby.get(TEAMS), 'player2')).to.deep.equal({ team: BLUE, role: ENGINEER });
  });
  
  // TODO: Test getDataForUser
});
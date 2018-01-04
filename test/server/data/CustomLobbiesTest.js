import { ALL_ROLES, CAPTAIN, FIRST_MATE } from '../../../src/common/Role';
import { PLAYERS, READIED, TEAMS, USERNAMES } from '../../../src/common/StateFields';
import { BLUE, BOTH_TEAMS, RED } from '../../../src/common/Team';
import { createRange } from '../../../src/common/util/ImmutableUtil';
import { shouldStartGame } from '../../../src/server/data/CustomLobbyUtils';
import expect from '../../expect';

describe('CustomLobbies', () => {
  let CustomLobbies;
  beforeEach(() => {
    // Get a fresh copy of CustomLobbies every test
    delete require.cache[require.resolve('../../../src/server/data/CustomLobbies')];
    CustomLobbies = require('../../../src/server/data/CustomLobbies').default;
  });
  
  it('.addPlayer()', async () => {
    await CustomLobbies.addPlayer('lobbyId', 'player1', 'username1');
    await CustomLobbies.addPlayer('lobbyId', 'player2', 'username2');
    await CustomLobbies.addPlayer('lobbyId', 'player3', 'username3');
    const lobby = await CustomLobbies.get('lobbyId');
    expect(lobby.get(PLAYERS)).to.have.size(3);
  });
  
  it('.removePlayer()', async () => {
    await CustomLobbies.addPlayer('lobbyId', 'player1', 'username1');
    await CustomLobbies.addPlayer('lobbyId', 'player2', 'username2');
    await CustomLobbies.addPlayer('lobbyId', 'player3', 'username3');
    await CustomLobbies.removePlayer('lobbyId', 'player3');
    await CustomLobbies.removePlayer('lobbyId', 'player1');
    const lobby = (await CustomLobbies.get('lobbyId'));
    expect(lobby.get(PLAYERS))
      .to.have.size(1).and
      .to.not.include('player1', 'player3');
  });
  
  it('.removePlayer()', async () => {
    await CustomLobbies.addPlayer('lobbyId', 'player1', 'username1');
    await CustomLobbies.addPlayer('lobbyId', 'player2', 'username2');
    await CustomLobbies.addPlayer('lobbyId', 'player3', 'username3');
    await CustomLobbies.removePlayer('lobbyId', 'player3');
    await CustomLobbies.removePlayer('lobbyId', 'player1');
    const lobby = (await CustomLobbies.get('lobbyId'));
    expect(lobby.get(PLAYERS))
      .to.have.size(1).and
      .to.not.include('player1', 'player3');
  });
  
  it('.setUsername()', async () => {
    await CustomLobbies.addPlayer('lobbyId', 'player1', 'oldUsername');
    expect((await CustomLobbies.get('lobbyId')).getIn([USERNAMES, 'player1']))
      .to.equal('oldUsername');
    await CustomLobbies.setUsername('lobbyId', 'player1', 'newUsername');
    expect((await CustomLobbies.get('lobbyId')).getIn([USERNAMES, 'player1']))
      .to.equal('newUsername');
  });
  
  // TODO: startGame()
  
  describe('.selectRole()', () => {
    beforeEach(async () => {
      await CustomLobbies.addPlayer('lobbyId', 'player1', 'username1');
      await CustomLobbies.addPlayer('lobbyId', 'player2', 'username1');
    });
    
    it('setting a role should work', async () => {
      await CustomLobbies.selectRole('lobbyId', 'player1', RED, CAPTAIN);
      const lobby = await CustomLobbies.get('lobbyId');
      expect(lobby.getIn([TEAMS, RED, CAPTAIN])).to.equal('player1');
    });
    
    it('removing a role should work', async () => {
      await CustomLobbies.selectRole('lobbyId', 'player1', RED, CAPTAIN);
      await CustomLobbies.selectRole('lobbyId', 'player1', null, null);
      const lobby = await CustomLobbies.get('lobbyId');
      expect(lobby.getIn([TEAMS, RED, CAPTAIN])).to.not.exist;
    });
    
    it('setting a new role should remove the old role', async () => {
      await CustomLobbies.selectRole('lobbyId', 'player1', RED, CAPTAIN);
      await CustomLobbies.selectRole('lobbyId', 'player1', RED, FIRST_MATE);
      const lobby = await CustomLobbies.get('lobbyId');
      expect(lobby.getIn([TEAMS, RED, CAPTAIN])).to.not.exist;
    });
    
    it(`selecting a role that's already taken should cause an error`, async () => {
      await CustomLobbies.selectRole('lobbyId', 'player2', BLUE, CAPTAIN);
      await expect(CustomLobbies.selectRole('lobbyId', 'player1', BLUE, CAPTAIN)).to.be.rejected;
    });
  });
  
  describe('.ready() and .unready()', () => {
    beforeEach(async () => {
      await CustomLobbies.addPlayer('lobbyId', 'player1', 'username1');
      await CustomLobbies.addPlayer('lobbyId', 'player2', 'username1');
    });
    
    it('ready works', async () => {
      await CustomLobbies.selectRole('lobbyId', 'player1', RED, CAPTAIN);
      await CustomLobbies.ready('lobbyId', 'player1');
      const lobby = await CustomLobbies.get('lobbyId');
      expect(lobby.get(READIED)).to.include('player1');
    });
    
    it('cannot ready without a role', async () => {
      await expect(CustomLobbies.ready('lobbyId', 'player1')).to.be.rejected;
    });
    
    it('unready', async () => {
      await CustomLobbies.selectRole('lobbyId', 'player1', RED, CAPTAIN);
      await CustomLobbies.ready('lobbyId', 'player1');
      await CustomLobbies.unready('lobbyId', 'player1');
      const lobby = await CustomLobbies.get('lobbyId');
      expect(lobby.get(READIED)).to.not.include('player1');
    });
    
    it('unready when role removed', async () => {
      await CustomLobbies.selectRole('lobbyId', 'player1', RED, CAPTAIN);
      await CustomLobbies.ready('lobbyId', 'player1');
      await CustomLobbies.selectRole('lobbyId', 'player1', null, null);
      const lobby = await CustomLobbies.get('lobbyId');
      expect(lobby.get(READIED)).to.not.include('player1');
    });
  });
  
  it('.shouldStartGame', async () => {
    await Promise.all(
      createRange(0, 8).map(i =>
        CustomLobbies.addPlayer('lobbyId', `player${i}`, `username${i}`))
    );
    
    expect(shouldStartGame(await CustomLobbies.get('lobbyId'))).to.be.false;
    
    await Promise.all(
      createRange(0, 8).map(i =>
        CustomLobbies.selectRole(
          'lobbyId',
          `player${i}`,
          BOTH_TEAMS[Math.floor(i / 4)],
          ALL_ROLES[i % 4]
        ))
    );
    
    await Promise.all(
      createRange(0, 8).map(i =>
        CustomLobbies.ready('lobbyId', `player${i}`))
    );
    
  })
});
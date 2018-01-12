import Immutable from 'immutable';
import {
  BREAKDOWNS, COMMON, GRID, PLAYERS, STARTED, SUB_LOCATION, SUB_PATH, SUBSYSTEMS, SYSTEMS, TEAMS, TURN_INFO,
  USERNAMES
} from '../../../src/common/StateFields';
import { BLUE, RED } from '../../../src/common/Team';
import expect from '../../expect';
import { mockLobby } from '../../mocks';

describe('Games', () => {
  let Games;
  beforeEach(() => {
    // Get a fresh copy of Games every test
    delete require.cache[require.resolve('../../../src/server/resources/Games')];
    Games = require('../../../src/server/resources/Games').default;
  });
  
  it('should create a game', async () => {
    // TODO: Do this in GameFactoryTest
    const lobby = mockLobby();
    const game = await Games.create(null, {
      players: lobby.get(PLAYERS),
      usernames: lobby.get(USERNAMES),
      teams: lobby.get(TEAMS)
    });
    
    const common = game.get(COMMON);
    expect(common).to.have.property(STARTED, false);
    expect(common.get(PLAYERS)).to.have.size(8);
    expect(common.get(USERNAMES)).to.have.size(8);
    
    expect(game.get(GRID)).to.exist;
    expect(game.get(SUBSYSTEMS)).to.exist;
    
    // TODO: Better testing
    for (const teamInfo of [game.get(RED), game.get(BLUE)]) {
      expect(teamInfo.get(TURN_INFO)).to.exist;
      expect(teamInfo.get(SUB_LOCATION)).to.be.null;
      expect(teamInfo.get(SUB_PATH)).to.exist;
      expect(teamInfo.get(BREAKDOWNS)).to.exist;
      expect(teamInfo.get(SYSTEMS)).to.exist;
    }
  });
  
  describe('Captain', async () => {
    it('.setStartLocation()', async () => {
      const lobby = mockLobby();
      await Games.create('gameId', {
        players: lobby.get(PLAYERS),
        usernames: lobby.get(USERNAMES),
        teams: lobby.get(TEAMS)
      });
      await Games.setStartLocation('gameId', RED, Immutable.List([1, 2]));
      expect((await Games.get('gameId')).get(COMMON)).to.have.property(STARTED, false);
      await Games.setStartLocation('gameId', BLUE, Immutable.List([2, 3]));
      expect((await Games.get('gameId')).get(COMMON)).to.have.property(STARTED, true);
    });
    
    // TODO: Test Captain Actions
  });
  
  describe('First Mate', async () => {
    // TODO: Test First Mate actions
  });
  describe('Engineer', async () => {
    // TODO: Test Engineer actions
  });
});
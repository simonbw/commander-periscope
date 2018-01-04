import Immutable from 'immutable';
import { CAPTAIN, ENGINEER, FIRST_MATE, RADIO_OPERATOR } from '../../../src/common/Role';
import {
  BREAKDOWNS, COMMON, ENGINE_LAYOUT, GRID, PLAYERS, STARTED, SUB_LOCATIONS, SUB_PATHS, SYSTEMS, TEAMS, TURN_INFO,
  USERNAMES
} from '../../../src/common/StateFields';
import { BLUE, RED } from '../../../src/common/Team';
import { createRange } from '../../../src/common/util/ImmutableUtil';
import expect from '../../expect';

function mockLobby() {
  const players = createRange(1, 9).map(i => `id${i}`);
  const usernames = Immutable.Map(players.map((playerId, i) => [playerId, `player${i + 1}`]));
  return Immutable.fromJS({
    players,
    usernames,
    teams: {
      [RED]: {
        [CAPTAIN]: players.get(0),
        [FIRST_MATE]: players.get(1),
        [ENGINEER]: players.get(2),
        [RADIO_OPERATOR]: players.get(3)
      },
      [BLUE]: {
        [CAPTAIN]: players.get(4),
        [FIRST_MATE]: players.get(5),
        [ENGINEER]: players.get(6),
        [RADIO_OPERATOR]: players.get(7)
      }
    }
  })
}

describe('Games', () => {
  let Games;
  beforeEach(() => {
    // Get a fresh copy of Games every test
    delete require.cache[require.resolve('../../../src/server/data/Games')];
    Games = require('../../../src/server/data/Games').default;
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
    
    // TODO: Better testing
    expect(game.get(TURN_INFO)).to.exist;
    expect(game.get(GRID)).to.exist;
    expect(game.get(SUB_LOCATIONS)).to.exist;
    expect(game.get(SUB_PATHS)).to.exist;
    expect(game.get(BREAKDOWNS)).to.exist;
    expect(game.get(ENGINE_LAYOUT)).to.exist;
    expect(game.get(SYSTEMS)).to.exist;
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
  });
  
  describe('First Mate', async () => {
    // TODO: Test First Mate actions
  });
  describe('Engineer', async () => {
    // TODO: Test Engineer actions
  });
});
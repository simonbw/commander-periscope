import Immutable from 'immutable';
import { CAPTAIN, ENGINEER, FIRST_MATE, RADIO_OPERATOR } from '../../../src/common/Role';
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
      players: lobby.get('players'),
      usernames: lobby.get('usernames'),
      teams: lobby.get('teams')
    });
    
    const common = game.get('common');
    expect(common).to.have.property('started', false);
    expect(common.get('players')).to.have.size(8);
    expect(common.get('usernames')).to.have.size(8);
    
    // TODO: Better testing
    expect(game.get('turnInfo')).to.exist;
    expect(game.get('grid')).to.exist;
    expect(game.get('subLocations')).to.exist;
    expect(game.get('subPaths')).to.exist;
    expect(game.get('breakdowns')).to.exist;
    expect(game.get('engineLayout')).to.exist;
    expect(game.get('systems')).to.exist;
  });
  
  describe('Captain', async () => {
    it('.setStartLocation()', async () => {
      const lobby = mockLobby();
      await Games.create('gameId', {
        players: lobby.get('players'),
        usernames: lobby.get('usernames'),
        teams: lobby.get('teams')
      });
      await Games.setStartLocation('gameId', RED, Immutable.List([1, 2]));
      expect((await Games.get('gameId')).get('common')).to.have.property('started', false);
      await Games.setStartLocation('gameId', BLUE, Immutable.List([2, 3]));
      expect((await Games.get('gameId')).get('common')).to.have.property('started', true);
    });
  });
  
  describe('First Mate', async () => {
    // TODO: Test First Mate actions
  });
  describe('Engineer', async () => {
    // TODO: Test Engineer actions
  });
});
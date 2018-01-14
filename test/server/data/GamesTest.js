import Immutable, { List } from 'immutable';
import { EAST, NORTH, SOUTH } from '../../../src/common/Grid';
import {
  BREAKDOWNS, COMMON, GRID, PLAYERS, STARTED, SUB_LOCATION, SUB_PATH, SUBSYSTEMS, SYSTEMS, TEAMS, TURN_INFO,
  USERNAMES
} from '../../../src/common/StateFields';
import { CHARGE, DIRECTION, DRONE, MINE, SILENT, SONAR, TORPEDO } from '../../../src/common/System';
import { BLUE, RED } from '../../../src/common/Team';
import { GameStateError } from '../../../src/server/resources/GameAssertions';
import expect from '../../expect';
import { mockLobby } from '../../mocks';

describe('Games', () => {
  let Games;
  beforeEach(() => {
    // Get a fresh copy of Games every test
    delete require.cache[require.resolve('../../../src/server/resources/Games')];
    Games = require('../../../src/server/resources/Games').default;
  });
  
  async function createStartedGame(gameId = 'gameId', redStart = List([1, 1]), blueStart = List([1, 1])) {
    const lobby = mockLobby();
    await Games.createFromLobby(lobby, gameId);
    await Games.setStartLocation(gameId, RED, redStart);
    await Games.setStartLocation(gameId, BLUE, blueStart);
    return await Games.get(gameId);
  }
  
  async function doMove(gameId, team, direction = SOUTH, system = TORPEDO) {
    await Games.headInDirection(gameId, team, direction);
    await Games.chargeSystem(gameId, team, system);
    await trackAnyBreakdown(gameId, team, direction);
  }
  
  async function trackAnyBreakdown(gameId, team, direction) {
    const game = await Games.get(gameId);
    const breakdown = game.get(SUBSYSTEMS)
      .entrySeq()
      .filter(([i, s]) => s.get(DIRECTION) === direction)
      .filter(([i, s]) => !game.getIn([team, BREAKDOWNS]).includes(i))
      .first()[0];
    await Games.trackBreakdown(gameId, team, breakdown);
    return breakdown;
  }
  
  // Hack for getting rid of breakdowns
  async function clearBreakdowns() {
    await Games.update('gameId', null, null,
      (game) => game.setIn([RED, BREAKDOWNS], Immutable.Set()));
  }
  
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
  
  describe('Captain', () => {
    it('.setStartLocation()', async () => {
      await Games.createFromLobby(mockLobby(), 'gameId');
      
      const redLocation = List([1, 2]);
      const blueLocation = List([2, 3]);
      
      let game = await Games.setStartLocation('gameId', RED, redLocation);
      expect(game.get(COMMON)).to.have.property(STARTED, false);
      
      game = await Games.setStartLocation('gameId', BLUE, blueLocation);
      
      expect(game.get(COMMON)).to.have.property(STARTED, true);
      expect(game.getIn([RED, SUB_LOCATION])).to.equal(redLocation);
      expect(game.getIn([BLUE, SUB_LOCATION])).to.equal(blueLocation);
    });
    
    it('.headInDirection()', async () => {
      await createStartedGame('gameId', List([1, 1]), List([2, 2]));
      
      await Games.headInDirection('gameId', RED, SOUTH);
      await Games.headInDirection('gameId', BLUE, EAST);
      expect((await Games.get('gameId')).getIn([RED, SUB_LOCATION])).to.equal(List([1, 2]));
      expect((await Games.get('gameId')).getIn([BLUE, SUB_LOCATION])).to.equal(List([3, 2]));
      
      await expect(
        Games.headInDirection('gameId', RED, NORTH),
        `Shouldn't be able to move again without engineer and first mate going`
      ).to.be.rejected;
    });
    
    it('.fireTorpedo()', async () => {
      await createStartedGame('gameId', List([1, 1]), List([1, 6]));
      
      await expect(
        Games.fireTorpedo('gameId', RED, List([1, 1])),
        'Should not be able to fire torpedo without system charged'
      ).to.be.rejectedWith(GameStateError);
      
      await doMove('gameId', RED, SOUTH, TORPEDO);
      await doMove('gameId', RED, SOUTH, TORPEDO);
      await doMove('gameId', RED, SOUTH, TORPEDO);
      await clearBreakdowns();
      
      await expect(
        Games.fireTorpedo('gameId', RED, List([10, 10])),
        'Should not be able to fire torpedo beyond range'
      ).to.be.rejectedWith(GameStateError);
      
      // Finally success
      await Games.fireTorpedo('gameId', RED, List([1, 6]));
      expect((await Games.get('gameId')).getIn([RED, SYSTEMS, TORPEDO, CHARGE])).to.equal(0);
      
      // TODO: Test damage
    });
    
    it('.dropMine()', async () => {
      await createStartedGame('gameId', List([1, 1]), List([1, 6]));
      
      await expect(
        Games.dropMine('gameId', RED, List([1, 1])),
        'Should not be able to drop mine without system charged'
      ).to.be.rejectedWith(GameStateError);
      
      await doMove('gameId', RED, SOUTH, MINE);
      await doMove('gameId', RED, SOUTH, MINE);
      await doMove('gameId', RED, SOUTH, MINE);
      await clearBreakdowns(); // we're now at [1, 4]
      
      await expect(
        Games.dropMine('gameId', RED, List([1, 6])),
        'Should not be able to drop mine at non-adjacent location'
      ).to.be.rejectedWith(GameStateError);
      
      await expect(
        Games.dropMine('gameId', RED, List([1, 4])),
        'Should not be able to drop mine on self'
      ).to.be.rejectedWith(GameStateError);
      
      await expect(
        Games.dropMine('gameId', RED, List([1, 3])),
        'Should not be able to drop mine on path'
      ).to.be.rejectedWith(GameStateError);
      
      // Finally success
      await Games.dropMine('gameId', RED, List([2, 5]));
      expect((await Games.get('gameId')).getIn([RED, SYSTEMS, MINE, CHARGE])).to.equal(0);
    });
    
    it('.useSonar()', async () => {
      await createStartedGame('gameId', List([1, 1]), List([1, 6]));
      
      await expect(
        Games.useSonar('gameId', RED),
        'Should not be able to use sonar without system charged'
      ).to.be.rejectedWith(GameStateError);
      
      await doMove('gameId', RED, SOUTH, SONAR);
      await doMove('gameId', RED, SOUTH, SONAR);
      await doMove('gameId', RED, SOUTH, SONAR);
      await clearBreakdowns(); // we're now at [1, 4]
      
      await Games.useSonar('gameId', RED);
      expect((await Games.get('gameId')).getIn([RED, SYSTEMS, SONAR, CHARGE])).to.equal(0);
    });
    
    it('.useDrone()', async () => {
      await createStartedGame('gameId', List([1, 1]), List([1, 6]));
      
      await expect(
        Games.useDrone('gameId', RED, 1),
        'Should not be able to use drone without system charged'
      ).to.be.rejectedWith(GameStateError);
      
      await doMove('gameId', RED, SOUTH, DRONE);
      await doMove('gameId', RED, SOUTH, DRONE);
      await doMove('gameId', RED, SOUTH, DRONE);
      await doMove('gameId', RED, SOUTH, DRONE);
      await clearBreakdowns(); // we're now at [1, 5]
      
      await expect(
        Games.useDrone('gameId', RED, 10),
        'Should not allow sectors > 9'
      ).to.be.rejectedWith(GameStateError); // TODO: ArgumentError?
      
      await expect(
        Games.useDrone('gameId', RED, 0),
        'Should not allow sectors < 1'
      ).to.be.rejectedWith(GameStateError); // TODO: ArgumentError?
      
      await Games.useDrone('gameId', RED, 5);
      expect((await Games.get('gameId')).getIn([RED, SYSTEMS, DRONE, CHARGE])).to.equal(0);
    });
    
    it('.goSilent()', async () => {
      await createStartedGame('gameId', List([1, 1]), List([1, 6]));
      
      await expect(
        Games.goSilent('gameId', RED, List([3, 1])),
        'Should not be able to go silent without system charged'
      ).to.be.rejectedWith(GameStateError);
      
      await doMove('gameId', RED, SOUTH, SILENT);
      await doMove('gameId', RED, SOUTH, SILENT);
      await doMove('gameId', RED, SOUTH, SILENT);
      await clearBreakdowns(); // we're now at [1, 6]
      await doMove('gameId', RED, SOUTH, SILENT);
      await doMove('gameId', RED, SOUTH, SILENT);
      await doMove('gameId', RED, SOUTH, SILENT);
      await clearBreakdowns(); // we're now at [1, 7]
      
      await expect(
        Games.goSilent('gameId', RED, List([2, 8])),
        'Must move in straight line'
      ).to.be.rejectedWith(GameStateError); // TODO: ArgumentError?
      
      // TODO: Test out of bounds
      
      await expect(
        Games.goSilent('gameId', RED, List([1, 11])),
        'Cannot move more than 3 squares'
      ).to.be.rejectedWith(GameStateError); // TODO: ArgumentError?
      
      await Games.goSilent('gameId', RED, List([1, 10]));
      expect((await Games.get('gameId')).getIn([RED, SYSTEMS, SILENT, CHARGE])).to.equal(0);
    });
    
    it('.detonateMine()', async () => {
      await createStartedGame('gameId', List([1, 1]), List([1, 6]));
      await doMove('gameId', RED, SOUTH, MINE);
      await doMove('gameId', RED, SOUTH, MINE);
      await doMove('gameId', RED, SOUTH, MINE);
      await clearBreakdowns(); // we're now at [1, 4]
      await Games.dropMine('gameId', RED, List([2, 5]));
      
      await expect(
        Games.detonateMine('gameId', RED, List([10, 10])),
        'Should not detonate mine on location without mine'
      ).to.be.rejectedWith(GameStateError);
      
      await Games.detonateMine('gameId', RED, List([2, 5]));
      
      await expect(
        Games.detonateMine('gameId', RED, List([10, 10])),
        'Should not detonate same mine twice'
      ).to.be.rejectedWith(GameStateError);
    });
  });
  
  describe('First Mate', () => {
    it('.chargeSystem()', async () => {
      // Nothing at start
      await Games.createFromLobby(mockLobby(), 'gameId');
      await expect(Games.chargeSystem('gameId', RED, TORPEDO), `Game isn't started yet`).to.be.rejected;
      
      await Games.setStartLocation('gameId', RED, List([1, 1]));
      await Games.setStartLocation('gameId', BLUE, List([1, 1]));
      await expect(
        Games.chargeSystem('gameId', RED, TORPEDO),
        `Captain hasn't gone yet`
      ).to.be.rejected;
      
      // First turn
      await doMove('gameId', RED, SOUTH, TORPEDO);
      expect((await Games.get('gameId')).getIn([RED, SYSTEMS, TORPEDO, CHARGE])).to.equal(1);
      await expect(
        Games.chargeSystem('gameId', RED, TORPEDO),
        `Captain hasn't gone yet`
      ).to.be.rejected;
      
      // Next turn
      await doMove('gameId', RED, SOUTH, TORPEDO);
      expect((await Games.get('gameId')).getIn([RED, SYSTEMS, TORPEDO, CHARGE])).to.equal(2);
      
      // Fully charge
      await doMove('gameId', RED, SOUTH, TORPEDO);
      expect((await Games.get('gameId')).getIn([RED, SYSTEMS, TORPEDO, CHARGE])).to.equal(3);
      
      // Extra charge is ignored
      await doMove('gameId', RED, SOUTH, TORPEDO);
      expect((await Games.get('gameId')).getIn([RED, SYSTEMS, TORPEDO, CHARGE])).to.equal(3);
    });
  });
  
  describe('Engineer', () => {
    it('.trackBreakdown()', async () => {
      await createStartedGame('gameId');
      
      await expect(
        Games.trackBreakdown('gameId', RED, 0),
        'Should have to wait for captain'
      ).to.be.rejectedWith(GameStateError);
      
      await Games.headInDirection('gameId', RED, SOUTH);
      await Games.chargeSystem('gameId', RED, TORPEDO);
      
      await expect(
        trackAnyBreakdown('gameId', RED, NORTH),
        'Must track a breakdown with same direction as move'
      ).to.be.rejectedWith(GameStateError);
      
      const firstBreakdown = await trackAnyBreakdown('gameId', RED, SOUTH);
      
      await Games.headInDirection('gameId', RED, SOUTH);
      await Games.chargeSystem('gameId', RED, TORPEDO);
      
      await expect(
        Games.trackBreakdown('gameId', RED, firstBreakdown),
        'Cannot track same breakdown twice'
      ).to.be.rejectedWith(GameStateError);
      
    });
  });
});

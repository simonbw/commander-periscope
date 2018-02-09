import Immutable, { List } from 'immutable';
import {
  BREAKDOWNS, GRID, HIT_POINTS, PHASE, SUB_LOCATION, SUB_PATH, SUBSYSTEMS, SURFACED, SYSTEMS, TURN_INFO, WINNER
} from '../../../src/common/fields/GameFields';
import { EAST, NORTH, SOUTH, WEST } from '../../../src/common/models/Direction';
import { ENDED_PHASE, MAIN_PHASE, PICK_PHASE } from '../../../src/common/models/GamePhase';
import { LAND_TILE } from '../../../src/common/models/Grid';
import { CHARGE, DIRECTION, DRONE, MINE, SILENT, SONAR, TORPEDO } from '../../../src/common/models/System';
import { BLUE, RED } from '../../../src/common/models/Team';
import { sleep } from '../../../src/common/util/AsyncUtil';
import { GameStateError } from '../../../src/server/GameAssertions';
import expect from '../../expect';
import { mockLobby } from '../../mocks';

describe('Games', () => {
  let Games;
  beforeEach(() => {
    // Get a fresh copy of Games every test
    delete require.cache[require.resolve('../../../src/server/resources/Games')];
    Games = require('../../../src/server/resources/Games').default;
  });
  
  async function createStartedGame(gameId = 'testGameId', redStart = List([1, 1]), blueStart = List([1, 1])) {
    const lobby = mockLobby();
    await Games.createFromLobby(lobby, gameId);
    await Games.setStartLocation(gameId, RED, redStart);
    await Games.setStartLocation(gameId, BLUE, blueStart);
    return await Games.get(gameId);
  }
  
  async function doMove(gameId, team, direction = SOUTH, system = TORPEDO, shouldClearBreakdowns = false) {
    await Games.headInDirection(gameId, team, direction);
    await Games.chargeSystem(gameId, team, system);
    await trackAnyBreakdown(gameId, team, direction);
    if (shouldClearBreakdowns) {
      await clearBreakdowns(gameId, team);
    }
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
  async function clearBreakdowns(gameId = 'testGameId', team = RED) {
    await Games.update(gameId, null, null,
      (game) => game.setIn([team, BREAKDOWNS], Immutable.Set()));
  }
  
  it('.createFromLobby', async () => {
    const lobby = mockLobby();
    const game = await Games.createFromLobby(lobby);
    
    expect(game.get(GRID)).to.exist;
    expect(game.get(SUBSYSTEMS)).to.exist;
    
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
      await Games.createFromLobby(mockLobby(), 'testGameId');
      
      const redLocation = List([1, 2]);
      const blueLocation = List([2, 3]);
      
      let game = await Games.setStartLocation('testGameId', RED, redLocation);
      expect(game.get(PHASE)).to.equal(PICK_PHASE);
      
      game = await Games.setStartLocation('testGameId', BLUE, blueLocation);
      
      expect(game.get(PHASE)).to.equal(MAIN_PHASE);
      expect(game.getIn([RED, SUB_LOCATION])).to.equal(redLocation);
      expect(game.getIn([BLUE, SUB_LOCATION])).to.equal(blueLocation);
    });
    
    it('.headInDirection()', async () => {
      await createStartedGame('testGameId', List([1, 1]), List([3, 2]));
      
      await Games.headInDirection('testGameId', RED, SOUTH);
      await Games.headInDirection('testGameId', BLUE, EAST);
      expect((await Games.get('testGameId')).getIn([RED, SUB_LOCATION])).to.equal(List([1, 2]));
      expect((await Games.get('testGameId')).getIn([BLUE, SUB_LOCATION])).to.equal(List([4, 2]));
      
      await expect(
        Games.headInDirection('testGameId', RED, NORTH),
        `Shouldn't be able to move again without engineer and first mate going`
      ).to.be.rejected;
    });
    
    it('.surface()', async () => {
      await createStartedGame('testGameId');
      
      await Games.headInDirection('testGameId', RED, SOUTH);
      const surfacePromise = Games.surface('testGameId', RED, 100);
      await sleep(20);
      expect((await Games.get('testGameId')).getIn([RED, SURFACED])).to.equal(true);
      await surfacePromise;
      expect((await Games.get('testGameId')).getIn([RED, SURFACED])).to.equal(false);
    });
    
    it('.fireTorpedo()', async () => {
      await createStartedGame('testGameId', List([1, 1]), List([1, 6]));
      
      await expect(
        Games.fireTorpedo('testGameId', RED, List([1, 1])),
        'Should not be able to fire torpedo without system charged'
      ).to.be.rejectedWith(GameStateError);
      
      await doMove('testGameId', RED, SOUTH, TORPEDO);
      await doMove('testGameId', RED, SOUTH, TORPEDO);
      await doMove('testGameId', RED, SOUTH, TORPEDO);
      await clearBreakdowns('testGameId', RED);
      
      await expect(
        Games.fireTorpedo('testGameId', RED, List([10, 10])),
        'Should not be able to fire torpedo beyond range'
      ).to.be.rejectedWith(GameStateError);
      
      // Finally success
      await Games.fireTorpedo('testGameId', RED, List([1, 6]));
      expect((await Games.get('testGameId')).getIn([RED, SYSTEMS, TORPEDO, CHARGE])).to.equal(0);
      
      // TODO: Test damage
      // expect((await Games.get()))
    });
    
    it('.dropMine()', async () => {
      await createStartedGame('testGameId', List([1, 1]), List([1, 6]));
      
      await expect(
        Games.dropMine('testGameId', RED, List([1, 1])),
        'Should not be able to drop mine without system charged'
      ).to.be.rejectedWith(GameStateError);
      
      await doMove('testGameId', RED, SOUTH, MINE);
      await doMove('testGameId', RED, SOUTH, MINE);
      await doMove('testGameId', RED, SOUTH, MINE);
      await clearBreakdowns('testGameId', RED); // we're now at [1, 4]
      
      await expect(
        Games.dropMine('testGameId', RED, List([1, 6])),
        'Should not be able to drop mine at non-adjacent location'
      ).to.be.rejectedWith(GameStateError);
      
      await expect(
        Games.dropMine('testGameId', RED, List([1, 4])),
        'Should not be able to drop mine on self'
      ).to.be.rejectedWith(GameStateError);
      
      await expect(
        Games.dropMine('testGameId', RED, List([1, 3])),
        'Should not be able to drop mine on path'
      ).to.be.rejectedWith(GameStateError);
      
      // Finally success
      await Games.dropMine('testGameId', RED, List([2, 5]));
      expect((await Games.get('testGameId')).getIn([RED, SYSTEMS, MINE, CHARGE])).to.equal(0);
    });
    
    it('.useSonar()', async () => {
      await createStartedGame('testGameId', List([1, 1]), List([1, 6]));
      
      await expect(
        Games.useSonar('testGameId', RED),
        'Should not be able to use sonar without system charged'
      ).to.be.rejectedWith(GameStateError);
      
      await doMove('testGameId', RED, SOUTH, SONAR);
      await doMove('testGameId', RED, SOUTH, SONAR);
      await doMove('testGameId', RED, SOUTH, SONAR);
      await clearBreakdowns('testGameId', RED); // we're now at [1, 4]
      
      await Games.useSonar('testGameId', RED);
      expect((await Games.get('testGameId')).getIn([RED, SYSTEMS, SONAR, CHARGE])).to.equal(0);
    });
    
    it('.useDrone()', async () => {
      await createStartedGame('testGameId', List([1, 1]), List([1, 6]));
      
      await expect(
        Games.useDrone('testGameId', RED, 1),
        'Should not be able to use drone without system charged'
      ).to.be.rejectedWith(GameStateError);
      
      await doMove('testGameId', RED, SOUTH, DRONE);
      await doMove('testGameId', RED, SOUTH, DRONE);
      await doMove('testGameId', RED, SOUTH, DRONE);
      await doMove('testGameId', RED, SOUTH, DRONE);
      await clearBreakdowns('testGameId', RED); // we're now at [1, 5]
      
      await expect(
        Games.useDrone('testGameId', RED, 9),
        'Should not allow sectors >= 9'
      ).to.be.rejectedWith(GameStateError);
      
      await expect(
        Games.useDrone('testGameId', RED, -1),
        'Should not allow sectors < 0'
      ).to.be.rejectedWith(GameStateError);
      
      await Games.useDrone('testGameId', RED, 5);
      expect((await Games.get('testGameId')).getIn([RED, SYSTEMS, DRONE, CHARGE])).to.equal(0);
    });
    
    it('.goSilent()', async () => {
      await createStartedGame('testGameId', List([1, 1]), List([1, 6]));
      await Games.update('testGameId', '', '', (game) => game.setIn([GRID, 3, 7], LAND_TILE));
      
      await expect(
        Games.goSilent('testGameId', RED, List([3, 1])),
        'Should not be able to go silent without system charged'
      ).to.be.rejectedWith(GameStateError);
      
      await doMove('testGameId', RED, SOUTH, SILENT);
      await doMove('testGameId', RED, SOUTH, SILENT);
      await doMove('testGameId', RED, SOUTH, SILENT);
      await clearBreakdowns('testGameId', RED);
      await doMove('testGameId', RED, SOUTH, SILENT);
      await doMove('testGameId', RED, SOUTH, SILENT);
      await doMove('testGameId', RED, SOUTH, SILENT);
      await doMove('testGameId', RED, EAST, SILENT);
      await clearBreakdowns('testGameId', RED);
      expect((await Games.get('testGameId')).getIn([RED, SUB_LOCATION])).to.equal(List([2, 7]));
      
      await expect(
        Games.goSilent('testGameId', RED, List([3, 8])),
        'Must move in straight line'
      ).to.be.rejectedWith(GameStateError);
      
      await expect(
        Games.goSilent('testGameId', RED, List([2, 11])),
        'Cannot move more than 3 squares'
      ).to.be.rejectedWith(GameStateError);
      
      await expect(
        Games.goSilent('testGameId', RED, List([4, 7])),
        'Cannot move through land'
      ).to.be.rejectedWith(GameStateError);
      
      await expect(
        Games.goSilent('testGameId', RED, List([1, 7])),
        'Cannot move through path'
      ).to.be.rejectedWith(GameStateError);
      
      await Games.goSilent('testGameId', RED, List([2, 10]));
      expect((await Games.get('testGameId')).getIn([RED, SYSTEMS, SILENT, CHARGE])).to.equal(0);
      expect((await Games.get('testGameId')).getIn([RED, SUB_LOCATION])).to.equal(List([2, 10]));
      expect((await Games.get('testGameId')).getIn([RED, SUB_PATH])).to.have.size(10);
    });
    
    it('.detonateMine()', async () => {
      await createStartedGame('testGameId', List([1, 1]), List([1, 6]));
      await doMove('testGameId', RED, SOUTH, MINE);
      await doMove('testGameId', RED, SOUTH, MINE);
      await doMove('testGameId', RED, SOUTH, MINE);
      await clearBreakdowns('testGameId', RED); // we're now at [1, 4]
      await Games.dropMine('testGameId', RED, List([2, 5]));
      
      await expect(
        Games.detonateMine('testGameId', RED, List([10, 10])),
        'Should not detonate mine on location without mine'
      ).to.be.rejectedWith(GameStateError);
      
      await Games.detonateMine('testGameId', RED, List([2, 5]));
      
      await expect(
        Games.detonateMine('testGameId', RED, List([10, 10])),
        'Should not detonate same mine twice'
      ).to.be.rejectedWith(GameStateError);
    });
  });
  
  describe('First Mate', () => {
    it('.chargeSystem()', async () => {
      // Nothing at start
      await Games.createFromLobby(mockLobby(), 'testGameId');
      await expect(Games.chargeSystem('testGameId', RED, TORPEDO), `Game isn't started yet`).to.be.rejected;
      
      await Games.setStartLocation('testGameId', RED, List([1, 1]));
      await Games.setStartLocation('testGameId', BLUE, List([1, 1]));
      await expect(
        Games.chargeSystem('testGameId', RED, TORPEDO),
        `Captain hasn't gone yet`
      ).to.be.rejected;
      
      // First turn
      await doMove('testGameId', RED, SOUTH, TORPEDO);
      expect((await Games.get('testGameId')).getIn([RED, SYSTEMS, TORPEDO, CHARGE])).to.equal(1);
      await expect(
        Games.chargeSystem('testGameId', RED, TORPEDO),
        `Captain hasn't gone yet`
      ).to.be.rejected;
      
      // Next turn
      await doMove('testGameId', RED, SOUTH, TORPEDO);
      expect((await Games.get('testGameId')).getIn([RED, SYSTEMS, TORPEDO, CHARGE])).to.equal(2);
      
      // Fully charge
      await doMove('testGameId', RED, SOUTH, TORPEDO);
      expect((await Games.get('testGameId')).getIn([RED, SYSTEMS, TORPEDO, CHARGE])).to.equal(3);
      
      // Extra charge is ignored
      await doMove('testGameId', RED, SOUTH, TORPEDO);
      expect((await Games.get('testGameId')).getIn([RED, SYSTEMS, TORPEDO, CHARGE])).to.equal(3);
    });
  });
  
  describe('Engineer', () => {
    it('.trackBreakdown()', async () => {
      await createStartedGame('testGameId');
      
      await expect(
        Games.trackBreakdown('testGameId', RED, 0),
        'Should have to wait for captain'
      ).to.be.rejectedWith(GameStateError);
      
      await Games.headInDirection('testGameId', RED, SOUTH);
      await Games.chargeSystem('testGameId', RED, TORPEDO);
      
      await expect(
        trackAnyBreakdown('testGameId', RED, NORTH),
        'Must track a breakdown with same direction as move'
      ).to.be.rejectedWith(GameStateError);
      
      const firstBreakdown = await trackAnyBreakdown('testGameId', RED, SOUTH);
      
      await Games.headInDirection('testGameId', RED, SOUTH);
      await Games.chargeSystem('testGameId', RED, TORPEDO);
      
      await expect(
        Games.trackBreakdown('testGameId', RED, firstBreakdown),
        'Cannot track same breakdown twice'
      ).to.be.rejectedWith(GameStateError);
    });
  });
  
  it('Damage should end the game', async () => {
    await createStartedGame('testGameId', List([1, 1]), List([5, 5]));
    
    await doMove('testGameId', RED, SOUTH, TORPEDO, true); // [1, 2]
    await doMove('testGameId', BLUE, NORTH, MINE, true); // [5, 4]
    
    await doMove('testGameId', RED, SOUTH, TORPEDO, true); // [1, 3]
    await doMove('testGameId', BLUE, NORTH, MINE, true); // [5, 3]
    
    await doMove('testGameId', RED, EAST, TORPEDO, true); // [2, 3]
    await doMove('testGameId', BLUE, WEST, MINE, true); // [4, 3]
    
    await Games.dropMine('testGameId', BLUE, List([3, 3]));
    await Games.detonateMine('testGameId', BLUE, List([3, 3]));
    
    expect((await Games.get('testGameId')).getIn([RED, HIT_POINTS])).to.equal(3);
    expect((await Games.get('testGameId')).getIn([BLUE, HIT_POINTS])).to.equal(3);
    
    await Games.fireTorpedo('testGameId', RED, List([3, 3]));
    
    expect((await Games.get('testGameId')).getIn([RED, HIT_POINTS])).to.equal(2);
    expect((await Games.get('testGameId')).getIn([BLUE, HIT_POINTS])).to.equal(2);
    
    await doMove('testGameId', RED, NORTH, TORPEDO, true); // [2, 2]
    await doMove('testGameId', RED, EAST, TORPEDO, true); // [3, 2]
    await doMove('testGameId', RED, SOUTH, TORPEDO, true); // [3, 3]
    
    await Games.fireTorpedo('testGameId', RED, List([3, 3]));
    
    expect((await Games.get('testGameId')).getIn([RED, HIT_POINTS])).to.equal(0);
    expect((await Games.get('testGameId')).getIn([BLUE, HIT_POINTS])).to.equal(1);
    expect((await Games.get('testGameId')).get(PHASE)).to.equal(ENDED_PHASE);
    expect((await Games.get('testGameId')).get(WINNER)).to.equal(BLUE);
    
    await expect(Games.headInDirection('testGameId', RED, SOUTH)).to.be.rejectedWith(GameStateError);
  });
});

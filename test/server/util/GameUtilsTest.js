import Immutable from 'immutable';
import { TEAMS } from '../../../src/common/fields/CommonFields';
import { BREAKDOWNS, SUBSYSTEMS, SYSTEMS } from '../../../src/common/fields/GameFields';
import { CAPTAIN, ENGINEER } from '../../../src/common/models/Role';
import {
  CHARGE, CIRCUIT, COMMS, DRONE, MAX_CHARGE, MINE, SYSTEM_TYPE, TORPEDO
} from '../../../src/common/models/System';
import { BLUE, RED } from '../../../src/common/models/Team';
import { canUseSystem, checkEngineOverload, fixCircuits, getPlayerPosition } from '../../../src/common/util/GameUtils';
import { createStandardSubsystems } from '../../../src/server/factories/SubsystemFactory';
import expect from '../../expect';
import { mockGame } from '../../mocks';

describe('GameUtils', () => {
  let CustomLobbies;
  beforeEach(() => {
    delete require.cache[require.resolve('../../../src/server/resources/CustomLobbies')];
    CustomLobbies = require('../../../src/server/resources/CustomLobbies').default;
  });
  
  it('.getPlayerPosition', () => {
    const game = mockGame();
    expect(getPlayerPosition(game.get(TEAMS), 'p1')).to.deep.equal({ team: RED, role: CAPTAIN });
    expect(getPlayerPosition(game.get(TEAMS), 'p8')).to.deep.equal({ team: BLUE, role: ENGINEER });
    expect(getPlayerPosition(game.get(TEAMS), 'waldo')).to.equal(undefined);
    expect(getPlayerPosition(undefined, 'waldo')).to.equal(undefined);
    expect(getPlayerPosition(game.get(TEAMS), undefined)).to.equal(undefined);
  });
  
  it('.canUseSystem', () => {
    const game = mockGame().update(game => game
      .updateIn([RED, SYSTEMS, TORPEDO], system => system.set(CHARGE, system.get(MAX_CHARGE)))
      .updateIn([RED, SYSTEMS, DRONE], system => system.set(CHARGE, system.get(MAX_CHARGE)))
      .updateIn([RED, BREAKDOWNS], breakdowns => breakdowns.add(game.get(SUBSYSTEMS).findIndex(
        subsystem => subsystem.get(SYSTEM_TYPE) === COMMS))));
    
    // Uncharged
    expect(canUseSystem(game, RED, MINE)).to.equal(false);
    
    // Charged but broken
    expect(canUseSystem(game, RED, DRONE)).to.equal(false);
    
    // Charged and not broken
    expect(canUseSystem(game, RED, TORPEDO)).to.equal(true);
  });
  
  it('.fixCircuits', async () => {
    const subsystems = mockGame().get(SUBSYSTEMS);
    const oldBreakdowns = subsystems.keySeq().toSet();
    
    const fixedBreakdowns = fixCircuits(subsystems, oldBreakdowns);
    
    expect(subsystems
        .toKeyedSeq()
        .filter((s) => s.get(CIRCUIT))
        .every((s, i) => !fixedBreakdowns.includes(i)),
      'All subsystems on a circuit should be fixed'
    ).to.equal(true);
    
    expect(subsystems
        .toKeyedSeq()
        .filter((s) => s.get(CIRCUIT) === undefined)
        .every((s, i) => fixedBreakdowns.includes(i)),
      'All subsystems not on a circuit should still be broken'
    ).to.equal(true);
  });
  
  it('.checkEngineOverload', async () => {
    const subsystems = createStandardSubsystems();
    expect(checkEngineOverload(subsystems, Immutable.List()), 'No breakdowns').to.equal(false);
    
    // TODO: More tests
    
    // Everything is broken
    const allBreakdowns = subsystems.map((s, i) => i).toSet();
    expect(checkEngineOverload(subsystems, allBreakdowns), `All breakdowns.`).to.equal(true);
  });
  
  // TODO: Test .getGamePhase()
  // TODO: Test .getLastDirectionMoved()
  // TODO: Test .getMoveOptions()
  // TODO: Test .getMineOptions()
  // TODO: Test .getTorpedoOptions()
  // TODO: Test .getSilentOptions()
});
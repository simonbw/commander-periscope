import Immutable from 'immutable';
import { CAPTAIN, ENGINEER } from '../../../src/common/Role';
import { BREAKDOWNS, COMMON, SUBSYSTEMS, SYSTEMS, TEAMS } from '../../../src/common/StateFields';
import { CHARGE, COMMS, DRONE, MAX_CHARGE, MINE, SYSTEM_TYPE, TORPEDO } from '../../../src/common/System';
import { BLUE, RED } from '../../../src/common/Team';
import { canUseSystem, checkEngineOverload, fixCircuits, getPlayerPosition } from '../../../src/common/util/GameUtils';
import { createSubsystems } from '../../../src/server/resources/GameFactory';
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
    expect(getPlayerPosition(game.getIn([COMMON, TEAMS]), 'p1')).to.deep.equal({ team: RED, role: CAPTAIN });
    expect(getPlayerPosition(game.getIn([COMMON, TEAMS]), 'p8')).to.deep.equal({ team: BLUE, role: ENGINEER });
    expect(getPlayerPosition(game.getIn([COMMON, TEAMS]), 'waldo')).to.be.undefined;
  });
  
  // TODO: Test canUseSystem
  
  it('.canUseSystem', () => {
    const game = mockGame().update(game => game
      .updateIn([RED, SYSTEMS, TORPEDO], system => system.set(CHARGE, system.get(MAX_CHARGE)))
      .updateIn([RED, SYSTEMS, DRONE], system => system.set(CHARGE, system.get(MAX_CHARGE)))
      .updateIn([RED, BREAKDOWNS], breakdowns => breakdowns.add(game.get(SUBSYSTEMS).findIndex(
        subsystem => subsystem.get(SYSTEM_TYPE) === COMMS))));
    
    // Uncharged
    expect(canUseSystem(game, RED, MINE)).to.be.false;
    
    // Charged but broken
    expect(canUseSystem(game, RED, DRONE)).to.be.false;
    
    // Charged and not broken
    expect(canUseSystem(game, RED, TORPEDO)).to.be.true;
  });
  
  it('.fixCircuits', async () => {
    const everythingBroken = mockGame().update(game => game
      .setIn([RED, BREAKDOWNS], game.get(SUBSYSTEMS).keySeq().toSet()));
    
    const fixed = fixCircuits(everythingBroken, RED);
    expect(fixed.getIn([RED, BREAKDOWNS])).to.have.size(12); // TODO: Better check
  });
  
  it('.checkEngineOverload', async () => {
    const subsystems = createSubsystems();
    expect(checkEngineOverload(subsystems, Immutable.List()), 'No breakdowns').to.be.false;
    
    // Everything is broken
    const allBreakdowns = subsystems.map((s, i) => i).toSet();
    expect(checkEngineOverload(subsystems, allBreakdowns), `All breakdowns.`).to.be.true;
    
  });
});
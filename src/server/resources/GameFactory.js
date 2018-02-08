import Immutable from 'immutable/dist/immutable';
import {
  BREAKDOWNS, CREATED, GRID, HIT_POINTS, ID, MINE_LOCATIONS, NOTIFICATIONS, PHASE, SUB_LOCATION, SUB_PATH, SUBSYSTEMS,
  SURFACED, SYSTEMS, TURN_INFO, WINNER
} from '../../common/fields/GameFields';
import { PLAYERS, TEAMS, USERNAMES } from '../../common/fields/LobbyFields';
import {
  SYSTEM_IS_USED, TURN_NUMBER, WAITING_FOR_ENGINEER, WAITING_FOR_FIRST_MATE
} from '../../common/fields/TurnInfoFields';
import { PICK_PHASE } from '../../common/GamePhase';
import { CHARGE, DRONE, MAX_CHARGE, MINE, SILENT, SONAR, TORPEDO } from '../../common/System';
import { BLUE, RED } from '../../common/Team';
import { createBravoGrid, createCharlieGrid, createEmptyGrid } from './GridFactory';
import { createStandardSubsystems } from './SubsystemFactory';

// TODO: Something so I don't have to worry about mixing immutable and vanilla types.
export function createGame(id, { [PLAYERS]: players, [USERNAMES]: usernames, [TEAMS]: teams }) {
  return new Immutable.fromJS({
    [CREATED]: Date.now(),
    [GRID]: getGridForId(id),
    [ID]: id,
    [NOTIFICATIONS]: [],
    [PHASE]: PICK_PHASE,
    [PLAYERS]: players,
    [SUBSYSTEMS]: createStandardSubsystems(),
    [TEAMS]: teams,
    [USERNAMES]: usernames,
    [WINNER]: null,
    
    [BLUE]: createTeamInfo(),
    [RED]: createTeamInfo(),
  });
}

function getGridForId(id) {
  if (id === 'testGameId') {
    return createEmptyGrid();
  } else if (id.substr(-('alpha'.length)) === 'alpha') {
    return createBravoGrid();
  } else if (id.substr(-('charlie'.length)) === 'charlie') {
    return createCharlieGrid();
  } else {
    return createBravoGrid();
  }
}

export function createTeamInfo() {
  return Immutable.fromJS({
    [TURN_INFO]: {
      [SYSTEM_IS_USED]: false,
      [TURN_NUMBER]: 0,
      [WAITING_FOR_ENGINEER]: false,
      [WAITING_FOR_FIRST_MATE]: false,
    },
    [BREAKDOWNS]: Immutable.Set(), // indexes into ENGINE_LAYOUT
    [HIT_POINTS]: 4,
    [MINE_LOCATIONS]: [],
    [SUB_LOCATION]: null,
    [SUB_PATH]: [],
    [SURFACED]: false,
    [SYSTEMS]: createSystems(),
  })
}

export function createSystems() {
  return Immutable.fromJS({
    [MINE]: {
      [CHARGE]: 0,
      [MAX_CHARGE]: 3
    },
    [TORPEDO]: {
      [CHARGE]: 0,
      [MAX_CHARGE]: 3
    },
    [DRONE]: {
      [CHARGE]: 0,
      [MAX_CHARGE]: 4
    },
    [SONAR]: {
      [CHARGE]: 0,
      [MAX_CHARGE]: 3
    },
    [SILENT]: {
      [CHARGE]: 0,
      [MAX_CHARGE]: 6
    },
  });
}


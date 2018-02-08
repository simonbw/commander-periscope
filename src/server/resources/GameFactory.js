import Immutable from 'immutable/dist/immutable';
import { ALL_DIRECTIONS } from '../../common/Direction';
import {
  BREAKDOWNS, CREATED, GRID, HIT_POINTS, ID, MINE_LOCATIONS, NOTIFICATIONS, PHASE, SUB_LOCATION, SUB_PATH, SUBSYSTEMS,
  SURFACED, SYSTEMS, TURN_INFO, WINNER
} from '../../common/fields/GameFields';
import { PLAYERS, TEAMS, USERNAMES } from '../../common/fields/LobbyFields';
import {
  SYSTEM_IS_USED, TURN_NUMBER, WAITING_FOR_ENGINEER, WAITING_FOR_FIRST_MATE
} from '../../common/fields/TurnInfoFields';
import { PICK_PHASE } from '../../common/GamePhase';
import {
  CHARGE, CIRCUIT, CIRCUITS, DIRECTION, DRONE, MAX_CHARGE, MINE, SILENT, SONAR, SYSTEM_TYPE, SYSTEM_TYPES, TORPEDO
} from '../../common/System';
import { BLUE, RED } from '../../common/Team';
import { createBravoGrid } from './GridFactory';

// TODO: Something so I don't have to worry about mixing immutable and vanilla types.
export function createGame(id, { [PLAYERS]: players, [USERNAMES]: usernames, [TEAMS]: teams }) {
  return new Immutable.fromJS({
    [CREATED]: Date.now(),
    [GRID]: createBravoGrid(),
    [ID]: id,
    [NOTIFICATIONS]: [],
    [PHASE]: PICK_PHASE,
    [PLAYERS]: players,
    [SUBSYSTEMS]: createSubsystems(),
    [TEAMS]: teams,
    [USERNAMES]: usernames,
    [WINNER]: null,
    
    [BLUE]: createTeamInfo(),
    [RED]: createTeamInfo(),
  });
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

export function createSubsystems() {
  // TODO: Deterministic random
  // TODO: Probably some more constraints/balancing
  const circuits = Immutable
    .List(CIRCUITS)
    .flatMap(circuit => Immutable.Repeat(circuit, 4)) // TODO: Maybe don't hardcode these numbers?
    .sortBy(Math.random);
  return Immutable.List(SYSTEM_TYPES)
    .flatMap(systemType => Immutable.Repeat(systemType, 6))
    .sortBy(Math.random)
    .map((systemType, i) => Immutable.Map({
      [ID]: i,
      [SYSTEM_TYPE]: systemType,
      [DIRECTION]: ALL_DIRECTIONS[i % ALL_DIRECTIONS.length],
      [CIRCUIT]: i < 12 ? circuits.get(i) : null
    }));
}


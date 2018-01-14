import Immutable from 'immutable/dist/immutable';
import { ALL_DIRECTIONS, WATER_TILE } from '../../common/Grid';
import {
  BREAKDOWNS, COMMON, CREATED, DIRECTION_MOVED, GRID, ID, MINE_LOCATIONS, PLAYERS, STARTED, SUB_LOCATION,
  SUB_PATH, SUBSYSTEMS, SYSTEM_IS_USED, SYSTEMS, TEAMS, TURN_INFO, TURN_NUMBER, USERNAMES, WAITING_FOR_ENGINEER,
  WAITING_FOR_FIRST_MATE
} from '../../common/StateFields';
import {
  CHARGE, CIRCUIT, CIRCUITS, DIRECTION, DRONE, MAX_CHARGE, MINE, SILENT, SONAR, SYSTEM_TYPE, SYSTEM_TYPES,
  TORPEDO
} from '../../common/System';
import { BLUE, RED } from '../../common/Team';

// TODO: Something so I don't have to worry about mixing immutable and vanilla types.
export function createGame(id, { players, usernames, teams }) {
  return new Immutable.fromJS({
    [ID]: id,
    [COMMON]: createCommon(players, usernames, teams),
    [GRID]: createGrid(),
    [SUBSYSTEMS]: createSubsystems(),
    [RED]: createTeamInfo(),
    [BLUE]: createTeamInfo(),
  });
}

export function createCommon(players, usernames, teams) {
  return Immutable.fromJS({
    [PLAYERS]: players,
    [USERNAMES]: usernames,
    [TEAMS]: teams,
    [STARTED]: false,
    [CREATED]: Date.now()
  });
}

export function createTeamInfo() {
  return Immutable.fromJS({
    [TURN_INFO]: {
      [DIRECTION_MOVED]: false,
      [WAITING_FOR_FIRST_MATE]: false,
      [WAITING_FOR_ENGINEER]: false,
      [SYSTEM_IS_USED]: false,
      [TURN_NUMBER]: 0
    },
    [SUB_LOCATION]: null,
    [SUB_PATH]: [],
    [MINE_LOCATIONS]: [],
    [BREAKDOWNS]: Immutable.Set(), // indexes into ENGINE_LAYOUT
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
  // TODO: Probably some more constraints/balancing
  const circuits = Immutable
    .List(CIRCUITS)
    .flatMap(circuit => Immutable.Repeat(circuit, 4)) // TODO: Maybe don't hardcode these numbers?
    .sortBy(Math.random);
  return Immutable.List(SYSTEM_TYPES)
    .flatMap(systemType => Immutable.Repeat(systemType, 6))
    .sortBy(Math.random)
    .map((systemType, i) => Immutable.Map({
      [SYSTEM_TYPE]: systemType,
      [DIRECTION]: ALL_DIRECTIONS[i % ALL_DIRECTIONS.length],
      [CIRCUIT]: i < 12 ? circuits.get(i) : null
    }));
}

export function createGrid() {
  // TODO: real map creation
  return Immutable.Repeat(Immutable.Repeat(WATER_TILE, 15).toList(), 15).toList();
}
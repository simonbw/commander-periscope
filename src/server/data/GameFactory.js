import Immutable from 'immutable';
import { createGrid } from '../../common/Grid';
import {
  BREAKDOWNS, CHARGE, COMMON, CREATED, DRONE, ENGINE_LAYOUT, GRID, ID, MAX_CHARGE, MINE, MINE_LOCATIONS, PLAYERS,
  SILENT, SONAR, STARTED, SUB_LOCATION, SUB_PATH, SYSTEM_IS_USED, SYSTEMS, TEAMS, TORPEDO, TURN_INFO, TURN_NUMBER,
  USERNAMES, WAITING_FOR_ENGINEER, WAITING_FOR_FIRST_MATE
} from '../../common/StateFields';
import { BLUE, RED } from '../../common/Team';

// TODO: Something so I don't have to worry about mixing immutable and vanilla types.

// TODO: REALLY DO THIS! Consider organizing this by team then info-type, rather than info-type then team
export const createGame = (id, { players, usernames, teams }) => {
  return new Immutable.fromJS({
    [ID]: id,
    [COMMON]: createCommon(players, usernames, teams),
    [GRID]: createGrid(),
    [ENGINE_LAYOUT]: createEngineLayout(),
    [RED]: createTeamInfo(RED),
    [BLUE]: createTeamInfo(BLUE),
  });
};

function createCommon(players, usernames, teams) {
  return Immutable.fromJS({
    [PLAYERS]: players,
    [USERNAMES]: usernames,
    [TEAMS]: teams,
    [STARTED]: false,
    [CREATED]: Date.now()
  });
}

function createTeamInfo(team) {
  return Immutable.fromJS({
    [TURN_INFO]: {
      [WAITING_FOR_FIRST_MATE]: false,
      [WAITING_FOR_ENGINEER]: false,
      [SYSTEM_IS_USED]: false,
      [TURN_NUMBER]: 0
    },
    [SUB_LOCATION]: null,
    [SUB_PATH]: [],
    [MINE_LOCATIONS]: [],
    [BREAKDOWNS]: Immutable.Set(),
    [SYSTEMS]: createSystems(),
  })
}

function createSystems() {
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

function createEngineLayout() {
  
  return Immutable.fromJS({
  
  }); // TODO: Design engine layout structure
}
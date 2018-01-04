import Immutable from 'immutable';
import {
  BREAKDOWNS, CHARGE, COMMON, CREATED, DRONE, ENGINE_LAYOUT, GRID, ID, MAX_CHARGE, MINE_LOCATIONS, MINE, PLAYERS,
  SILENT,
  SONAR,
  STARTED,
  SUB_LOCATIONS,
  SUB_PATHS, SYSTEMS, TEAMS, TORPEDO, TURN_INFO, TURN_NUMBER, SYSTEM_IS_USED, USERNAMES, WAITING_FOR_ENGINEER,
  WAITING_FOR_FIRST_MATE
} from '../../common/StateFields';
import { createGrid } from '../../common/Grid';
import { BOTH_TEAMS, TEAMS_MAP } from '../../common/Team';

// TODO: Something so I don't have to worry about mixing immutable and vanilla types.

// TODO: REALLY DO THIS! Consider organizing this by team then info-type, rather than info-type then team
export const createGame = (id, { players, usernames, teams }) => {
  return new Immutable.fromJS({
    [ID]: id,
    [COMMON]: createCommon(players, usernames, teams),
    
    [TURN_INFO]: createTurnInfos(),
    
    // Map data
    [GRID]: createGrid(),
    
    // Current ship locations
    [SUB_LOCATIONS]: TEAMS_MAP.map(() => null),
    
    // Ship Paths
    [SUB_PATHS]: BOTH_TEAMS.map(() => Immutable.List()),
    
    // Locations of all the mines currently dropped
    [MINE_LOCATIONS]: TEAMS_MAP.map(() => Immutable.List()),
    
    // List of which systems are broken down
    [BREAKDOWNS]: createBreakdowns(),
    
    // Engine layout/status
    [ENGINE_LAYOUT]: createEngineLayout(),
    
    // System charges
    [SYSTEMS]: createSystems()
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

function createTurnInfos() {
  return TEAMS_MAP.map(() => Immutable.fromJS({
    [WAITING_FOR_FIRST_MATE]: false,
    [WAITING_FOR_ENGINEER]: false,
    [SYSTEM_IS_USED]: false,
    [TURN_NUMBER]: 0
  }));
}

function createBreakdowns() {
  return TEAMS_MAP.map(() => Immutable.List());
}

function createSystems() {
  return TEAMS_MAP.map(() => Immutable.fromJS({
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
  }));
}

function createEngineLayout() {
  return Immutable.fromJS({}); // TODO: Design engine layout structure
}
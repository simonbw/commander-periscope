import Immutable from 'immutable';
import { BOTH_TEAMS, TEAMS_MAP } from '../../common/Team';
import { createGrid } from '../../common/Grid';

// TODO: Something so I don't have to worry about mixing immutable and vanilla types.

// TODO: Put these field names into constants to avoid typos an increase documentation

// TODO: Consider organizing this by team then info-type, rather than info-type then team
export const createGame = (id, { players, usernames, teams }) => {
  return new Immutable.fromJS({
    id,
    common: createCommon(players, usernames, teams),
    
    turnInfo: createTurnInfos(),
    
    // Map data
    grid: createGrid(),
    
    // Current ship locations
    subLocations: TEAMS_MAP.map(() => null),
    
    // Ship Paths
    subPaths: BOTH_TEAMS.map(() => Immutable.List()),
    
    // Locations of all the mines currently dropped
    mineLocations: TEAMS_MAP.map(() => Immutable.List()),
    
    // List of which systems are broken down
    breakdowns: createBreakdowns(),
    
    // Engine layout/status
    engineLayout: createEngineLayout(),
    
    // System charges
    systems: createSystems()
  });
};

function createCommon(players, usernames, teams) {
  return Immutable.fromJS({
    players,
    usernames,
    teams,
    started: false,
    created: Date.now()
  });
}

function createTurnInfos() {
  return TEAMS_MAP.map(() => Immutable.fromJS({
    waitingForFirstMate: false,
    waitingForEngineer: false,
    usedSystem: false,
    turnNumber: 0
  }));
}

function createBreakdowns() {
  return TEAMS_MAP.map(() => Immutable.List());
}

function createSystems() {
  return TEAMS_MAP.map(() => Immutable.fromJS({
    mines: {
      charge: 0,
      max: 3
    },
    torpedo: {
      charge: 0,
      max: 3
    },
    drones: {
      charge: 0,
      max: 4
    },
    sonar: {
      charge: 0,
      max: 3
    },
    silent: {
      charge: 0,
      max: 6
    },
  }));
}

function createEngineLayout() {
  return Immutable.fromJS({}); // TODO: Design engine layout structure
}
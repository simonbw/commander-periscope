import Immutable from 'immutable';

export const createGame = (id, { players, usernames, teams }) => {
  return new Immutable.fromJS({
    id,
    common: createCommon(players, usernames, teams),
    
    currentMoves: createCurrentMoves(),
    
    // Map data
    grid: createGrid(),
    
    // Current ship locations
    subLocations: {
      RED: null,
      BLUE: null
    },
    
    // Ship Paths
    subPaths: {
      RED: [],
      BLUE: []
    },
    
    // Engine layout/status
    engines: createEngines(),
    
    // System charges
    systems: createSystems()
  });
};

function createCommon(players, usernames, teams) {
  return Immutable.Map({
    players,
    usernames,
    teams,
    created: Date.now()
  });
}

function createCurrentMoves() {
  return {
    RED: {},
    BLUE: {}
  };
}

const WATER = 0;

function createGrid() {
  // TODO: real map creation
  return new Array(15).fill(undefined).map(() => new Array(15).fill(WATER));
}

function createEngines() {
  const layout = {};
  return {
    RED: layout,
    BLUE: layout
  }
}

function createSystems() {
  const system = {
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
  };
  return {
    RED: system,
    BLUE: system
  };
}
// State
export const USER_ID = 'userId';
export const GAME = 'game';
export const LOBBY = 'lobby';
export const PAGE = 'page'; // TODO: Is this really where we want this?
export const CONNECTED = 'connected'; // TODO: Is this really where we want this?

// Custom Lobby
export const READIED = 'readied';

// Game
export const ID = 'id';
export const COMMON = 'common';
export const TURN_INFO = 'turnInfo';
export const GRID = 'grid';
export const HIT_POINTS = 'hitPoints';
export const SUB_LOCATION = 'subLocation';
export const SUB_PATH = 'subPath';
export const MINE_LOCATIONS = 'mineLocations';
export const BREAKDOWNS = 'breakdowns';
export const SYSTEMS = 'systems';
export const SUBSYSTEMS = 'subsystems';

// TODO: Some of these are common between lobby and game. Do we want different constants?
// TODO: Do we really need a 'common' object at all?
// Common
export const PLAYERS = 'players';
export const USERNAMES = 'usernames';
export const TEAMS = 'teams';
export const STARTED = 'started';
export const WINNER = 'winner';
export const CREATED = 'created';

// Turn Info
export const DIRECTION_MOVED = 'directionMoved';
export const WAITING_FOR_FIRST_MATE = 'waitingForFirstMate';
export const WAITING_FOR_ENGINEER = 'waitingForEngineer';
export const SYSTEM_IS_USED = 'usedSystem';
export const TURN_NUMBER = 'turnNumber';

// State
export const CONNECTED = 'connected'; // TODO: Is this really where we want this?
export const GAME = 'game';
export const LOBBY = 'lobby';
export const USER_ID = 'userId';

// Custom Lobby
export const GAME_ID = 'gameId';
export const READIED = 'readied';

// Game
export const ACTIONS = 'moves';
export const BREAKDOWNS = 'breakdowns';
export const COMMON = 'common';
export const GRID = 'grid';
export const HIT_POINTS = 'hitPoints';
export const ID = 'id';
export const MINE_LOCATIONS = 'mineLocations';
export const OPPONENT_ACTIONS = 'opponentActions';
export const SUB_LOCATION = 'subLocation';
export const SUB_PATH = 'subPath';
export const SUBSYSTEMS = 'subsystems';
export const SYSTEMS = 'systems';
export const TURN_INFO = 'turnInfo';
export const SURFACED = 'SURFACED';

// Action
export const ACTION_TYPE = 'actionType'; //
export const DIRECTION_MOVED = 'directionMoved';
export const SYSTEM_USED = 'systemUsed';
export const ACTION_ID = 'actionId';

// TODO: Some of these are common between lobby and game. Do we want different constants?
// TODO: Do we really need a 'common' object at all?
// Common
export const CREATED = 'created';
export const PLAYERS = 'players';
export const STARTED = 'started'; // TODO: Change started and ended into GAME_PHASE
export const TEAMS = 'teams';
export const USERNAMES = 'usernames';
export const WINNER = 'winner';

// Turn Info
export const LAST_DIRECTION_MOVED = 'lastDirectionMoved';
export const SYSTEM_IS_USED = 'usedSystem';
export const TURN_NUMBER = 'turnNumber';
export const WAITING_FOR_ENGINEER = 'waitingForEngineer';
export const WAITING_FOR_FIRST_MATE = 'waitingForFirstMate';

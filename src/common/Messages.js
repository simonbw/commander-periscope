// TODO: Split this file up into multiple files?

///------///
/// GAME ///
///------///

// Server to client
export const JOINED = 'game_joined';
export const UPDATED = 'game_update';

// client to server
export const SET_START_LOCATION = 'set_start_location';
export const HEAD_IN_DIRECTION = 'head_in_direction';
export const FIRE_TORPEDO = 'fire_torpedo';
export const DROP_MINE = 'drop_mine';
export const USE_SONAR = 'use_sonar';
export const USE_DRONE = 'use_drone';
export const GO_SILENT = 'go_silent';
export const CHARGE_SYSTEM = 'charge_system';
export const TRACK_BREAKDOWN = 'track_breakdown';

///--------------///
/// CUSTOM_LOBBY ///
///--------------///

export const CUSTOM_LOBBY_JOINED = 'custom_lobby_joined';
export const CUSTOM_LOBBY_GAME_START = 'custom_lobby_game_start';
export const PLAYER_ADDED = 'custom_lobby_player_added';
export const PLAYER_LEFT = 'custom_lobby_player_left';
export const PLAYER_READIED = 'custom_lobby_player_readied';
export const PLAYER_UNREADIED = 'custom_lobby_player_unreadied';
export const ROLE_SELECTED = 'custom_lobby_role_selected';
export const PLAYER_SET_USERNAME = 'custom_lobby_player_set_username';

export const JOIN_CUSTOM_LOBBY = 'join_custom_lobby';
export const LEAVE_CUSTOM_LOBBY = 'leave_custom_lobby';
export const CUSTOM_LOBBY_SELECT_ROLE = 'custom_lobby_select_role';
export const CUSTOM_LOBBY_READY = 'custom_lobby_ready';
export const CUSTOM_LOBBY_UNREADY = 'custom_lobby_unready';
export const CUSTOM_LOBBY_SET_USERNAME = 'custom_lobby_set_username';
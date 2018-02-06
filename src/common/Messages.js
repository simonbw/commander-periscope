// TODO: Split this file up into multiple files?

///------///
/// GAME ///
///------///

// Server to client
export const GAME_JOINED_MESSAGE = 'game_joined';
export const GAME_UPDATED_MESSAGE = 'game_update';

// client to server
export const JOIN_GAME_MESSAGE = 'join_game';
export const SET_START_LOCATION_MESSAGE = 'set_start_location';
export const HEAD_IN_DIRECTION_MESSAGE = 'head_in_direction';
export const FIRE_TORPEDO_MESSAGE = 'fire_torpedo';
export const DROP_MINE_MESSAGE = 'drop_mine';
export const DETONATE_MINE_MESSAGE = 'detonate_mine';
export const USE_SONAR_MESSAGE = 'use_sonar';
export const USE_DRONE_MESSAGE = 'use_drone';
export const GO_SILENT_MESSAGE = 'go_silent';
export const CHARGE_SYSTEM_MESSAGE = 'charge_system';
export const TRACK_BREAKDOWN_MESSAGE = 'track_breakdown';
export const SURFACE_MESSAGE = 'surface';

///--------------///
/// CUSTOM_LOBBY ///
///--------------///

// Server to client
export const CUSTOM_LOBBY_JOINED_MESSAGE = 'custom_lobby_joined';
export const CUSTOM_LOBBY_GAME_START_MESSAGE = 'custom_lobby_game_start';
export const PLAYER_ADDED_MESSAGE = 'custom_lobby_player_added';
export const PLAYER_LEFT_MESSAGE = 'custom_lobby_player_left';
export const PLAYER_READIED_MESSAGE = 'custom_lobby_player_readied';
export const PLAYER_UNREADIED_MESSAGE = 'custom_lobby_player_unreadied';
export const ROLE_SELECTED_MESSAGE = 'custom_lobby_role_selected';
export const PLAYER_SET_USERNAME_MESSAGE = 'custom_lobby_player_set_username';

// Client to server
export const JOIN_CUSTOM_LOBBY_MESSAGE = 'join_custom_lobby';
export const LEAVE_CUSTOM_LOBBY_MESSAGE = 'leave_custom_lobby';
export const CUSTOM_LOBBY_SELECT_ROLE_MESSAGE = 'custom_lobby_select_role';
export const CUSTOM_LOBBY_READY_MESSAGE = 'custom_lobby_ready';
export const CUSTOM_LOBBY_UNREADY_MESSAGE = 'custom_lobby_unready';
export const CUSTOM_LOBBY_SET_USERNAME_MESSAGE = 'custom_lobby_set_username';
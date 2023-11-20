// Amount of bonus points given for a player placing all tiles in a players possession in a single turn
export const ALL_TILES_BONUS_POINT_AMOUNT = 4;

// Amount of bonus points given for a player completing a Q
export const Q_BONUS_POINT_AMOUNT = 8;

// Number of each kind of tile in the initial bag of tiles for the BaseReferee
export const NUMBER_OF_EACH_TILE = 30;

// Number of tiles each player should have in their hand,
// used by the BaseReferee
export const NUMBER_OF_PLAYER_TILES = 6;

// The id for the html of the rendered view of the game
export const VIEW_ID = 'game-state-view';

export const TILE_SCALE = 50;

// Server communication config
export const SERVER_WAIT_FOR_SIGNUPS_MS: number = 20000;
export const SERVER_MIN_PLAYERS: number = 2;
export const SERVER_MAX_PLAYERS: number = 4;

// Number of times to retry waiting for additional players
export const SERVER_WAIT_PERIOD_RETRY_COUNT = 1;

// default timeout on remote player method calls
export const SERVER_PLAYER_STANDARD_TIMEOUT_MS = 3000;
// default timeout on remote player method calls for name
export const SERVER_PLAYER_NAME_TIMEOUT_MS: number = 3000;
// default timeout on remote player method calls for takeTurn
export const SERVER_PLAYER_TURN_TIMEOUT_MS = 5000;

// default client connection options
export const DEFAULT_CONNECION_OPTIONS = { host: 'localhost', port: 7077 };

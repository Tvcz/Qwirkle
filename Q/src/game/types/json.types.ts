import { Color, Shape } from './map.types';

/**
 * Represents the different strategy types in the game
 */
export type JStrategy = 'dag' | 'ldasg';

/**
 * Represents the different action types in the game
 */
export type JAction = 'pass' | 'replace' | J1Placement;

/**
 * A JSON representation of public data that may be sent back to the player requesting it, where
 * map is a Json representation of the board, tile* is the score of the referee,
 * and players is an array, consisting firstly of Json player data and secondly of
 * the remaining scores of the other players
 */
export interface JPub {
  map: JMap;
  'tile*': number;
  players: [JPlayer, ...number[]];
}

/**
 * A JSON representation of a player which contains the player's score and the tiles in their hand
 */
export interface JPlayer {
  name: JName;
  score: number;
  'tile*': JTile[];
}

/**
 * A JSON representation of many placements as an array
 */
export type JPlacements = J1Placement[];

/**
 * A JSON representation of a placement consisting of a {@link JsonCoordinate} and a {@link JsonTile}
 */
export interface J1Placement {
  coordinate: JCoordinate;
  '1tile': JTile;
}

/**
 * A JSON representation of a map as an array where each element is a {@link JsonRow}
 */
export type JMap = JRow[];

/**
 * A JSON representation of a row as a array where the first element is the row number and the rest are {@link JsonCell}s
 */
export type JRow = [number, ...JCell[]];

/**
 * A JSON representation of a cell as a array where the first element is the column number and the second is the {@link JsonTile}
 */
export type JCell = [number, JTile];

/**
 * A JSON representation containing data that is relevant for a tile
 */
export interface JTile {
  color: Color;
  shape: Shape;
}

/**
 * A JSON representation of a coordinate
 */
export interface JCoordinate {
  row: number;
  column: number;
}

/**
 * Represents the names of players in the Q game
 */
export type JName = string;

/**
 * Represents methods that could throw an exception in the player class
 */
export type JExn = 'setup' | 'take-turn' | 'new-tiles' | 'win';

/**
 * Represents a type of player in the Q game and how they will act
 */
export type JActorSpec = [JName, JStrategy] | [JName, JStrategy, JExn];

/**
 * Represents a type of player in the Q game and how they will act including a cheat
 */
export type JActorSpecA =
  | [JName, JStrategy]
  | [JName, JStrategy, JExn]
  | [JName, JStrategy, 'a cheat', JCheat];

export type JCheat =
  | 'non-adjacent-coordinate'
  | 'tile-not-owned'
  | 'not-a-line'
  | 'bad-ask-for-tiles'
  | 'no-fit';

/**
 * Represents an array of json actor specs
 */
export type JActors =
  | [JActorSpec, JActorSpec]
  | [JActorSpec, JActorSpec, JActorSpec]
  | [JActorSpec, JActorSpec, JActorSpec, JActorSpec];

/**
 * Represents private data that can be used to create a game state
 */
export interface JState {
  map: JMap;
  'tile*': JTile[];
  players: [JPlayer, ...JPlayer[]];
}

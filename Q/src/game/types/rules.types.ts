import PlayerTurnQueue, {
  QPlayerTurnQueue
} from '../gameState/playerTurnQueue';
import Coordinate from '../map/coordinate';
import { QTile } from '../map/tile';
import { TilePlacement } from './gameState.types';

/**
 * Type representing a Q Game rule that may be enforced on tile placement.
 * Returns a boolean that indicates whether the rule is satisfied. A rule of
 * this type may consider the tiles placed, their desired positions, and the Q
 * Game board via a getter method when determining satisfaction
 */
export type PlacementRule<T extends QTile> = <U extends T>(
  tilePlacements: TilePlacement<T>[],
  getTile: (coordinate: Coordinate) => U | undefined
) => boolean;

type BonusScoringPoints = {
  allTilesPlacedBonus?: number;
  qCompletedBonus?: number;
};

/**
 * Type representing a Q Game rule that determines how a turn is scored. Returns
 * a nunber that indicates the number of points given for that rule and turn. A
 * rule of this type may consider the tile placments of all tiles in the turn,
 * the map state after the tiles have been placed, and the player's tiles.
 */
export type ScoringRule<T extends QTile> = <U extends T>(
  tilePlacements: TilePlacement<U>[],
  getTile: (coordinate: Coordinate) => U | undefined,
  playerTiles: U[],
  bonusScoringPoints?: BonusScoringPoints
) => number;

/**
 * Type representing the getter method for a coordinate from the map. Takes in a
 * coordinate and returns the tile at that coordinate, or undefined if that tile
 * does not exist.
 */
export type CoordinateGetter<T extends QTile> = (
  coordinate: Coordinate
) => T | undefined;

/**
 * Type representing a Q game rule that determines whether the game should be over.
 * This type of rule considers the player turn queue, which contains information about the number of players remaining, the action those players took on their most recent turn, when in the order a round starts and ends, among other things.
 * EndOfGameRules return true if the game should be considered finished, or false otherwise.
 */
export type EndOfGameRule<T extends QTile> = <U extends T>(
  playerTurnQueue: QPlayerTurnQueue<U>
) => boolean;

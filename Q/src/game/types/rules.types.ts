import { QPlayerTurnQueue } from '../gameState/playerTurnQueue';
import Coordinate from '../map/coordinate';
import { ShapeColorTile } from '../map/tile';
import { TilePlacement, TurnState } from './gameState.types';

/**
 * Type representing a Q Game rule that may be enforced on tile placement.
 * Returns a boolean that indicates whether the rule is satisfied. A rule of
 * this type may consider the tiles placed, their desired positions, and the Q
 * Game board via a getter method when determining satisfaction
 */
export type PlacementRule = (
  tilePlacements: TilePlacement[],
  getTile: (coordinate: Coordinate) => ShapeColorTile | undefined
) => boolean;

type BonusScoringPoints = {
  allTilesPlacedBonus?: number;
  qCompletedBonus?: number;
};

/**
 * Type representing a Q Game rule that determines how a turn is scored. Returns
 * a number that indicates the number of points given for that rule and turn. A
 * rule of this type may consider the tile placements of all tiles in the turn,
 * the map state after the tiles have been placed, and the player's tiles.
 */
export type ScoringRule = (
  turnState: TurnState,
  getTile: (coordinate: Coordinate) => ShapeColorTile | undefined,
  bonusScoringPoints?: BonusScoringPoints
) => number;

/**
 * Type representing the getter method for a coordinate from the map. Takes in a
 * coordinate and returns the tile at that coordinate, or undefined if that tile
 * does not exist.
 */
export type CoordinateGetter = (
  coordinate: Coordinate
) => ShapeColorTile | undefined;

/**
 * Type representing a Q game rule that determines whether the game should be over.
 * This type of rule considers the player turn queue, which contains information about the number of players remaining, the action those players took on their most recent turn, when in the order a round starts and ends, among other things.
 * EndOfGameRules return true if the game should be considered finished, or false otherwise.
 */
export type EndOfGameRule = (playerTurnQueue: QPlayerTurnQueue) => boolean;

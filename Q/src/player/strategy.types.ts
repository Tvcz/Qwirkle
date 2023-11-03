import Coordinate from '../game/map/coordinate';
import { QTile } from '../game/map/tile';
import { CoordinateGetter } from '../game/types/rules.types';

/**
 * Type representing the options for a making a turn
 * 'PASS' represents a pass turn where the player does nothing
 * 'EXCHANGE' represents an exchange turn where a player exchanges all of their tiles
 * 'PLACE' represents a place turn where the player requests to place the tile placements on the map
 */
export type TurnActionDescription = 'PASS' | 'EXCHANGE' | 'PLACE';

/**
 * Type describing the signature of a function to compare two coordinates for some sorting algorithm, such as Row-Column ordering.
 * Takes in two coordinates, and a getter function for the map if needed.
 */
export type SorterFunction<T extends QTile> = (
  coord1: Coordinate,
  coord2: Coordinate,
  getTile: CoordinateGetter<T>
) => number;

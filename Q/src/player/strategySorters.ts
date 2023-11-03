import Coordinate from '../game/map/coordinate';
import { QTile } from '../game/map/tile';
import { CoordinateGetter } from '../game/types/rules.types';

/**
 * Function to sort Coordinates by their 'row column order' Row Column Order
 * says Coordinates are sorted if 'the row index of c1 is strictly less than the
 * row index of c2 or, the two row indices are equal and the column index of c1
 * is strictly less than the column index of c2'
 * @param coord1 First Coordinate to compare
 * @param coord2 Second Coordinate to compare
 * @returns A positive value if 'coord1 > coord2', a negative value if 'coord1 <
 * coord2', or 0 if they are equal
 */
export function sortCoordinatesByRowColumnOrder(
  coord1: Coordinate,
  coord2: Coordinate
): number {
  const { x: x1, y: y1 } = coord1.getCoordinate();
  const { x: x2, y: y2 } = coord2.getCoordinate();

  if (y1 !== y2) {
    return y1 - y2;
  }

  return x1 - x2;
}

/**
 * Function to sort coordinates based on the number of neighbors they have
 * @param coord1 First coordinate to compare
 * @param coord2 Second coordinate to compare
 * @param getTile Function to get the tile stored at the given coordinate on the
 * map. Returns undefined if there is no tile at that coordinate
 * @returns A positive number if coord1 has more neighbors than coord2, a
 * negative number if coord1 has less neighbors than coord2, or the result of
 * sorting the two coordinates by Row Column Order
 */
export function sortCoordinatesByMostNeighbors(
  coord1: Coordinate,
  coord2: Coordinate,
  getTile: CoordinateGetter<QTile>
): number {
  const neighbors1 = getNeighborCount(coord1, getTile);
  const neighbors2 = getNeighborCount(coord2, getTile);

  if (neighbors1 !== neighbors2) {
    return neighbors2 - neighbors1;
  }

  return sortCoordinatesByRowColumnOrder(coord1, coord2);
}

/**
 * Function to get the number of neighbors that a placement has on the map
 * @param coord Coordinate of the placement
 * @param getTile A getter method for tiles on the map
 * @returns the number of neighbors a coordinate has on the map
 */
const getNeighborCount = <T extends QTile>(
  coord: Coordinate,
  getTile: CoordinateGetter<T>
): number => {
  const neighbors = Object.values(coord.getNeighbors());

  return neighbors.reduce((numNeighbors, neighbor) => {
    return getTile(neighbor) !== undefined ? numNeighbors + 1 : numNeighbors;
  }, 0);
};

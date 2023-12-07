import Coordinate from '../map/coordinate';
import { QTile, ShapeColorTile } from '../map/tile';
import { Set } from 'typescript-collections';
import { PlacementRule } from '../types/rules.types';
import { getTileWithPlacements } from './scoringRules';

/**
 * A rule requiring that a given coordinate on a game board must be empty. In
 * other words, checks to ensure a tile does not exist at the provided
 * coordinate
 * @param tilePlacements the tiles and coordinates to be placed on the board
 * @param getTile a method to get a tile at a given coordinate, returns the tile
 * or undefined if no tile exists
 * @returns true if the coordinate is empty, false if there is a tile present
 */
export const coordinateMustBeEmpty: PlacementRule = (
  tilePlacements,
  getTile
) => {
  const tileIsNotInMap = tilePlacements.every(
    ({ coordinate }) => getTile(coordinate) === undefined
  );
  const coordinateIsNotDuplicateInTilePlacements = tilePlacements.every(
    (placement) => {
      return (
        tilePlacements.filter((duplicate) =>
          placement.coordinate.equals(duplicate.coordinate)
        ).length === 1
      );
    }
  );

  return tileIsNotInMap && coordinateIsNotDuplicateInTilePlacements;
};

/**
 * A rule requiring that a given coordinate on a game board shares at least one
 * side with a tile. The given tiles are placed in order, so the tiles placed
 * need to share a side with either a tile on the map, or a tile that was placed
 * previously in this turn
 * @param tilePlacements the tiles and coordinates to be placed on the board
 * @param getTile a method to get a tile at a given coordinate, returns the tile
 * or undefined if no tile exists
 * @returns true if all the placements share a side, false if it does not
 */
export const coordinateMustShareASide: PlacementRule = (
  tilePlacements,
  getTile
) => {
  const tilesPlacedInTurn = new Set<Coordinate>();

  return tilePlacements.every(({ coordinate }) => {
    const neighbors = coordinate.getNeighbors();
    const isConnectedToMap = neighborIsOnMapOrWasPlaced(
      Object.values(neighbors),
      tilesPlacedInTurn,
      getTile
    );
    tilesPlacedInTurn.add(coordinate);
    return isConnectedToMap;
  });
};

/**
 * Check if the coordinates given as _neighbors_ are on the map already or have been placed this turn
 * @param neighbors Neigbors of the coordinate that's being placed
 * @param tilesPlacedInTurn The tiles already placed in this turn
 * @param getTile a method to get a tile at a given coordinate, returns the tile
 * or undefined if no tile exists
 * @returns true if one of the neighbors was already placed on the map, false otherwise
 */
const neighborIsOnMapOrWasPlaced = (
  neighbors: Coordinate[],
  tilesPlacedInTurn: Set<Coordinate>,
  getTile: (coordinate: Coordinate) => QTile | undefined
) => {
  return neighbors.some((neighbor) => {
    const isInMap = getTile(neighbor) !== undefined;
    const isAlreadyPlaced = tilesPlacedInTurn.contains(neighbor);

    return isInMap || isAlreadyPlaced;
  });
};

/**
 * A rule requiring that at least one tile must be placed during a placement move
 * @param tilePlacements the tiles and coordinates to be placed on the board
 * @returns true if at least one tile is placed, false otherwise
 */
export const mustPlaceAtLeastOneTile: PlacementRule = (tilePlacements) => {
  return tilePlacements.length > 0;
};

/**
 * A rule requiring that a tile must match the shapes or colors of it's direct
 * neighbors in its row and column, separately.
 * @param tilePlacements the tiles and coordinates to be placed on the board
 * @param getTile a method to get a tile at a given coordinate, returns the tile
 * or undefined if no tile exists
 * @returns true if the shapes or colors match the given tile in its row and
 * column, false otherwise
 */
export const mustMatchNeighboringShapesOrColors: PlacementRule = (
  tilePlacements,
  getTile
) => {
  return tilePlacements.every(({ tile, coordinate }, i) => {
    const getWithTilePlacements = getTileWithPlacements(
      tilePlacements.slice(0, i),
      getTile
    );
    const { top, bottom, left, right } = coordinate.getNeighbors();

    const matchesVerticalShapeOrColor = matchesShapeOrColor(tile, [
      getWithTilePlacements(top),
      getWithTilePlacements(bottom)
    ]);

    const matchesHorizontalShapeOrColor = matchesShapeOrColor(tile, [
      getWithTilePlacements(left),
      getWithTilePlacements(right)
    ]);

    return matchesVerticalShapeOrColor && matchesHorizontalShapeOrColor;
  });
};

/**
 * Checks whether a given tile matches the shape or color of all the neighboring
 * tiles given, where undefined means there is no neighboring tile and counts as
 * matching.
 * @param tile the tile to check
 * @param neighbors the neighboring tiles to compare against
 * @returns true if the tiles match in shape or color, false otherwise
 */
function matchesShapeOrColor(
  tile: ShapeColorTile,
  neighbors: (ShapeColorTile | undefined)[]
) {
  const matchesNeighborShape = neighbors.every((neighbor) => {
    return !neighbor || tile.sameShape(neighbor);
  });
  const matchesNeighborColor = neighbors.every((neighbor) => {
    return !neighbor || tile.sameColor(neighbor);
  });

  return matchesNeighborColor || matchesNeighborShape;
}

/**
 * A rule requiring that all tiles placed in a turn are in the same row or
 * column.
 * @param tilePlacements The list of tile placements (made of a tile and
 * coordinate) placed in a turn
 * @returns true if the tiles are in the same row or column, false otherwise
 */
export const tilesPlacedMustShareRowOrColumn: PlacementRule = (
  tilePlacements
) => {
  if (tilePlacements.length === 0) {
    return true;
  }

  const { x: firstTileX, y: firstTileY } =
    tilePlacements[0].coordinate.getCoordinate();

  const placedInSameRow = tilePlacements.every(
    ({ coordinate }) => coordinate.getCoordinate().x === firstTileX
  );

  const placedInSameColumn = tilePlacements.every(
    ({ coordinate }) => coordinate.getCoordinate().y === firstTileY
  );

  return placedInSameRow || placedInSameColumn;
};

import { Dictionary, Set } from 'typescript-collections';
import Coordinate from '../game/map/coordinate';
import { QTile, ShapeColorTile } from '../game/map/tile';
import { TilePlacement } from '../game/types/gameState.types';
import { colorList, shapeList } from '../game/types/map.types';
import { CoordinateGetter, PlacementRule } from '../game/types/rules.types';
import { SorterFunction } from './strategy.types';
import { BaseTurnAction, TurnAction } from './turnAction';
import { sortCoordinatesByRowColumnOrder } from './strategySorters';

/**
 * Function to sort tiles based their shape, and if the shapes are equal, then based on their color
 * Shapes and colors are weighted in the order that they're defined in the shapeList and colorList variables
 * @param tile1 First ShapeColorTile tile to compare
 * @param tile2 Second ShapeColorTile tile to compare
 * @returns A positive value if 'tile1 > tile2', and negative number if 'tile1 < tile2', or 0 if they are equal
 */
const sortShapeColorTiles = (
  tile1: ShapeColorTile,
  tile2: ShapeColorTile
): number => {
  const tile1ShapeIndex = shapeList.indexOf(tile1.getShape());
  const tile2ShapeIndex = shapeList.indexOf(tile2.getShape());

  if (tile1ShapeIndex !== tile2ShapeIndex) {
    return tile1ShapeIndex - tile2ShapeIndex;
  }

  const tile1ColorIndex = colorList.indexOf(tile1.getColor());
  const tile2ColorIndex = colorList.indexOf(tile2.getColor());
  return tile1ColorIndex - tile2ColorIndex;
};

/**
 * Function to sort a list of tiles in lexicographical order, as describe in the documentation for the sortShapeColorTiles function
 * @param playerTiles A list of the player's tiles
 * @returns a sorted copy of the players tiles
 */
export const getTilesOrdering = <T extends ShapeColorTile>(
  playerTiles: T[]
): T[] => {
  const tilesCopy = [...playerTiles];
  tilesCopy.sort(sortShapeColorTiles);
  return tilesCopy;
};

/**
 * Convert a list of TilePlacement into a dictionary from Coordinate to Tile
 * @param mapState A list of the tile placements on the map
 * @returns A map of coordinates to tiles
 */
export const tilePlacementsToMap = <T extends QTile>(
  mapState: TilePlacement<T>[]
): Dictionary<Coordinate, T> => {
  const map = new Dictionary<Coordinate, T>();

  mapState.forEach(({ coordinate, tile }) => {
    map.setValue(coordinate, tile);
  });

  return map;
};

/**
 * Get all of the valid tile placements for a given tile in the map according to the given placement rules
 * @param tile tile to get placements for
 * @param placedTiles The tiles already placed this turn
 * @param map The existing map of the game
 * @param placementRules Placement rules a valid placement needs to adhere to
 * @returns a list of the coordinates where the given tile could be placed
 */
export const getAllValidPlacements = <T extends ShapeColorTile>(
  tile: T,
  map: Dictionary<Coordinate, T>,
  placementRules: ReadonlyArray<PlacementRule<T>>
): Coordinate[] => {
  const getTile = (coord: Coordinate) => map.getValue(coord);
  const seenTiles = new Set<Coordinate>();

  const allMapNeighbors = map
    .keys()
    .flatMap((coord) => Object.values(coord.getNeighbors()));

  const validPlacements = allMapNeighbors.filter((coordinate) => {
    const hasNotBeenSeen = !seenTiles.contains(coordinate);

    seenTiles.add(coordinate);

    return (
      hasNotBeenSeen &&
      isValidPlacement([{ tile, coordinate }], placementRules, getTile)
    );
  });

  return validPlacements;
};

/**
 * Check if the given tile placement satisfies all of the given placement rules
 * @param tilePlacements list of the placements attempting to be placed this turn
 * @param placementRules list of the Placement rules to adhere to
 * @param getTile A getter method for coordinates on the map
 * @returns true if the given placement adheres to the rules, false otherwise
 */
const isValidPlacement = <T extends ShapeColorTile>(
  tilePlacements: TilePlacement<T>[],
  placementRules: ReadonlyArray<PlacementRule<T>>,
  getTile: CoordinateGetter<T>
): boolean => {
  return placementRules.every((rule) => {
    const res = rule(tilePlacements, (coord: Coordinate) => getTile(coord));
    // if (!res) {
    //   console.log(rule);
    // }
    return res;
  });
};

/**
 * This method is a getter for a Map, but treats a tile placement as if it has already been placed on the map.
 * @param tilePlacements The tiles and coordinates placed in this turn
 * @param getTile a function that takes a coordinate and returns a tile at that
 * location or undefined if it does not exist
 * @returns a getter method that takes a coordinate and gets the tile from either the map or the tile placement list, or returns undefined if the coordinate is not present in either.
 */
const getTileWithPlacements = <T extends QTile>(
  tilePlacements: TilePlacement<T>[],
  getTile: CoordinateGetter<T>
) => {
  return (coord: Coordinate) => {
    const tileFromPlacements = tilePlacements.find((tilePlacement) =>
      coord.equals(tilePlacement.coordinate)
    );
    return tileFromPlacements?.tile ?? getTile(coord);
  };
};

/**
 * Given a single tile, get places where that tile can be placed on the map with the given placement rules and the coordinate sorter function.
 * If there are no valid placements, return undefined.
 * @param tile The tile to attempt to place
 * @param placedTiles The tiles already placed this turn
 * @param map The map of the game
 * @param placementRules list of placement rules
 * @param coordinateSorter A function to sort coordinates to prioritize which ones should be chosen first
 * @returns The new tile placment for the given tile, or undefined if there are no valid placements.
 */
const getNewTilePlacementForSingleTile = <T extends ShapeColorTile>(
  tile: T,
  map: Dictionary<Coordinate, T>,
  placementRules: ReadonlyArray<PlacementRule<T>>,
  coordinateSorter: SorterFunction<T>
): TilePlacement<T> | undefined => {
  const validPlacements = getAllValidPlacements(tile, map, placementRules);

  const getTile = (coord: Coordinate) => map.getValue(coord);
  validPlacements.sort((a, b) => coordinateSorter(a, b, getTile));

  if (validPlacements.length > 0) {
    return {
      tile,
      coordinate: validPlacements[0]
    };
  }

  return undefined;
};

/**
 * Given a function to sort coordinates, suggest a turn action to take based on the current player and map states
 * @param mapState list of tile placements on the map
 * @param playerTiles the players hand
 * @param remainingTilesCount number of remaining tiles in the bag
 * @param placementRules list of placement rules a valid placement must adhere to
 * @param coordinateSorter A function to sort coordinates to prioritize which ones should be chosen first
 * @returns The TurnAction that the player should take
 */
export const suggestMoveByStrategy = <T extends ShapeColorTile>(
  mapState: TilePlacement<T>[],
  playerTiles: T[],
  remainingTilesCount: number,
  placementRules: ReadonlyArray<PlacementRule<T>>,
  coordinateSorter: SorterFunction<T>
): TurnAction<T> => {
  const stableMap = tilePlacementsToMap(mapState);
  const mutableMap = tilePlacementsToMap(mapState);

  const orderedPlayerTiles = getTilesOrdering(playerTiles);

  return iterate(
    [],
    stableMap,
    mutableMap,
    orderedPlayerTiles,
    remainingTilesCount,
    placementRules,
    coordinateSorter
  );
};

const iterate = <T extends ShapeColorTile>(
  placements: TilePlacement<T>[],
  stableMap: Dictionary<Coordinate, T>,
  mutableMap: Dictionary<Coordinate, T>,
  playerTiles: T[],
  remainingTilesCount: number,
  placementRules: ReadonlyArray<PlacementRule<T>>,
  coordinateSorter: SorterFunction<T>
): TurnAction<T> => {
  const turnaction = strategyForSinglePlacement(
    mutableMap,
    playerTiles,
    remainingTilesCount,
    placementRules,
    coordinateSorter
  );
  if (turnaction.ofType('PASS') || turnaction.ofType('EXCHANGE')) {
    return handlePassOrExchange(placements, turnaction);
  } else {
    const potentialPlacement = turnaction.getPlacements()[0];
    const placementSoFar = [...placements, potentialPlacement];
    const isLegal = isValidPlacement(placementSoFar, placementRules, (key) =>
      stableMap.getValue(key)
    );
    if (!isLegal) {
      return handlePassOrExchange(
        placements,
        getPassOrExchange(remainingTilesCount, playerTiles.length)
      );
    } else {
      mutableMap.setValue(
        potentialPlacement.coordinate,
        potentialPlacement.tile
      );
      const newPlayerTiles = playerTiles.filter(
        (tile) => tile !== potentialPlacement.tile
      );
      const secondIteration = iterate(
        placementSoFar,
        stableMap,
        mutableMap,
        newPlayerTiles,
        remainingTilesCount,
        placementRules,
        coordinateSorter
      );
      return secondIteration;
    }
  }
};

/**
 * Given a list of placements and a turn action which is either PASS or
 * EXCHANGE, return a PLACE action if there are any placements, or the original
 * turn action if there are none.
 * @param placements The placements so far
 * @param turnAction The turn action to return if there are no placements
 */
const handlePassOrExchange = <T extends ShapeColorTile>(
  placements: TilePlacement<T>[],
  turnAction: TurnAction<T>
): TurnAction<T> => {
  if (placements.length === 0) {
    return turnAction;
  } else {
    return new BaseTurnAction('PLACE', placements);
  }
};

export const strategyForSinglePlacement = <T extends ShapeColorTile>(
  mapState: Dictionary<Coordinate, T>,
  playerTiles: T[],
  remainingTilesCount: number,
  placementRules: ReadonlyArray<PlacementRule<T>>,
  coordinateSorter: SorterFunction<T>
): TurnAction<T> => {
  for (const tile of playerTiles) {
    const placement = getNewTilePlacementForSingleTile(
      tile,
      mapState,
      placementRules,
      coordinateSorter
    );
    if (placement !== undefined) {
      return new BaseTurnAction('PLACE', [placement]);
    }
  }
  return getPassOrExchange(remainingTilesCount, playerTiles.length);
};

const getPassOrExchange = <T extends ShapeColorTile>(
  remainingTilesCount: number,
  playerTilesCount: number
): TurnAction<T> => {
  if (remainingTilesCount >= playerTilesCount) {
    return new BaseTurnAction('EXCHANGE');
  } else {
    return new BaseTurnAction('PASS');
  }
};

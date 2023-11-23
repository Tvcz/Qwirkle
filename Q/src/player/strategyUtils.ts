import { Dictionary, Set } from 'typescript-collections';
import Coordinate from '../game/map/coordinate';
import { QTile, ShapeColorTile } from '../game/map/tile';
import { TilePlacement } from '../game/types/gameState.types';
import { colorList, shapeList } from '../game/types/map.types';
import { CoordinateGetter, PlacementRule } from '../game/types/rules.types';
import { SorterFunction } from './strategy.types';
import { BaseTurnAction, TurnAction } from './turnAction';

/**
 * Function to sort tiles based their shape, and if the shapes are equal, then
 * based on their color Shapes and colors are weighted in the order that they're
 * defined in the shapeList and colorList variables
 * @param tile1 First ShapeColorTile tile to compare
 * @param tile2 Second ShapeColorTile tile to compare
 * @returns A positive value if 'tile1 > tile2', and negative number if 'tile1 <
 * tile2', or 0 if they are equal
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
 * Function to sort a list of tiles in lexicographical order, as described in
 * the documentation for the sortShapeColorTiles function
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
 * Convert a list of TilePlacement into a dictionary of Coordinates to Tiles.
 * @param mapState A list of the tile placements on the map
 * @returns A dictionary of coordinates to tiles
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
 * Get all of the valid tile placements for a given tile in the map according to the given placement rules.
 * @param tile tile to get placements for
 * @param map The existing map of the game
 * @param placements The tiles already placed this turn
 * @param placementRules Placement rules a valid placement needs to adhere to
 * @returns a list of the coordinates where the given tile could be placed
 */
export const getAllValidPlacementCoordinates = <T extends ShapeColorTile>(
  tile: T,
  map: Dictionary<Coordinate, T>,
  placements: TilePlacement<T>[],
  placementRules: ReadonlyArray<PlacementRule<T>>
): Coordinate[] => {
  const getTile = (coord: Coordinate) => map.getValue(coord);

  const allSpacesAdjacentToMap = new Set<Coordinate>();
  [...map.keys(), ...placements.map(({ coordinate }) => coordinate)]
    .flatMap((coord) => Object.values(coord.getNeighbors()))
    .forEach((coord) => allSpacesAdjacentToMap.add(coord));

  const validPlacements = allSpacesAdjacentToMap
    .toArray()
    .filter((coordinate) => {
      return isValidPlacement(
        [{ tile, coordinate }],
        placementRules,
        getTileWithPlacements(placements, getTile)
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
    return res;
  });
};

/**
 * This method is a getter for a Map, but treats a tile placement as if it has
 * already been placed on the map.
 * @param tilePlacements The tiles and coordinates placed in this turn
 * @param getTile a function that takes a coordinate and returns a tile at that
 * location or undefined if it does not exist
 * @returns a getter method that takes a coordinate and gets the tile from
 * either the map or the tile placement list, or returns undefined if the
 * coordinate is not present in either.
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
 * Given a single tile, get places where that tile can be placed on the map with the given placement rules
 * ordered according to the given coordinate sorter function.
 * @param tile The tile to attempt to place
 * @param map The map of the game
 * @param placements The tiles already placed this turn
 * @param placementRules list of placement rules
 * @param coordinateSorter A function to sort coordinates
 * @returns The sorted list of valid placements, which is empty if there are none.
 */
const getSortedValidPlacementsForTile = <T extends ShapeColorTile>(
  tile: T,
  map: Dictionary<Coordinate, T>,
  placements: TilePlacement<T>[],
  placementRules: ReadonlyArray<PlacementRule<T>>,
  coordinateSorter: SorterFunction<T>
): TilePlacement<T>[] => {
  const validCoordinates = getAllValidPlacementCoordinates(
    tile,
    map,
    placements,
    placementRules
  );
  const getTileWithPreviousPlacements = getTileWithPlacements(
    placements,
    (coord) => map.getValue(coord)
  );
  validCoordinates.sort((a, b) =>
    coordinateSorter(a, b, getTileWithPreviousPlacements)
  );

  return validCoordinates.map((coordinate) => ({ tile, coordinate }));
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
  const map = tilePlacementsToMap(mapState);
  const orderedPlayerTiles = getTilesOrdering(playerTiles);

  const iterableStrategy = (placements: TilePlacement<T>[], playerTiles: T[]) =>
    strategyForSinglePlacement(
      map,
      placements,
      playerTiles,
      remainingTilesCount,
      placementRules,
      coordinateSorter
    );

  const isValidPlacementAction = (placements: TilePlacement<T>[]) =>
    isValidPlacement(placements, placementRules, (coord) =>
      map.getValue(coord)
    );

  return iterateStrategy(
    [],
    orderedPlayerTiles,
    isValidPlacementAction,
    iterableStrategy
  );
};

/**
 * Iterates a strategy for a single placement until it returns a PASS or EXCHANGE action.
 * @param placements The placements so far
 * @param playerTiles The tiles the player has left
 * @param isValidPlacementAction A function to check if a placement is valid
 * @param iterableStrategy The strategy to iterate
 * @returns The turn action to take, combining one or more iterations of the strategy
 */
const iterateStrategy = <T extends ShapeColorTile>(
  placements: TilePlacement<T>[],
  playerTiles: T[],
  isValidPlacementAction: (placements: TilePlacement<T>[]) => boolean,
  iterableStrategy: (
    placements: TilePlacement<T>[],
    playerTiles: T[]
  ) => TurnAction<T>
): TurnAction<T> => {
  const turnaction = iterableStrategy(placements, playerTiles);
  if (turnaction.ofType('PASS') || turnaction.ofType('EXCHANGE')) {
    return handlePassOrExchange(placements, turnaction);
  } else {
    const potentialPlacement = turnaction.getPlacements()[0];
    const placementsSoFar = [...placements, potentialPlacement];
    const newPlayerTiles = playerTiles.filter(
      (tile) => tile !== potentialPlacement.tile
    );
    if (isValidPlacementAction(placementsSoFar)) {
      return iterateStrategy(
        placementsSoFar,
        newPlayerTiles,
        isValidPlacementAction,
        iterableStrategy
      );
    }
    return handlePassOrExchange(placements, turnaction);
  }
};

/**
 * Determines the best turn action to take for a single tile placement given the
 * state of the game and player, the placement rules, and the placements made so far this turn.
 * @param map the state of the map at the start of the turn
 * @param placements the placements made so far this turn
 * @param playerTiles the tiles available to the player
 * @param remainingTilesCount the number of tiles remaining in the referee's bag
 * @param placementRules the rules that placements must adhere to
 * @param coordinateSorter a function to sort coordinates to prioritize placements
 * @returns the best turn action to take
 */
const strategyForSinglePlacement = <T extends ShapeColorTile>(
  map: Dictionary<Coordinate, T>,
  placements: TilePlacement<T>[],
  playerTiles: T[],
  remainingTilesCount: number,
  placementRules: ReadonlyArray<PlacementRule<T>>,
  coordinateSorter: SorterFunction<T>
): TurnAction<T> => {
  for (const tile of playerTiles) {
    const sortedValidPlacements = getSortedValidPlacementsForTile(
      tile,
      map,
      placements,
      placementRules,
      coordinateSorter
    );
    if (sortedValidPlacements.length > 0) {
      return new BaseTurnAction('PLACE', sortedValidPlacements.slice(0, 1));
    }
  }
  return getPassOrExchange(remainingTilesCount, playerTiles.length);
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

/**
 * Determines whether to play the PASS or EXCHANGE actions based on the number
 * of tiles remaining in the bag and the number of tiles in the player's hand.
 * @param remainingTilesCount The number of tiles remaining in the bag
 * @param playerTilesCount The number of tiles in the player's hand
 * @returns A TurnAction of type PASS or EXCHANGE
 */
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

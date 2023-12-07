import { BaseTile, ShapeColorTile } from '../game/map/tile';
import { TilePlacement } from '../game/types/gameState.types';
import {
  getAllValidPlacementCoordinates,
  suggestMoveByStrategy,
  tilePlacementsToMap
} from './strategyUtils';
import { PlacementRule } from '../game/types/rules.types';
import {
  sortCoordinatesByMostNeighbors,
  sortCoordinatesByRowColumnOrder
} from './strategySorters';
import { BaseTurnAction, TurnAction } from './turnAction';
import { colorList, shapeList } from '../game/types/map.types';
import Coordinate from '../game/map/coordinate';
import {
  coordinateMustBeEmpty,
  coordinateMustShareASide,
  mustMatchNeighboringShapesOrColors,
  mustPlaceAtLeastOneTile,
  tilesPlacedMustShareRowOrColumn
} from '../game/rules/placementRules';
import { Dictionary } from 'typescript-collections';

/**
 * Interface representing an implementation of a strategy for taking a turn in a Q game.
 * Strategies implement a suggestMove method that take in the necessary components of a game state and return the TurnAction that the player should take
 */
export interface Strategy {
  /**
   * Suggests a turn action based on the state of the map, the player's
   * available tiles, and the number of remaining tiles.
   * @param mapState the current placements of tiles on the game board
   * @param playerTiles the tiles currently in the active player's hand
   * @param remainingTilesCount nnumber of remaining tiles
   * @param placementRules list of the placement rules that must be adhered to. These include all placement rules, including the structural map rules
   * @returns The TurnAction that the player should play
   */
  suggestMove: (
    mapState: TilePlacement[],
    playerTiles: ShapeColorTile[],
    remainingTilesCount: number,
    placementRules: ReadonlyArray<PlacementRule>
  ) => TurnAction;
}

/**
 * Implementation of the Strategy interface that uses the DAG strategy.
 *
 * The DAG strategy chooses the players smallest tile that can extend the map. It breaks ties for more than one place by using Row Column ordering of coordinates.
 *
 * Tiles are ordered based on their lexicographical ordering, where shape is compared first and then color if there is a tie.
 * Shapes and Colors are weighted in the order that they're defined in the shapeList and colorList variables.
 *
 * Row Column Ordering compares a coordinates row first, and then column if there is a tie.
 */
export class DagStrategy implements Strategy {
  public suggestMove(
    mapState: TilePlacement[],
    playerTiles: ShapeColorTile[],
    remainingTilesCount: number,
    placementRules: ReadonlyArray<PlacementRule>
  ) {
    return suggestMoveByStrategy(
      mapState,
      playerTiles,
      remainingTilesCount,
      placementRules,
      sortCoordinatesByRowColumnOrder
    );
  }
}

/**
 * Implementation of the Strategy interface that uses the DAG strategy.
 *
 * The DAG strategy chooses the players smallest tile that can extend the map. It breaks ties for more than one place by choosing the placement with the most neighbors. Ties for most neighbors are broken with Row Column ordering.
 *
 * Tiles are ordered based on their lexicographical ordering, where shape is compared first and then color if their is a tie.
 * Shapes and Colors are weighted in the order that they're defined in the shapeList and colorList variables.
 *
 * Row Column Ordering compares a coordinates row first, and then column if there is a tie.
 */
export class LdasgStrategy implements Strategy {
  public suggestMove(
    mapState: TilePlacement[],
    playerTiles: ShapeColorTile[],
    remainingTilesCount: number,
    placementRules: ReadonlyArray<PlacementRule>
  ) {
    return suggestMoveByStrategy(
      mapState,
      playerTiles,
      remainingTilesCount,
      placementRules,
      sortCoordinatesByMostNeighbors
    );
  }
}

/**
 * Denotes a player that in response to being granted a turn, requests the
 * placement of a tile that is not adjacent to a placed tile.
 */
export class NonAdjacentCoordinateStrategy implements Strategy {
  public suggestMove(mapState: TilePlacement[], playerTiles: ShapeColorTile[]) {
    const maxRight = Math.max(
      ...mapState.map((tp) => tp.coordinate.getCoordinate().x)
    );
    // places a tile 2 spaces to the right of the rightmost tile (therfore not adjacent)
    return new BaseTurnAction('PLACE', [
      { tile: playerTiles[0], coordinate: new Coordinate(maxRight + 2, 0) }
    ]);
  }
}

/**
 * Denotes a player that in response to being granted a turn, requests the
 * placement of a tile that it does not own.
 */
export class TileNotOwnedStrategy implements Strategy {
  private backupStrategy: Strategy;
  constructor(backupStrategy: Strategy) {
    this.backupStrategy = backupStrategy;
  }

  public suggestMove(
    mapState: TilePlacement[],
    playerTiles: ShapeColorTile[],
    remainingTilesCount: number,
    placementRules: ReadonlyArray<PlacementRule>
  ) {
    const tilesNotInHand: ShapeColorTile[] = [];
    for (const shape of shapeList) {
      for (const color of colorList) {
        const tile = new BaseTile(shape, color);
        const tileNotInHand = playerTiles.every((t) => !t.equals(tile));
        if (tileNotInHand) {
          tilesNotInHand.push(tile);
        }
      }
    }
    if (tilesNotInHand.length > 0) {
      const cheatTurn = this.backupStrategy.suggestMove(
        mapState,
        tilesNotInHand,
        remainingTilesCount,
        placementRules
      );
      if (cheatTurn.ofType('PLACE')) {
        return cheatTurn;
      }
    }

    return this.backupStrategy.suggestMove(
      mapState,
      playerTiles,
      remainingTilesCount,
      placementRules
    );
  }
}

/**
 * Denotes a player that in response to being granted a turn, requests
 * placements that are not in one line (row, column).
 */
export class NotALineStrategy implements Strategy {
  private backupStrategy: Strategy;
  constructor(backupStrategy: Strategy) {
    this.backupStrategy = backupStrategy;
  }

  /**
   *
   * @param parentTile
   * @param hand
   * @param map
   * @param placements
   * @param placementRules
   * @returns a list of lists of placements that are valid for the given tile
   */
  private findCheatingPlacement(
    parentTile: ShapeColorTile,
    hand: ShapeColorTile[],
    map: Dictionary<Coordinate, ShapeColorTile>,
    placements: TilePlacement[],
    placementRules: ReadonlyArray<PlacementRule>
  ): TilePlacement[] {
    const allValidPlacements = getAllValidPlacementCoordinates(
      parentTile,
      map,
      placements,
      placementRules
    );
    for (const coordinate of allValidPlacements) {
      const parentTilePlacement: TilePlacement = {
        tile: parentTile,
        coordinate
      };
      const placementsWithParentTile = [...placements, parentTilePlacement];
      if (this.isCheating(placementsWithParentTile)) {
        return placementsWithParentTile;
      }
      for (const childTile of hand) {
        const remainingHand = [...hand];
        remainingHand.splice(hand.indexOf(childTile), 1);

        const cheatingChildPlacement = this.findCheatingPlacement(
          childTile,
          remainingHand,
          map,
          placementsWithParentTile,
          placementRules
        );

        if (cheatingChildPlacement.length > 0) {
          return cheatingChildPlacement;
        }
      }
    }
    return [];
  }

  private isCheating(tilePlacements: TilePlacement[]): boolean {
    if (tilePlacements.length === 0) {
      return false;
    }

    const { x: firstTileX, y: firstTileY } =
      tilePlacements[0].coordinate.getCoordinate();

    const someNotPlacedInSameRow = tilePlacements.some(
      ({ coordinate }) => coordinate.getCoordinate().x !== firstTileX
    );

    const somePlacedInSameColumn = tilePlacements.some(
      ({ coordinate }) => coordinate.getCoordinate().y !== firstTileY
    );

    return someNotPlacedInSameRow && somePlacedInSameColumn;
  }

  private attemptToCheat(
    mapState: TilePlacement[],
    playerTiles: ShapeColorTile[]
  ): TurnAction {
    for (const tile of playerTiles) {
      const remainingHand = [...playerTiles];
      remainingHand.splice(remainingHand.indexOf(tile), 1);

      const cheatingPlacement = this.findCheatingPlacement(
        tile,
        remainingHand,
        tilePlacementsToMap(mapState),
        [],
        [
          coordinateMustBeEmpty,
          coordinateMustShareASide,
          mustMatchNeighboringShapesOrColors,
          mustPlaceAtLeastOneTile
        ]
      );
      if (cheatingPlacement.length > 0) {
        return new BaseTurnAction('PLACE', cheatingPlacement);
      }
    }
    return new BaseTurnAction('PASS');
  }

  public suggestMove(
    mapState: TilePlacement[],
    playerTiles: ShapeColorTile[],
    remainingTilesCount: number,
    placementRules: ReadonlyArray<PlacementRule>
  ) {
    const cheatTurn = this.attemptToCheat(mapState, playerTiles);

    if (cheatTurn.ofType('PLACE')) {
      return cheatTurn;
    }

    return this.backupStrategy.suggestMove(
      mapState,
      playerTiles,
      remainingTilesCount,
      placementRules
    );
  }
}

/**
 * Denotes a player that in response to being granted a turn, requests a tile
 * replacement but it owns more tiles than the referee has left.
 */
export class BadAskForTilesStrategy implements Strategy {
  private backupStrategy: Strategy;
  constructor(backupStrategy: Strategy) {
    this.backupStrategy = backupStrategy;
  }

  public suggestMove(
    mapState: TilePlacement[],
    playerTiles: ShapeColorTile[],
    remainingTilesCount: number,
    placementRules: ReadonlyArray<PlacementRule>
  ) {
    if (playerTiles.length > remainingTilesCount) {
      return new BaseTurnAction('EXCHANGE');
    }
    return this.backupStrategy.suggestMove(
      mapState,
      playerTiles,
      remainingTilesCount,
      placementRules
    );
  }
}

/**
 * Denotes a player that in response to being granted a turn, requests the
 * placement of a tile that does not match its adjacent tiles.
 */
export class NoFitStrategy implements Strategy {
  private backupStrategy: Strategy;
  constructor(backupStrategy: Strategy) {
    this.backupStrategy = backupStrategy;
  }

  public suggestMove(
    mapState: TilePlacement[],
    playerTiles: ShapeColorTile[],
    remainingTilesCount: number,
    placementRules: ReadonlyArray<PlacementRule>
  ) {
    const invertNeighborMatch = (
      tilePlacements: TilePlacement[],
      getTile: (coordinate: Coordinate) => ShapeColorTile | undefined
    ) => !mustMatchNeighboringShapesOrColors(tilePlacements, getTile);

    const cheatTurn = this.backupStrategy.suggestMove(
      mapState,
      playerTiles,
      remainingTilesCount,
      [
        coordinateMustBeEmpty,
        coordinateMustShareASide,
        invertNeighborMatch,
        tilesPlacedMustShareRowOrColumn,
        mustPlaceAtLeastOneTile
      ]
    );

    if (cheatTurn.ofType('PLACE')) {
      return cheatTurn;
    }

    return this.backupStrategy.suggestMove(
      mapState,
      playerTiles,
      remainingTilesCount,
      placementRules
    );
  }
}

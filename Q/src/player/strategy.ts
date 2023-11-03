import { BaseTile, QTile } from '../game/map/tile';
import { TilePlacement } from '../game/types/gameState.types';
import { suggestMoveByStrategy } from './strategyUtils';
import { PlacementRule } from '../game/types/rules.types';
import {
  sortCoordinatesByMostNeighbors,
  sortCoordinatesByRowColumnOrder
} from './strategySorters';
import { TurnAction } from './turnAction';

/**
 * Interface representing an implementation of a strategy for taking a turn in a Q game.
 * Strategies implement a suggestMove method that take in the necessary components of a game state and return the TurnAction that the player should take
 */
export interface Strategy<T extends QTile> {
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
    mapState: TilePlacement<T>[],
    playerTiles: T[],
    remainingTilesCount: number,
    placementRules: ReadonlyArray<PlacementRule<T>>
  ) => TurnAction<T>;
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
export class DagStrategy implements Strategy<BaseTile> {
  public suggestMove(
    mapState: TilePlacement<BaseTile>[],
    playerTiles: BaseTile[],
    remainingTilesCount: number,
    placementRules: ReadonlyArray<PlacementRule<BaseTile>>
  ) {
    const ta = suggestMoveByStrategy<BaseTile>(
      mapState,
      playerTiles,
      remainingTilesCount,
      placementRules,
      sortCoordinatesByRowColumnOrder
    );
    return ta;
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
export class LdasgStrategy implements Strategy<BaseTile> {
  public suggestMove(
    mapState: TilePlacement<BaseTile>[],
    playerTiles: BaseTile[],
    remainingTilesCount: number,
    placementRules: ReadonlyArray<PlacementRule<BaseTile>>
  ) {
    return suggestMoveByStrategy<BaseTile>(
      mapState,
      playerTiles,
      remainingTilesCount,
      placementRules,
      sortCoordinatesByMostNeighbors
    );
  }
}

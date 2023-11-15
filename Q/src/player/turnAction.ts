import { QTile } from '../game/map/tile';
import { TilePlacement } from '../game/types/gameState.types';
import { TurnActionDescription } from './strategy.types';

/**
 * A TurnAction represents the action that a player takes on a turn.
 * It contains information about the type of the action as well as the
 * tile placements made through the action, if applicable.
 */
export interface TurnAction<T extends QTile> {
  /**
   * Checks if the given turn action type is the same as the type of this turn action
   * @param typeDescription the turn action type to compare against
   * @returns true if the types are the same, false otherwise
   */
  ofType: (typeDescription: TurnActionDescription) => boolean;

  /**
   * Returns the tile placements associated with this turn action
   * @returns The tile placements associated with this turn action
   * @throws an error if the type of the turn action does not allow for
   * placements or if the placements are undefined
   */
  getPlacements: () => TilePlacement<T>[];
}

/**
 * The BaseTurnAction class stores the information about a specific turn, which includes:
 * - The description of the action taken in the turn
 * - The tile placments made in the turn, if it is a place action
 */
export class BaseTurnAction<T extends QTile> implements TurnAction<T> {
  private type: TurnActionDescription;
  private placements: TilePlacement<T>[] | undefined;

  constructor(type: TurnActionDescription, placements?: TilePlacement<T>[]) {
    this.type = type;
    if (this.type === 'PLACE' && placements === undefined) {
      throw new Error(
        'Placement turn action requires tile placements to be specified'
      );
    }
    if (this.type !== 'PLACE' && placements !== undefined) {
      throw new Error(
        'Placements cannot be specified for a non-placement turn action'
      );
    }
    this.placements = placements;
  }

  public ofType(typeDescription: TurnActionDescription): boolean {
    return typeDescription === this.type;
  }

  public getPlacements(): TilePlacement<T>[] {
    if (this.type === 'PLACE' && this.placements !== undefined) {
      return this.placements;
    } else {
      throw new Error('Placements cannot be returned for non-place actions');
    }
  }
}

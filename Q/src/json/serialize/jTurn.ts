import { ShapeColorTile } from '../../game/map/tile';
import { TilePlacement } from '../../game/types/gameState.types';
import { TurnAction } from '../../player/turnAction';
import { JChoice, OnePlacement } from '../data/data.types';
import { toJTile } from './jMap';

/**
 * Converts a TurnAction to a json representation of a turn action.
 * @param turnAction a TurnAction
 * @returns a json representation of a turn action
 */
export function toJChoice(turnAction: TurnAction<ShapeColorTile>): JChoice {
  if (turnAction.ofType('PASS')) {
    return 'pass';
  }
  if (turnAction.ofType('EXCHANGE')) {
    return 'replace';
  }
  return turnAction.getPlacements().map(toOnePlacement);
}

/**
 * Converts a TilePlacement to a json representation of a tile placement.
 * @param placement a TilePlacement
 * @returns a json representation of a tile placement
 */
function toOnePlacement(
  placement: TilePlacement<ShapeColorTile>
): OnePlacement {
  const coordinate = placement.coordinate.getCoordinate();
  return {
    '1tile': toJTile(placement.tile),
    coordinate: {
      column: coordinate.x,
      row: coordinate.y
    }
  };
}

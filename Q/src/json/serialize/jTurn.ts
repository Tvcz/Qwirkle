import { ShapeColorTile } from '../../game/map/tile';
import { TilePlacement } from '../../game/types/gameState.types';
import { BaseTurnAction } from '../../player/turnAction';
import { JChoice, OnePlacement } from '../data/data.types';
import { toJTile } from './jMap';

export function toJChoice(turnAction: BaseTurnAction<ShapeColorTile>): JChoice {
  if (turnAction.ofType('PASS')) {
    return 'pass';
  }
  if (turnAction.ofType('EXCHANGE')) {
    return 'replace';
  }
  return turnAction.getPlacements().map(toOnePlacement);
}

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

import Coordinate from '../../game/map/coordinate';
import { ShapeColorTile } from '../../game/map/tile';
import { TilePlacement } from '../../game/types/gameState.types';
import { TurnActionDescription } from '../../player/strategy.types';
import { BaseTurnAction } from '../../player/turnAction';
import { JChoice, OnePlacement } from '../data/data.types';
import { toQTile } from './qMap';

export function toTurnAction(jChoice: JChoice): BaseTurnAction<ShapeColorTile> {
  let type: TurnActionDescription;
  let placements: TilePlacement<ShapeColorTile>[] | undefined;
  if (jChoice === 'pass') {
    type = 'PASS';
  } else if (jChoice === 'replace') {
    type = 'EXCHANGE';
  } else {
    type = 'PLACE';
    placements = jChoice.map(toTilePlacement);
  }
  return new BaseTurnAction(type, placements);
}

function toTilePlacement(
  OnePlacement: OnePlacement
): TilePlacement<ShapeColorTile> {
  const x = OnePlacement.coordinate.column;
  const y = OnePlacement.coordinate.row;
  return {
    tile: toQTile(OnePlacement['1tile']),
    coordinate: new Coordinate(x, y)
  };
}

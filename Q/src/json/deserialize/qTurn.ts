import Coordinate from '../../game/map/coordinate';
import { ShapeColorTile } from '../../game/map/tile';
import { TilePlacement } from '../../game/types/gameState.types';
import { TurnActionDescription } from '../../player/strategy.types';
import { BaseTurnAction } from '../../player/turnAction';
import { JAction, JChoice, OnePlacement } from '../data/data.types';
import { toQTile } from './qMap';

type QAction = 'pass' | 'replace' | TilePlacement<ShapeColorTile>;

type QChoise = 'pass' | 'replace' | TilePlacement<ShapeColorTile>[];

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

export function toQAction(jAction: JAction): QAction {
  if (jAction === 'pass') {
    return 'pass';
  }
  if (jAction === 'replace') {
    return 'replace';
  }
  return toTilePlacement(jAction);
}

export function toQChoise(jChoice: JChoice): QChoise {
  if (jChoice === 'pass') {
    return 'pass';
  }
  if (jChoice === 'replace') {
    return 'replace';
  }
  return jChoice.map(toTilePlacement);
}

function toTilePlacement(
  OnePlacement: OnePlacement
): TilePlacement<ShapeColorTile> {
  const x = OnePlacement.coordinate.column;
  const y = OnePlacement.coordinate.row * -1; // row uses graphical coordinates and Coordinate uses cartesian coordinates
  return {
    tile: toQTile(OnePlacement['1tile']),
    coordinate: new Coordinate(x, y)
  };
}

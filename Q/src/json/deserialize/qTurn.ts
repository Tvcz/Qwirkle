import Coordinate from '../../game/map/coordinate';
import { TilePlacement } from '../../game/types/gameState.types';
import { TurnActionDescription } from '../../player/strategy.types';
import { BaseTurnAction } from '../../player/turnAction';
import { JChoice, OnePlacement } from '../data/data.types';
import { toQTile } from './qMap';

/**
 * Converts a json representation of a turn action to a TurnAction.
 * @param jChoice a json representation of a turn action
 * @returns a TurnAction
 */
export function toTurnAction(jChoice: JChoice): BaseTurnAction {
  let type: TurnActionDescription;
  let placements: TilePlacement[] | undefined;
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

/**
 * Converts a json representation of a tile placement to a TilePlacement.
 * @param OnePlacement a json representation of a tile and column index
 * @returns a TilePlacement
 */
function toTilePlacement(OnePlacement: OnePlacement): TilePlacement {
  const x = OnePlacement.coordinate.column;
  const y = OnePlacement.coordinate.row;
  return {
    tile: toQTile(OnePlacement['1tile']),
    coordinate: new Coordinate(x, y)
  };
}

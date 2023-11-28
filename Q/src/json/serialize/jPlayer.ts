import { ShapeColorTile } from '../../game/map/tile';
import { RenderablePlayer } from '../../game/types/gameState.types';
import { JPlayer } from '../data.types';
import { toJTile } from './jMap';

export function toJPlayer(player: RenderablePlayer<ShapeColorTile>) {
  const jPlayer: JPlayer = {
    name: player.name,
    score: player.score,
    'tile*': player.tiles.map(toJTile)
  };
  return jPlayer;
}

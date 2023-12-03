import { ShapeColorTile } from '../../game/map/tile';
import { JPlayer } from '../data/data.types';
import { toJTile } from './jMap';

export function toJPlayer(
  name: string,
  score: number,
  tiles: ShapeColorTile[]
): JPlayer {
  return {
    name,
    score,
    'tile*': tiles.map(toJTile)
  };
}

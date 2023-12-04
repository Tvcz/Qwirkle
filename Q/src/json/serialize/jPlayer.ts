import { ShapeColorTile } from '../../game/map/tile';
import { JPlayer } from '../data/data.types';
import { toJTile } from './jMap';

/**
 * Converts an internal representation of a player to a JPlayer.
 * @param name the name of the player
 * @param score the score of the player
 * @param tiles the tiles the player has
 * @returns a JPlayer
 */
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

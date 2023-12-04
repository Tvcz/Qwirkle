import { RenderableGameState } from '../../game/types/gameState.types';
import { ShapeColorTile } from '../../game/map/tile';
import { JPlayer, JState } from '../data/data.types';
import { toJMap, toJTile } from './jMap';
import { toJPlayer } from './jPlayer';

/**
 * Converts a RenderableGameState (data about the public state of the game for
 * graphical rendering) to a JState.
 * @param gameState a RenderableGameState
 * @returns a JState
 */
export function toJState(
  gameState: RenderableGameState<ShapeColorTile>
): JState {
  const map = toJMap(gameState.mapState.tilePlacements);
  const refsTiles = gameState.remainingTiles.map(toJTile);

  if (gameState.players.length === 0) {
    throw new Error('A player');
  }
  const jPlayers = gameState.players.map((player) =>
    toJPlayer(player.name, player.score, player.tiles)
  );
  const players: [JPlayer, ...JPlayer[]] = [jPlayers[0], ...jPlayers.slice(1)];
  return {
    map,
    'tile*': refsTiles,
    players
  };
}

import { ShapeColorTile } from '../../game/map/tile';
import {
  RenderableGameState,
  RenderablePlayer
} from '../../game/types/gameState.types';
import { JPub, JPubPlayers } from '../data/data.types';
import { toJMap } from './jMap';
import { toJPlayer } from './jPlayer';

/**
 * Serialize a game state to a JPub object for a given player
 *
 * @param gameState the game state to serialize
 * @param playerName the name of the player who's turn it is
 * @returns a JPub object
 */
export function toJPub(
  gameState: RenderableGameState<ShapeColorTile>,
  playerName: string
): JPub {
  const map = toJMap(gameState.mapState);
  const refsTilesCount = gameState.remainingTiles.length;
  const players = toJPubPlayers(gameState.players, playerName);
  return {
    map,
    'tile*': refsTilesCount,
    players
  };
}

/**
 * Serialize a list of players to a JPubPlayers object for a given player
 *
 * @param players the players to serialize
 * @param playerName the name of the player who's turn it is
 * @returns a JPubPlayers object
 */
function toJPubPlayers(
  players: RenderablePlayer<ShapeColorTile>[],
  playerName: string
): JPubPlayers {
  const player = players.find((player) => player.name === playerName);
  if (player === undefined) {
    throw new Error(`Player ${playerName} not found`);
  }
  const jPlayer = toJPlayer(player);
  const otherPlayers = players.filter((player) => player.name !== playerName);
  const otherPlayersScores = otherPlayers.map((player) => player.score);
  return [jPlayer, ...otherPlayersScores];
}

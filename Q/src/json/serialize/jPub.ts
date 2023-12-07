import { ShapeColorTile } from '../../game/map/tile';
import {
  RelevantPlayerInfo,
  Scoreboard
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
  gameState: RelevantPlayerInfo,
  playerName: string
): JPub {
  const map = toJMap(gameState.mapState);
  const refsTilesCount = gameState.remainingTilesCount;
  const players = toJPubPlayers(
    gameState.scoreboard,
    gameState.playerTiles,
    playerName
  );
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
  scoreboard: Scoreboard,
  playerTiles: ShapeColorTile[],
  playerName: string
): JPubPlayers {
  const score = scoreboard.find((player) => player.name === playerName)?.score;
  if (score === undefined) {
    throw new Error(`Player ${playerName} not found in scoreboard`);
  }
  const jPlayer = toJPlayer(playerName, score, playerTiles);
  const otherPlayers = scoreboard.filter(
    (player) => player.name !== playerName
  );
  const otherPlayersScores = otherPlayers.map((player) => player.score);
  return [jPlayer, ...otherPlayersScores];
}

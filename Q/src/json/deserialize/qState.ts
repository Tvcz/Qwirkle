import { REFEREE_PLAYER_TIMEOUT_MS } from '../../constants';
import PlayerState from '../../game/gameState/playerState';
import { QMap } from '../../game/map/map';
import { ShapeColorTile } from '../../game/map/tile';
import { JState } from '../data/data.types';
import { toQMap, toQTile } from './qMap';
import { Player } from '../../player/player';
import { SafePlayer } from '../../referee/safePlayer';
import { GameState, QGameState } from '../../game/gameState/gameState';
import PlayerTurnQueue from '../../game/gameState/playerTurnQueue';
import { BaseBagOfTiles } from '../../game/gameState/bagOfTiles';

type QState = {
  qMap: QMap;
  qTilesInBag: ShapeColorTile[];
  playerStates: PlayerState[];
};

/**
 * Converts a json representation of a game state to a QState.
 * @param jState a json representation of a game state
 * @param players the players in the game
 * @returns a QState, which is a representation of the game state for use in
 * the testing framework
 */
export async function toQState(
  jState: JState,
  players: Player[]
): Promise<QState> {
  const qMap = toQMap(jState.map);
  const qTilesInBag = jState['tile*'].map((tile) => toQTile(tile));
  const qPlayers = jState.players.map((player) => ({
    score: player.score,
    name: player.name,
    'tile*': player['tile*'].map((tile) => toQTile(tile))
  }));

  const playerStates = await Promise.all(
    players.map(async (player, index) => {
      const playerName = await player.name();
      const playerState = new PlayerState(
        new SafePlayer(player, REFEREE_PLAYER_TIMEOUT_MS),
        playerName
      );
      const qPlayer = qPlayers[index];
      playerState.setTiles(qPlayer['tile*']);
      playerState.updateScore(qPlayer.score);
      if (qPlayer.name !== playerName) {
        throw new Error(
          `Player name mismatch: ${qPlayer.name} vs ${playerName}`
        );
      }

      return playerState;
    })
  );

  return { qMap, qTilesInBag, playerStates };
}

/**
 * Converts a json representation of a game state to a QGameState.
 * @param jState a json representation of a game state
 * @param players the players in the game
 * @returns a QGameState, which is a representation of the game state for use in
 * json messages
 */
export async function toQGameState(
  jState: JState,
  players: Player[]
): Promise<QGameState> {
  const { qMap, qTilesInBag, playerStates } = await toQState(jState, players);
  return new GameState(
    qMap,
    new PlayerTurnQueue(playerStates),
    new BaseBagOfTiles(qTilesInBag)
  );
}

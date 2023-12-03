import { REFEREE_PLAYER_TIMEOUT_MS } from '../../constants';
import PlayerState from '../../game/gameState/playerState';
import { QMap } from '../../game/map/map';
import { ShapeColorTile } from '../../game/map/tile';
import { JState } from '../data/data.types';
import { toQMap, toQTile } from './qMap';
import { Player } from '../../player/player';
import { SafePlayer } from '../../referee/safePlayer';

type QState = {
  qMap: QMap<ShapeColorTile>;
  qTilesInBag: ShapeColorTile[];
  playerStates: PlayerState<ShapeColorTile>[];
};

export async function toQState(
  jState: JState,
  players: Player<ShapeColorTile>[]
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
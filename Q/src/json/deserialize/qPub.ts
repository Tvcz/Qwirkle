import { JPub } from '../data/data.types';
import { RelevantPlayerInfo } from '../../game/types/gameState.types';
import { ShapeColorTile } from '../../game/map/tile';
import { toQMap, toQTile } from './qMap';

export function toQRelevantPlayerInfo(
  jPub: JPub
): RelevantPlayerInfo<ShapeColorTile> {
  const [activePlayer, ...playerScores] = jPub.players;
  const playerTiles = activePlayer['tile*'].map(toQTile);

  const qMap = toQMap(jPub.map);
  const mapState = qMap.getAllPlacements();

  const activePlayerScoreBoard = {
    name: activePlayer.name,
    score: activePlayer.score
  };
  const scoreboard = [activePlayerScoreBoard];
  const playersQueue = [activePlayer.name];
  playerScores.forEach((playerScore, i) => {
    const playerMadeUpName = i.toString();
    scoreboard.push({
      name: playerMadeUpName,
      score: playerScore
    });
    playersQueue.push(playerMadeUpName);
  });

  const remainingTilesCount = jPub['tile*'];

  return {
    playerTiles,
    mapState,
    scoreboard,
    remainingTilesCount,
    playersQueue
  };
}

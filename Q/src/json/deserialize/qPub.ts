import { JPub } from '../data/data.types';
import { RelevantPlayerInfo } from '../../game/types/gameState.types';
import { toQMap, toQTile } from './qMap';

/**
 * Converts a json representation of a public game state to a RelevantPlayerInfo.
 * @param jPub a json representation of a public game state
 * @returns a RelevantPlayerInfo, which is a representation of the game state
 */
export function toQRelevantPlayerInfo(jPub: JPub): RelevantPlayerInfo {
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

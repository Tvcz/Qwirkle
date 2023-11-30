import { JPub } from '../data/data.types';
import { RelevantPlayerInfo } from '../../game/types/gameState.types';
import { ShapeColorTile } from '../../game/map/tile';

export function toQRelevantPlayerInfo(
  jPub: JPub
): RelevantPlayerInfo<ShapeColorTile> {
  return {
    // The tiles that the current player has and can play or exchange.
    playerTiles: [],

    // A list of every tile placement currently on the board. A tile placement consists of a coordinate and a tile.
    mapState: [],

    // The scoreboard of the game, a list of player ids and scores
    scoreboard: [],

    // The number of remaining tiles in the bag of tiles
    remainingTilesCount: 0,

    // The order the players will take turns in. Represented by a list of their names, where the first in the list is the active player and the rest are listed in order.
    playersQueue: []
  };
}

import { BaseTile } from '../../game/map/tile';
import {
  TilePlacement,
  RelevantPlayerInfo
} from '../../game/types/gameState.types';
import { Player } from '../../player/player';
import { TurnAction } from '../../player/turnAction';

// Implements the player but converts method calls to JSON strings
// which are sent over a connection to a remote player

class TCPPlayer implements Player<BaseTile> {
  constructor(Connection: connection) {}

  name(): string {}

  setUp(m: TilePlacement<BaseTile>[], st: BaseTile[]): void {}

  takeTurn(s: RelevantPlayerInfo<BaseTile>): TurnAction<BaseTile> {}

  newTiles(st: BaseTile[]): void {}

  win(w: boolean): void {}
}

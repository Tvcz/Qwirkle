import { BaseTile } from '../../game/map/tile';
import {
  TilePlacement,
  RelevantPlayerInfo
} from '../../game/types/gameState.types';
import { Player } from '../../player/player';
import { TurnAction } from '../../player/turnAction';
import { Connection } from '../connection';
import {
  isNameResponse,
  isNewTilesResponse,
  isSetUpResponse,
  isTakeTurnResponse,
  validateJSON
} from '../jsonValidator';
import { buildTurnAction } from '../parse';

const STANDARD_TIMEOUT_MS = 3000;
const TURN_TIMEOUT_MS = 5000;

// Implements the player but converts method calls to JSON strings
// which are sent over a connection to a remote player
export class TCPPlayer implements Player<BaseTile> {
  private readonly connection: Connection;
  private buffer: string = '';
  private cachedName: string = '';
  private readonly nameTimeout: number;

  constructor(
    connection: Connection,
    nameTimeout: number = STANDARD_TIMEOUT_MS
  ) {
    this.connection = connection;
    this.connection.onResponse((data: string) => (this.buffer = data));
    this.nameTimeout = nameTimeout;
  }

  name(): string {
    if (this.cachedName !== '') {
      return this.cachedName;
    }
    this.connection.send(this.buildMessage('name', []));
    const res = this.awaitResponse(this.nameTimeout);
    const parsedRes = validateJSON(res);
    if (isNameResponse(parsedRes)) {
      this.cachedName = parsedRes.result;
      return parsedRes.result;
    } else {
      throw new Error('invalid response: name');
    }
  }

  setUp(m: TilePlacement<BaseTile>[], st: BaseTile[]): void {
    this.connection.send(
      this.buildMessage('setUp', [
        {
          mapState: m,
          startingTiles: st
        }
      ])
    );
    const res = this.awaitResponse(STANDARD_TIMEOUT_MS);
    const parsedRes = validateJSON(res);
    if (isSetUpResponse(parsedRes)) {
      if (parsedRes.result !== 0) {
        throw new Error('invalid response: setup not acknowledged');
      }
    } else {
      throw new Error('invalid response: setup');
    }
  }

  takeTurn(s: RelevantPlayerInfo<BaseTile>): TurnAction<BaseTile> {
    this.connection.send(
      this.buildMessage('takeTurn', [
        {
          publicState: s
        }
      ])
    );
    const res = this.awaitResponse(TURN_TIMEOUT_MS);
    const parsedRes = validateJSON(res);
    if (isTakeTurnResponse(parsedRes)) {
      return buildTurnAction(parsedRes.result);
    } else {
      throw new Error('invalid response: takeTurn');
    }
  }

  newTiles(st: BaseTile[]): void {
    this.connection.send(
      this.buildMessage('newTiles', [
        {
          newTiles: st
        }
      ])
    );
    const res = this.awaitResponse(STANDARD_TIMEOUT_MS);
    const parsedRes = validateJSON(res);
    if (isNewTilesResponse(parsedRes)) {
      if (parsedRes.result !== 0) {
        throw new Error('invalid response: newTiles not acknowledged');
      }
    } else {
      throw new Error('invalid response: newTiles');
    }
  }

  win(w: boolean): void {
    this.connection.send(
      this.buildMessage('win', [
        {
          win: w
        }
      ])
    );
    const res = this.awaitResponse(STANDARD_TIMEOUT_MS);
    const parsedRes = validateJSON(res);
    if (isNewTilesResponse(parsedRes)) {
      if (parsedRes.result !== 0) {
        throw new Error('invalid response: win not acknowledged');
      }
    } else {
      throw new Error('invalid response: win');
    }
  }

  private buildMessage(method: string, args: any[]): string {
    return JSON.stringify({ method, args });
  }

  private awaitResponse(timeout: number): string {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if (this.buffer.length > 0) {
        const response = this.buffer;
        this.buffer = '';
        return response;
      }
    }
    throw new Error('timeout');
  }
}

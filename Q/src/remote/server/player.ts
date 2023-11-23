import {
  SERVER_PLAYER_STANDARD_TIMEOUT_MS,
  SERVER_PLAYER_TURN_TIMEOUT_MS
} from '../../constants';
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
  isWinResponse,
  validateJSON
} from '../jsonValidator';
import { buildTurnAction } from '../parse';

/**
 * A TCPPlayer implements the Player interface but rather than handling
 * functionality directly it sends messages across a network to a client Player
 * who returns the expected values from the calls and sends them back.
 *
 * Since the TCPPlayer has to synchronously wait for responses in order to match
 * the expected behavior in the Player interface, the TCPPlayer will throw a
 * timeout error in the case that the client takes too long to respond.
 *
 * This timeout is configured via:
 *  - `SERVER_PLAYER_STANDARD_TIMEOUT_MS` constant, which is the default timeout
 *    for all non-`takeTurn` methods, and
 *  - `SERVER_PLAYER_TURN_TIMEOUT_MS`, which is the timeout for the `takeTurn`
 *    method. This case is handled differently because since it could require
 *    significant computational work on the user end and so might be allowed a
 *    longer timeout.
 *
 * In addition, a custom timeout can be passed in during construction which is
 * specific to calls to the `name` method, which allows the server to decide how
 * long it is willing to wait for a player to finish signing up after joining a
 * game.
 */
export class TCPPlayer /*implements Player<BaseTile>*/ {
  private readonly connection: Connection;
  private buffer: string = '';
  private cachedName: string = '';
  private readonly nameTimeout: number;

  /**
   * Constructs a TCPPlayer that communicates with a a client over the given connection.
   * @param connection the connection with the client player
   * @param nameTimeout the time to wait for a response
   */
  constructor(
    connection: Connection,
    nameTimeout: number = SERVER_PLAYER_STANDARD_TIMEOUT_MS
  ) {
    this.connection = connection;
    this.connection.onResponse((data: string) => (this.buffer = data));
    this.nameTimeout = nameTimeout;
  }

  /**
   * Requests the player's name from the client.
   *
   * This result is cached after the first call, and the cached result is
   * subsequently used, since it should never change for a given player.
   *
   * @returns the name of the player
   */
  async name(): Promise<string> {
    if (this.cachedName !== '') {
      return this.cachedName;
    }
    this.connection.send(this.buildMessage('name', []));
    const res = await this.awaitResponse(this.nameTimeout);
    const parsedRes = validateJSON(res);
    if (isNameResponse(parsedRes)) {
      this.cachedName = parsedRes.result;
      return parsedRes.result;
    } else {
      throw new Error('invalid response: name');
    }
  }

  async setUp(m: TilePlacement<BaseTile>[], st: BaseTile[]): Promise<void> {
    this.connection.send(
      this.buildMessage('setUp', [
        {
          mapState: m,
          startingTiles: st
        }
      ])
    );
    const res = await this.awaitResponse(SERVER_PLAYER_STANDARD_TIMEOUT_MS);
    const parsedRes = validateJSON(res);
    if (isSetUpResponse(parsedRes)) {
      if (parsedRes.result !== 0) {
        throw new Error('invalid response: setup not acknowledged');
      }
    } else {
      throw new Error('invalid response: setup');
    }
  }

  async takeTurn(
    s: RelevantPlayerInfo<BaseTile>
  ): Promise<TurnAction<BaseTile>> {
    this.connection.send(
      this.buildMessage('takeTurn', [
        {
          publicState: s
        }
      ])
    );
    const res = await this.awaitResponse(SERVER_PLAYER_TURN_TIMEOUT_MS);
    const parsedRes = validateJSON(res);
    if (isTakeTurnResponse(parsedRes)) {
      return buildTurnAction(parsedRes.result);
    } else {
      throw new Error('invalid response: takeTurn');
    }
  }

  async newTiles(st: BaseTile[]): Promise<void> {
    this.connection.send(
      this.buildMessage('newTiles', [
        {
          newTiles: st
        }
      ])
    );
    const res = await this.awaitResponse(SERVER_PLAYER_STANDARD_TIMEOUT_MS);
    const parsedRes = validateJSON(res);
    if (isNewTilesResponse(parsedRes)) {
      if (parsedRes.result !== 0) {
        throw new Error('invalid response: newTiles not acknowledged');
      }
    } else {
      throw new Error('invalid response: newTiles');
    }
  }

  async win(w: boolean): Promise<void> {
    this.connection.send(
      this.buildMessage('win', [
        {
          win: w
        }
      ])
    );
    const res = await this.awaitResponse(SERVER_PLAYER_STANDARD_TIMEOUT_MS);
    const parsedRes = validateJSON(res);
    if (isWinResponse(parsedRes)) {
      if (parsedRes.result !== 0) {
        throw new Error('invalid response: win not acknowledged');
      }
    } else {
      throw new Error('invalid response: win');
    }
    this.connection.close();
  }

  /**
   * Builds a JSON message to send to a client player from the given method and arguments.
   * @param method the name of the method which the client should call
   * @param args the arguments to pass to the method
   * @returns the JSON message to send to the client
   */
  private buildMessage(method: string, args: any[]): string {
    return JSON.stringify({ method, args });
  }

  /**
   * Syncrohnously waits for a response from the client for the given timeout.
   * @param timeout the amount of time to wait for a response
   * @returns the response from the client
   * @throws an error if the timeout is exceeded
   */
  private async awaitResponse(timeout: number): Promise<string> {
    // const start = Date.now();
    // while (Date.now() - start < timeout) {
    //   if (this.buffer.length > 0) {
    //     const response = this.buffer;
    //     this.buffer = '';
    //     return response;
    //   }
    // }
    let response = '';
    setInterval(() => {
      if (this.buffer.length > 0) {
        response = this.buffer;
        this.buffer = '';
      }
    });
    throw new Error('timeout');
  }
}

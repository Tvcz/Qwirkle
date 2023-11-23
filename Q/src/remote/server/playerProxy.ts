import {
  REFEREE_PLAYER_TIMEOUT_MS,
  TCP_PLAYER_BUFFER_INTERVAL_MS
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
import { MethodResponse } from '../types';

/**
 * A TCPPlayer implements the Player interface but rather than handling
 * functionality directly it sends messages across a network to a client Player
 * who returns the expected values from the calls and sends them back.
 *
 * It waits on a response from the client before returning from each method call.
 * However, if the wait time exceeds a certain threshold, it will stop waiting
 * to avoid a hanging async process. This threshold is defined by
 * `REFEREE_PLAYER_TIMEOUT_MS`, in order to align with the timeout in the
 * referee.
 */
export class TCPPlayer implements Player<BaseTile> {
  private readonly connection: Connection;
  private cachedName: string = '';
  private buffer: string = '';

  /**
   * Constructs a TCPPlayer that communicates with a a client over the given connection.
   * @param connection the connection with the client player
   * @param nameTimeout the time to wait for a response
   */
  constructor(connection: Connection) {
    this.connection = connection;
    this.connection.onResponse((message: string) => {
      this.buffer += message;
    });
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
    const parsedRes = await this.sendMessageAndGetParsedResponse('name', {});
    const validName = this.validateResponse(parsedRes, isNameResponse, 'name');
    this.cachedName = validName.result;
    return validName.result;
  }

  async setUp(m: TilePlacement<BaseTile>[], st: BaseTile[]): Promise<void> {
    const parsedRes = await this.sendMessageAndGetParsedResponse('setUp', {
      mapState: m,
      startingTiles: st
    });
    this.validateResponse(parsedRes, isSetUpResponse, 'setUp', true);
  }

  async takeTurn(
    s: RelevantPlayerInfo<BaseTile>
  ): Promise<TurnAction<BaseTile>> {
    const parsedRes = await this.sendMessageAndGetParsedResponse('takeTurn', {
      publicState: s
    });
    const validTakeTurn = this.validateResponse(
      parsedRes,
      isTakeTurnResponse,
      'takeTurn'
    );
    return buildTurnAction(validTakeTurn.result);
  }

  async newTiles(st: BaseTile[]): Promise<void> {
    const parsedRes = await this.sendMessageAndGetParsedResponse('newTiles', {
      newTiles: st
    });
    this.validateResponse(parsedRes, isNewTilesResponse, 'newTiles', true);
  }

  async win(w: boolean): Promise<void> {
    const parsedRes = await this.sendMessageAndGetParsedResponse('win', {
      win: w
    });

    this.validateResponse(parsedRes, isWinResponse, 'win', true);
    this.connection.close();
  }

  /**
   * Validates the response from the client, throwing an error if it is invalid.
   * @param response the message received from the client
   * @param validator a function which returns true if the response is valid
   * @param methodName the name of the method which was called on the client
   * @param isVoidMethod whether the method should have returned an
   * acknowledgement, since some methods do not return anything
   */
  private validateResponse<T extends MethodResponse>(
    response: unknown,
    validator: (res: unknown) => res is T,
    methodName: string,
    isVoidMethod = false
  ): T {
    if (!validator(response)) {
      throw new Error(`invalid response: ${methodName}`);
    }
    if (isVoidMethod && response.result !== 0) {
      throw new Error(`invalid response: ${methodName} not acknowledged`);
    }
    return response;
  }

  /**
   * Sends a message to the client and waits for a response, which is then
   * parsed and returned.
   * @param methodName the name of the method to call on the client
   * @param args the arguments to pass to the method
   * @returns the parsed response from the client
   */
  private async sendMessageAndGetParsedResponse(
    methodName: string,
    args: unknown
  ): Promise<unknown> {
    const res = this.awaitResponse();
    this.connection.send(this.buildMessage(methodName, args));
    return validateJSON(await res);
  }

  /**
   * Builds a JSON message to send to a client player from the given method and arguments.
   * @param method the name of the method which the client should call
   * @param args the arguments to pass to the method
   * @returns the JSON message to send to the client
   */
  private buildMessage(methodName: string, args: unknown): string {
    return JSON.stringify({ method: methodName, args });
  }

  /**
   * Waits for a response from the client and creates a promise which contains
   * the result.
   *
   * @returns the response from the client
   */
  private awaitResponse(): Promise<string> {
    const start = Date.now();
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (this.buffer !== '') {
          clearInterval(interval);
          resolve(this.buffer);
          this.buffer = '';
        } else if (start + REFEREE_PLAYER_TIMEOUT_MS > Date.now()) {
          // stops waiting to avoid a hanging async process
          clearInterval(interval);
          resolve('');
        }
      }, TCP_PLAYER_BUFFER_INTERVAL_MS);
    });
  }
}

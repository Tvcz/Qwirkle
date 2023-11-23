import { SERVER_PLAYER_STANDARD_TIMEOUT_MS } from '../../constants';
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
export class TCPPlayer implements Player<BaseTile> {
  private readonly connection: Connection;
  private cachedName: string = '';
  private readonly nameTimeout: number;
  private messageHandler: (message: string) => void;

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
    this.nameTimeout = nameTimeout;
    this.messageHandler = (message: string) => {
      throw new Error(
        'no message handler set, but message received: ' + message
      );
    };
    this.connection.onResponse(this.messageHandler);
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
    const parsedRes = this.sentMessageAndGetParsedResponse('name', []);
    const validName = this.validateResponse(parsedRes, isNameResponse, 'name');
    this.cachedName = validName.result;
    return validName.result;
  }

  async setUp(m: TilePlacement<BaseTile>[], st: BaseTile[]): Promise<void> {
    const parsedRes = this.sentMessageAndGetParsedResponse('setUp', [
      {
        mapState: m,
        startingTiles: st
      }
    ]);
    this.validateResponse(parsedRes, isSetUpResponse, 'setUp', true);
  }

  async takeTurn(
    s: RelevantPlayerInfo<BaseTile>
  ): Promise<TurnAction<BaseTile>> {
    const parsedRes = this.sentMessageAndGetParsedResponse('takeTurn', [
      {
        publicState: s
      }
    ]);
    const validTakeTurn = this.validateResponse(
      parsedRes,
      isTakeTurnResponse,
      'takeTurn'
    );
    return buildTurnAction(validTakeTurn.result);
  }

  async newTiles(st: BaseTile[]): Promise<void> {
    const parsedRes = this.sentMessageAndGetParsedResponse('newTiles', [
      {
        newTiles: st
      }
    ]);
    this.validateResponse(parsedRes, isNewTilesResponse, 'newTiles', true);
  }

  async win(w: boolean): Promise<void> {
    const parsedRes = this.sentMessageAndGetParsedResponse('win', [
      {
        win: w
      }
    ]);

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
  private async sentMessageAndGetParsedResponse(
    methodName: string,
    args: unknown[]
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
  private buildMessage(methodName: string, args: unknown[]): string {
    return JSON.stringify({ method: methodName, args });
  }

  /**
   * Waits for a response from the client and creates a promise which contains
   * the result.
   *
   * INVARIANT: this method must be called before the message is expected to be
   * received, so that the message handler can be set up in time.
   *
   * @returns the response from the client
   * @throws an error if the timeout is exceeded
   */
  private awaitResponse(): Promise<string> {
    return new Promise((resolve) => {
      this.messageHandler = (message: string) => {
        resolve(message);
      };
    });
  }
}

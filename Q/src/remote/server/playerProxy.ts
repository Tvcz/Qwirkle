import { TCP_PLAYER_BUFFER_INTERVAL_MS } from '../../constants';
import { ShapeColorTile } from '../../game/map/tile';
import { RelevantPlayerInfo } from '../../game/types/gameState.types';
import { JPub, JTile } from '../../json/data/data.types';
import { toTurnAction } from '../../json/deserialize/qTurn';
import {
  isNameResponse,
  isNewTilesResponse,
  isSetUpResponse,
  isTakeTurnResponse,
  isWinResponse
} from '../../json/messages/messagesTypeGuards';
import { toJTile } from '../../json/serialize/jMap';
import { toJPub } from '../../json/serialize/jPub';
import { isValidJSON, validateJSON } from '../../json/validator/validator';
import { Player } from '../../player/player';
import { TurnAction } from '../../player/turnAction';
import { toMs } from '../../utils';
import { Connection } from '../connection';

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
export class TCPPlayer implements Player {
  private readonly connection: Connection;
  private readonly maxResponseWait: number;
  private cachedName: string = '';
  private buffer: string = '';

  /**
   * Constructs a TCPPlayer that communicates with a a client over the given connection.
   * @param connection the connection with the client player
   * @param nameTimeout the time to wait for a response
   */
  constructor(connection: Connection, maxResponseWait: number) {
    this.maxResponseWait = toMs(maxResponseWait);
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
    if (this.cachedName == '') {
      const parsedRes = await this.sendMessageAndGetParsedResponse('name', []);
      this.cachedName = this.validateResponse(
        parsedRes,
        isNameResponse,
        'name'
      );
    }
    return this.cachedName;
  }

  async setUp(s: RelevantPlayerInfo, st: ShapeColorTile[]): Promise<void> {
    const setUpArgs = this.buildSetUpArgs(s, st);
    const parsedRes = await this.sendMessageAndGetParsedResponse(
      'setup',
      setUpArgs
    );
    this.validateResponse(parsedRes, isSetUpResponse, 'setup');
  }

  // INVARIANT: the name of the player is cached before this method is called
  private buildSetUpArgs(
    s: RelevantPlayerInfo,
    st: ShapeColorTile[]
  ): [JPub, JTile[]] {
    return [toJPub(s, this.cachedName), st.map(toJTile)];
  }

  async takeTurn(s: RelevantPlayerInfo): Promise<TurnAction> {
    const takeTurnArgs = this.buildTakeTurnArgs(s);
    const parsedRes = await this.sendMessageAndGetParsedResponse(
      'take-turn',
      takeTurnArgs
    );
    const validTakeTurn = this.validateResponse(
      parsedRes,
      isTakeTurnResponse,
      'take-turn'
    );
    return toTurnAction(validTakeTurn);
  }

  private buildTakeTurnArgs(s: RelevantPlayerInfo): [JPub] {
    return [toJPub(s, this.cachedName)];
  }

  async newTiles(st: ShapeColorTile[]): Promise<void> {
    const newTilesArgs = this.buildNewTilesArgs(st);
    const parsedRes = await this.sendMessageAndGetParsedResponse(
      'new-tiles',
      newTilesArgs
    );
    this.validateResponse(parsedRes, isNewTilesResponse, 'new-tiles');
  }

  private buildNewTilesArgs(st: ShapeColorTile[]): [JTile[]] {
    return [st.map(toJTile)];
  }

  async win(w: boolean): Promise<void> {
    const parsedRes = await this.sendMessageAndGetParsedResponse('win', [w]);
    this.validateResponse(parsedRes, isWinResponse, 'win');
    this.connection.close();
  }

  /**
   * Validates the response from the client, throwing an error if it is invalid.
   * @param response the message received from the client
   * @param validator a function which returns true if the response is valid
   * @param methodName the name of the method which was called on the client
   * acknowledgement, since some methods do not return anything
   */
  private validateResponse<T>(
    response: unknown,
    validator: (res: unknown) => res is T,
    methodName: string
  ): T {
    if (!validator(response)) {
      throw new Error(`invalid response: ${methodName}`);
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
    return JSON.stringify([methodName, args]);
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
        if (this.buffer !== '' && isValidJSON(this.buffer)) {
          clearInterval(interval);
          resolve(this.buffer);
          this.buffer = '';
        } else if (start + this.maxResponseWait < Date.now()) {
          // stops waiting to avoid a hanging async process
          clearInterval(interval);
          resolve('');
        }
      }, TCP_PLAYER_BUFFER_INTERVAL_MS);
    });
  }
}

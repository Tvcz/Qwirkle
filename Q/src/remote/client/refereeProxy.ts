import { Player } from '../../player/player';
import { BaseTile } from '../../game/map/tile';
import { Connection } from '../connection';
import {
  isNameCall,
  isNewTilesCall,
  isSetUpCall,
  isTakeTurnCall,
  isWinCall
} from '../jsonValidator';
import { NewTilesCall, SetUpCall, TakeTurnCall, WinCall } from '../types';
import { buildTile, buildTilePlacement } from '../parse';
import { validateJSON } from '../../json/validator';

/**
 * A referee proxy listens for messages from the server and converts them
 * to method calls which are made on the player.
 *
 * INVARIANTS:
 * - Each referee proxy has its own connection to the server.
 * - The referee proxy is called once per client player.
 *
 * @param player - The player to make method calls on.
 * @param connection - The connection to the server.
 */
export function refereeProxy(player: Player<BaseTile>, connection: Connection) {
  // listens for tcp messages from the server
  // converts them to method calls on the player
  connection.onResponse(async (data) => {
    // json validator
    const parsedMessage = validateJSON(data);
    if (isNameCall(parsedMessage)) {
      await makeNameCall(player, connection);
    } else if (isSetUpCall(parsedMessage)) {
      await makeSetUpCall(player, connection, parsedMessage);
    } else if (isTakeTurnCall(parsedMessage)) {
      await makeTakeTurnCall(player, connection, parsedMessage);
    } else if (isNewTilesCall(parsedMessage)) {
      await makeNewTilesCall(player, connection, parsedMessage);
    } else if (isWinCall(parsedMessage)) {
      await makeWinCall(player, connection, parsedMessage);
    } else {
      throw new Error('invalid method received in message');
    }
  });
}

/**
 * Make a call to the player's name method and send the result to the server.
 *
 * @param player - The player to make the call on.
 * @param connection - The connection to the server.
 */
async function makeNameCall(player: Player<BaseTile>, connection: Connection) {
  const result = await player.name();
  const response = { method: 'name', result };
  connection.send(JSON.stringify(response));
}

/**
 * Make a call to the player's setup method and send the result to the server.
 *
 * @param player - The player to make the call on.
 * @param connection - The connection with the server.
 * @param message - The setup call message received from the server.
 */
async function makeSetUpCall(
  player: Player<BaseTile>,
  connection: Connection,
  message: SetUpCall
) {
  const args = message.args;
  await player.setUp(
    args.mapState.map(buildTilePlacement),
    args.startingTiles.map(buildTile)
  );
  const response = { method: 'setUp', result: 0 };
  connection.send(JSON.stringify(response));
}

/**
 * Make a call to the player's takeTurn method and send the result to the server.
 *
 * @param player - The player to make the call on.
 * @param connection - The connection to the server.
 * @param message - The takeTurn call message received from the server.
 */
async function makeTakeTurnCall(
  player: Player<BaseTile>,
  connection: Connection,
  message: TakeTurnCall
) {
  const parsedPublicState = message.args.publicState;
  const publicState = {
    playerTiles: parsedPublicState.playerTiles.map(buildTile),
    mapState: parsedPublicState.mapState.map(buildTilePlacement),
    scoreboard: parsedPublicState.scoreboard,
    remainingTilesCount: parsedPublicState.remainingTilesCount,
    playersQueue: parsedPublicState.playersQueue
  };
  const result = await player.takeTurn(publicState);
  const response = { method: 'takeTurn', result };
  connection.send(JSON.stringify(response));
}

/**
 * Make a call to the player's newTiles method and send the result to the server.
 *
 * @param player - The player to make the call on.
 * @param connection - The connection to the server.
 * @param message - The newTiles call message received from the server.
 */
async function makeNewTilesCall(
  player: Player<BaseTile>,
  connection: Connection,
  message: NewTilesCall
) {
  await player.newTiles(message.args.newTiles.map(buildTile));
  const response = { method: 'newTiles', result: 0 };
  connection.send(JSON.stringify(response));
}

/**
 * Make a call to the player's win method and send the result to the server.
 *
 * @param player - The player to make the call on.
 * @param connection - The connection to the server.
 * @param message - The win call message received from the server.
 */
async function makeWinCall(
  player: Player<BaseTile>,
  connection: Connection,
  message: WinCall
) {
  await player.win(message.args.win);
  const response = { method: 'win', result: 0 };
  connection.send(JSON.stringify(response));
  connection.close();
}

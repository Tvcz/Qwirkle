import { Player } from '../../player/player';
import { ShapeColorTile } from '../../game/map/tile';
import { Connection } from '../connection';
import { validateJSON } from '../../json/validator/validator';
import {
  isNameCall,
  isSetUpCall,
  isTakeTurnCall,
  isNewTilesCall,
  isWinCall
} from '../../json/messages/messagesTypeGuards';
import {
  SetUpCall,
  TakeTurnCall,
  NewTilesCall,
  WinCall
} from '../../json/messages/messages.types';
import { toQRelevantPlayerInfo } from '../../json/deserialize/qPub';
import { toQTile } from '../../json/deserialize/qMap';
import { toJChoice } from '../../json/serialize/jTurn';
import { VOID_METHOD_RESPONSE } from '../../constants';

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
export function refereeProxy(
  player: Player<ShapeColorTile>,
  connection: Connection,
  shouldLog: boolean
) {
  // listens for tcp messages from the server
  // converts them to method calls on the player
  connection.onResponse(async (data) => {
    // json validator
    const parsedMessage = validateJSON(data);
    try {
      await handleMessage(parsedMessage, player, connection);
    } catch (error) {
      !shouldLog && console.error(error);
      // pass so that the client doesn't crash
    }
  });
}

async function handleMessage(
  parsedMessage: unknown,
  player: Player<ShapeColorTile>,
  connection: Connection
) {
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
}

/**
 * Make a call to the player's name method and send the result to the server.
 *
 * @param player - The player to make the call on.
 * @param connection - The connection to the server.
 */
async function makeNameCall(
  player: Player<ShapeColorTile>,
  connection: Connection
) {
  const result = await player.name();
  connection.send(JSON.stringify(result));
}

/**
 * Make a call to the player's setup method and send the result to the server.
 *
 * @param player - The player to make the call on.
 * @param connection - The connection with the server.
 * @param message - The setup call message received from the server.
 */
async function makeSetUpCall(
  player: Player<ShapeColorTile>,
  connection: Connection,
  message: SetUpCall
) {
  const args = message[1];
  const publicState = toQRelevantPlayerInfo(args[0]);
  const startingTiles = args[1].map(toQTile);
  await player.setUp(publicState, startingTiles);
  connection.send(JSON.stringify(VOID_METHOD_RESPONSE));
}

/**
 * Make a call to the player's takeTurn method and send the result to the server.
 *
 * @param player - The player to make the call on.
 * @param connection - The connection to the server.
 * @param message - The takeTurn call message received from the server.
 */
async function makeTakeTurnCall(
  player: Player<ShapeColorTile>,
  connection: Connection,
  message: TakeTurnCall
) {
  const args = message[1];
  const publicState = toQRelevantPlayerInfo(args[0]);
  const result = await player.takeTurn(publicState);
  const response = toJChoice(result);
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
  player: Player<ShapeColorTile>,
  connection: Connection,
  message: NewTilesCall
) {
  const args = message[1];
  const tiles = args[0].map(toQTile);
  await player.newTiles(tiles);
  connection.send(JSON.stringify(VOID_METHOD_RESPONSE));
}

/**
 * Make a call to the player's win method and send the result to the server.
 *
 * @param player - The player to make the call on.
 * @param connection - The connection to the server.
 * @param message - The win call message received from the server.
 */
async function makeWinCall(
  player: Player<ShapeColorTile>,
  connection: Connection,
  message: WinCall
) {
  const args = message[1];
  await player.win(args[0]);
  connection.send(JSON.stringify(VOID_METHOD_RESPONSE));
  connection.close();
}

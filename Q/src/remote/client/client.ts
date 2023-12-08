import { createConnection } from 'net';
import { TCPConnection } from '../connection';
import { Player } from '../../player/player';
import { refereeProxy } from './refereeProxy';
import { DEFAULT_CONNECTION_OPTIONS } from '../../constants';
import { ClientConfig } from '../../json/config/clientConfig';
import { toQPlayers } from '../../json/deserialize/qActor';
import { BaseRuleBook } from '../../game/rules/ruleBook';
import { toMs } from '../../utils';
import { DebugLog } from '../debugLog';

/**
 * Starts a client which creates players according to a client config and
 * attempts to join them all to a game hosted at the specified host and port.
 * @param config The client config
 */
export async function runClient(config: ClientConfig) {
  const players = toQPlayers(config.players, new BaseRuleBook());
  const debugLog = new DebugLog(!config.quiet);
  const connectionOptions = {
    host: config.host,
    port: config.port
  };

  debugLog.log(`joining game as player ${config.players[0][0]}`);
  await joinGame(players[0], connectionOptions, debugLog);

  players.splice(1).forEach((player, index) => {
    setTimeout(
      () => {
        debugLog.log(`joining game as player ${config.players[index][0]}`);
        joinGame(player, connectionOptions, debugLog);
      },
      toMs(config.wait * (index + 1))
    );
  });
}

/**
 * Joins a game hosted at the specified host and port.
 * Called once per player connecting to game.
 * @param player The player to join the game.
 * @param connectionOptions The host and port to connect to.
 * @param shouldLog Whether to log the game state to the console.
 */
export function joinGame(
  player: Player,
  connectionOptions = DEFAULT_CONNECTION_OPTIONS,
  debugLog: DebugLog
): Promise<void> {
  return new Promise((resolve) => {
    // send initial message to server to join game
    const socket = createConnection(connectionOptions);
    socket.on('connect', () => {
      // use server response to build connection
      const connection = new TCPConnection(socket);
      // use connection to create refereeProxy and hand off player instance
      refereeProxy(player, connection, debugLog);
      resolve();
    });
    socket.on('error', () => {
      setTimeout(
        () => resolve(joinGame(player, connectionOptions, debugLog)),
        1000
      );
    });
  });
}

// /**
//  * Continues to attempt to join a game hosted at the specified host and port.
//  * @param player The player to join the game.
//  * @param connectionOptions The host and port to connect to.
//  * @param shouldLog Whether to log the game state to the console.
//  */
// export function retryJoiningGame(
//   player: Player<ShapeColorTile>,
//   connectionOptions = DEFAULT_CONNECTION_OPTIONS,
//   shouldLog: boolean
// ) {
//   try {
//     joinGame(player, connectionOptions, shouldLog);
//   } catch (e) {
//     console.error(e);
//     setTimeout(
//       () => retryJoiningGame(player, connectionOptions, shouldLog),
//       1000
//     );
//   }
// }

import { createConnection } from 'net';
import { TCPConnection } from '../connection';
import { Player } from '../../player/player';
import { BaseTile } from '../../game/map/tile';
import { refereeProxy } from './referee';
import { DEFAULT_CONNECTION_OPTIONS } from '../../constants';

/**
 * Joins a game hosted at the specified host and port.
 * Called once per player connecting to game.
 * @param player The player to join the game.
 * @param connectionOptions The host and port to connect to.
 */
function joinGame(
  player: Player<BaseTile>,
  connectionOptions = DEFAULT_CONNECTION_OPTIONS
) {
  // send initial message to server to join game
  const socket = createConnection(connectionOptions);
  // use server response to build connection
  const connection = new TCPConnection(socket);
  // use connection to create refereeProxy and hand off player instance
  refereeProxy(player, connection);
}

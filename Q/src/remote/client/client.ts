import { createConnection } from 'net';
import { TCPConnection } from '../connection';
import { Player } from '../../player/player';
import { BaseTile } from '../../game/map/tile';
import { refereeProxy } from './referee';

const DEFAULT_CONNECION_OPTIONS = { host: 'localhost', port: 8080 };

// called once per player connection to game
function joinGame(player: Player<BaseTile>) {
  // send initial message to server to join game
  const socket = createConnection(DEFAULT_CONNECION_OPTIONS);
  // use server response to build connection
  const connection = new TCPConnection(socket);
  // use connection to create refereeProxy and hand off player instance
  refereeProxy(player, connection);
}

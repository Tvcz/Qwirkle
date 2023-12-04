import { createConnection } from 'net';
import { TCPConnection } from '../connection';
import { Player } from '../../player/player';
import { ShapeColorTile } from '../../game/map/tile';
import { refereeProxy } from './refereeProxy';
import { DEFAULT_CONNECTION_OPTIONS } from '../../constants';
import { ClientConfig } from '../../json/config/clientConfig';
import { toQPlayers } from '../../json/deserialize/qActor';
import { BaseRuleBook } from '../../game/rules/ruleBook';
import { toMs } from '../../utils';

export function runClient(config: ClientConfig) {
  const players = toQPlayers(config.players, new BaseRuleBook());
  const connectionOptions = {
    host: config.host,
    port: config.port
  };
  players.forEach((player, index) => {
    setTimeout(
      () => {
        !config.quiet ??
          console.log(`joining game as player ${config.players[index][0]}`);
        joinGame(player, connectionOptions, !config.quiet);
      },
      toMs(config.wait * index)
    );
  });
}

/**
 * Joins a game hosted at the specified host and port.
 * Called once per player connecting to game.
 * @param player The player to join the game.
 * @param connectionOptions The host and port to connect to.
 */
export function joinGame(
  player: Player<ShapeColorTile>,
  connectionOptions = DEFAULT_CONNECTION_OPTIONS,
  shouldLog: boolean
) {
  // send initial message to server to join game
  const socket = createConnection(connectionOptions);
  socket.on('connect', () => {
    // use server response to build connection
    const connection = new TCPConnection(socket);
    // use connection to create refereeProxy and hand off player instance
    refereeProxy(player, connection, shouldLog);
  });
}

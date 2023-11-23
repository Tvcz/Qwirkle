import net from 'net';
import { Connection, TCPConnection } from '../connection';
import { TCPPlayer } from './tcpPlayer';
import { Player } from '../../player/player';
import { BaseTile } from '../../game/map/tile';
import { BaseReferee } from '../../referee/referee';
import { BaseRuleBook } from '../../game/rules/ruleBook';
import {
  DEFAULT_CONNECTION_OPTIONS,
  SERVER_MAX_PLAYERS,
  SERVER_MIN_PLAYERS,
  SERVER_PLAYER_NAME_TIMEOUT_MS,
  SERVER_WAIT_FOR_SIGNUPS_MS,
  SERVER_WAIT_PERIOD_RETRY_COUNT
} from '../../constants';
import { GameResult } from '../../referee/referee.types';

/**
 * Runs a game over TCP.
 *
 * The steps are as follows:
 *  1) Create a TCP server and wait for players to connect
 *  2) On connect, create a `TCPConnection` using the `Socket` and create a
 *     `TCPPlayer` using the new `TCPConnection`
 *  3) On the first connection, wait for additional players to connect
 *    3.1) While there are less than the maximum number of players, keep waiting.
 *    3.2) If the wait time has exceeded the maximum wait time, check if there
 *         are enough players to run the game.
 *     3.2.1) If there are enough players to run the game, jump to step (4).
 *       3.2.2) If there are not enough players to run the game, check if the wait
 *             period has already been restarted the maximum number of times.
 *        3.2.2.1) If no, start an additional wait period, jumping back to step (3.1).
 *        3.2.2.2) If yes, jump to step (4).
 *  4) If there are enough players to run the game, start the game, passing the
 *     referee the `TCPPlayer`s to run the game with. Otherwise, do not run the game
 *     and return an empty result
 *
 * @returns the result of the game
 */
export async function runTCPGame() {
  const players: Player<BaseTile>[] = [];
  const connections: Connection[] = [];
  const server = net.createServer();
  server.listen(DEFAULT_CONNECTION_OPTIONS.port);

  server.on('connection', (socket) => {
    const newConnection = new TCPConnection(socket);
    connections.push(newConnection);
    signUp(new TCPPlayer(newConnection), players);
  });

  const enoughPlayersToRun = await new Promise<boolean>((resolve) => {
    server.once('connection', () => {
      resolve(waitForAdditionalPlayers(players));
    });
  });

  let gameResult: GameResult = [[], []];
  if (enoughPlayersToRun) {
    gameResult = await startGame(players);
  }
  terminateConnections(connections);
  server.close();
  return gameResult;
}

/**
 * Attempts to wait for additional players to connect to the game.
 *
 * This is a synchronous operation which relies on the callbacks triggering when
 * a client connects mutating the players array while this function is running.
 *
 * @param players the player list which new players are added to as they connect.
 * @param retryCount
 * @returns true if the game should be run, false otherwise
 */
function waitForAdditionalPlayers(
  players: Player<BaseTile>[],
  retryCount = 0
): boolean {
  const start = Date.now();
  while (players.length < SERVER_MAX_PLAYERS) {
    if (Date.now() >= start + SERVER_WAIT_FOR_SIGNUPS_MS) {
      if (players.length >= SERVER_MIN_PLAYERS) {
        return true;
      } else if (retryCount < SERVER_WAIT_PERIOD_RETRY_COUNT) {
        waitForAdditionalPlayers(players, retryCount + 1);
      } else {
        return false;
      }
    }
  }
  return true;
}

/**
 * Terminates all connections.
 *
 * @param connections the client connections to terminate.
 */
function terminateConnections(connections: Connection[]) {
  connections.forEach((connection) => connection.close());
}

/**
 * Runs a game with the given players.
 * @param players the players to run the game with
 * @returns the result of the game
 */
async function startGame(players: Player<BaseTile>[]): Promise<GameResult> {
  return await BaseReferee(players, [], new BaseRuleBook());
}

/**
 * Attempts to sign up a player. If the player responds in time, they are added
 * to the list of players.
 * @param player the player to sign up
 * @param players the list of players to add the player to if they respond in
 * time
 */
async function signUp(
  player: Player<BaseTile>,
  players: Player<BaseTile>[]
): Promise<void> {
  await Promise.race([
    player.name().then((_name) => players.push(player)),
    new Promise((_, reject) => {
      setTimeout(reject, SERVER_PLAYER_NAME_TIMEOUT_MS);
    })
  ]);
}

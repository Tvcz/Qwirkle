import * as net from 'net';
import { TCPConnection } from '../connection';
import { TCPPlayer } from './playerProxy';
import { Player } from '../../player/player';
import { BaseReferee } from '../../referee/referee';
import { ConfiguredRulebook } from '../../game/rules/ruleBook';
import {
  SERVER_MAX_PLAYERS,
  SERVER_MIN_PLAYERS,
  SERVER_WAIT_CHECK_INTERVAL_MS
} from '../../constants';
import { GameResult } from '../../referee/referee.types';
import {
  DEFAULT_SERVER_CONFIG,
  ServerConfig
} from '../../json/config/serverConfig';
import { BaseObserver, Observer } from '../../observer/observer';
import { toQGameState } from '../../json/deserialize/qState';
import { RefereeConfig } from '../../json/config/refereeConfig';
import { toMs } from '../../utils';
import { DebugLog } from '../debugLog';

let debug: DebugLog | undefined;

/**
 * Plays a game over TCP, where the server runs the referee and clients connect
 * to run players.
 *
 * Details of this process can be found in the README.
 *
 * @param config the server config
 * @returns the result of the game
 */
export async function runTCPGame(config = DEFAULT_SERVER_CONFIG) {
  debug = new DebugLog(!config.quiet);
  debug.log('running TCP game in func');
  const players: TCPPlayer[] = [];

  const server = net.createServer();

  const enoughPlayersToRun = new Promise<boolean>((resolve) => {
    server.once('connection', () => {
      waitForAdditionalPlayers(players, config).then(resolve);
    });
  });

  server.on('connection', (socket) =>
    handleConnection(socket, players, config)
  );

  debug.log('starting server');
  server.listen(config.port);
  debug.log(`server started listening on port ${config.port}`);

  const gameResult = await runGameIfPossible(
    await enoughPlayersToRun,
    players,
    config
  );

  terminateConnections(players);
  server.close();
  return gameResult;
}

/**
 * Handles a new connection, adding the new connection to the list of connections and signing up the player.
 *
 * @param socket the socket to create a connection from
 * @param connections the list of connections to add the new connection to
 * @param players the list of players to add the new player to
 * @param config the server config
 */
function handleConnection(
  socket: net.Socket,
  players: TCPPlayer[],
  config: ServerConfig
) {
  debug?.log('received connection on the server');

  const maxResponseWait = Math.max(
    config['wait-for-signup'],
    config['ref-spec']['per-turn']
  );
  const newConnection = new TCPConnection(socket);
  signUp(new TCPPlayer(newConnection, maxResponseWait), players, config);
}

/**
 * Attempts to wait for additional players to connect to the game.
 *
 * This is a asynchronous operation which relies on the the signUp method to
 * concurrently mutate the players list.
 *
 * @param players the player list which new players are added to as they connect.
 * @param config the server config
 * @param attempt the number of times the wait period has been tried
 * @returns true if the game should be run, false otherwise
 */
async function waitForAdditionalPlayers(
  players: Player[],
  config: ServerConfig,
  attempt = 1
): Promise<boolean> {
  debug?.log('waiting for additional players');
  const serverWaitMs = toMs(config['server-wait']);

  return new Promise<boolean>((resolve) => {
    const start = Date.now();

    // Check if there are the max number of players or if the wait period has ended
    const checkForAdditionalPlayers = () => {
      if (players.length >= SERVER_MAX_PLAYERS) {
        clearInterval(intervalId);
        resolve(true);
      } else if (Date.now() >= start + serverWaitMs) {
        clearInterval(intervalId);
        handleWaitPeriodEnd(players, config, attempt).then(resolve);
      }
    };

    const intervalId = setInterval(
      checkForAdditionalPlayers,
      SERVER_WAIT_CHECK_INTERVAL_MS
    );
  });
}

/**
 * Handles the server's behavior when the time has ran our for a wait period
 * without the maximum number of players joining.
 * @param players the player list which new players are added to as they connect.
 * @param config the server config
 * @param attempt the number of times the wait period has been tried
 * @returns
 */
async function handleWaitPeriodEnd(
  players: Player[],
  config: ServerConfig,
  attempt: number
): Promise<boolean> {
  if (players.length >= SERVER_MIN_PLAYERS) {
    return true;
  } else if (attempt < config['server-tries']) {
    debug?.log(
      `not enough players, restarting wait period ${attempt}, will retry ${config['server-tries']} times`
    );
    return await waitForAdditionalPlayers(players, config, attempt + 1);
  } else {
    return false;
  }
}

/**
 * Runs a game if there are enough players to run the game. Otherwise, informs all players that the game will not be run.
 *
 * @param enoughPlayersToRun wether or not there are enough players to run the game.
 * @param players the players to run the game with
 * @param config the server config
 * @returns the result of the game
 */
async function runGameIfPossible(
  enoughPlayersToRun: boolean,
  players: TCPPlayer[],
  config: ServerConfig
): Promise<GameResult> {
  if (enoughPlayersToRun) {
    const cappedPlayers = players.slice(0, 4); // It is possible for multiple players to sign up during a single checkForAdditionalPlayers interval. Since this could make it so that more than 4 playesr sign up, we cap the players at 4.
    const playerNames = await Promise.all(cappedPlayers.map((p) => p.name()));
    debug?.log(`running game with players ${playerNames.join(', ')}`);
    const gameResults = await startGame(cappedPlayers, config['ref-spec']);
    return gameResults;
  }
  informPlayersOfNoGame(players);
  return [[], []];
}

/**
 * Attempts to inform all players that the game will not be run.
 * @param players the players to inform
 */
function informPlayersOfNoGame(players: Player[]) {
  players.forEach((player) => {
    try {
      player.win(false);
    } catch (e) {
      // ignore
    }
  });
}

/**
 * Terminates all connections.
 *
 * @param connections the client connections to terminate.
 */
function terminateConnections(players: TCPPlayer[]) {
  players.forEach((player) => {
    player.killConnection();
  });
}

/**
 * Runs a game with the given players.
 * @param players the players to run the game with
 * @returns the result of the game
 */
async function startGame(
  players: Player[],
  refereeConfig: RefereeConfig
): Promise<GameResult> {
  const gameState = await toQGameState(refereeConfig.state0, players);
  const observers: Observer[] = [];
  if (refereeConfig.observe) {
    observers.push(new BaseObserver());
  }
  const turnTimeMS = toMs(refereeConfig['per-turn']);
  return await BaseReferee(
    players,
    observers,
    new ConfiguredRulebook(
      refereeConfig['config-s'].fbo,
      refereeConfig['config-s'].qbo
    ),
    gameState,
    turnTimeMS
  );
}

/**
 * Attempts to sign up a player. If the player responds in time, they are added
 * to the list of players.
 * @param player the player to sign up
 * @param players the list of players to add the player to if they respond in
 * time
 */
async function signUp(
  player: TCPPlayer,
  players: TCPPlayer[],
  config: ServerConfig
): Promise<void> {
  const waitForSignupMs = toMs(config['wait-for-signup']);
  debug?.log(`waiting for signup for ${waitForSignupMs}ms`);
  const name = Promise.race([
    createWaitForNamePromise(player),
    createPlayerExceededNameTimeoutPromise(waitForSignupMs)
  ]);
  name.catch(() => {
    player.killConnection();
    debug?.log('signup timed out');
  });
  name.then((name) => {
    if (name) {
      players.push(player);
    }
  });
  await name;
}

/**
 * Create a promise that resolves when the player sends their name.
 * @param player the player to get the name from
 */
async function createWaitForNamePromise(player: TCPPlayer) {
  const name = await player.name();
  debug?.log(`received signup from ${name}`);
  return name;
}

function createPlayerExceededNameTimeoutPromise(waitForSignupMs: number) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject();
    }, waitForSignupMs);
  });
}

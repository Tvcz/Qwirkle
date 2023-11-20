import net from 'net';
import { TCPConnection } from '../connection';
import { TCPPlayer } from './player';
import { Player } from '../../player/player';
import { BaseTile } from '../../game/map/tile';
import { BaseReferee } from '../../referee/referee';
import { BaseRuleBook } from '../../game/rules/ruleBook';

const WAIT_FOR_SIGNUPS_MS: number = 20000;
const NAME_TIMEOUT_MS: number = 3000;
const MIN_PLAYERS: number = 2;
const MAX_PLAYERS: number = 4;

const MAX_RETRY_COUNT = 1;

export async function runTCPGame() {
  const players: Player<BaseTile>[] = [];
  const server = net.createServer();

  server.on('connection', (socket) => {
    const newConnection = new TCPConnection(socket);
    signUp(new TCPPlayer(newConnection, NAME_TIMEOUT_MS), players);
  });

  const enoughPlayersToRun = await new Promise<boolean>((resolve) => {
    server.once('connection', () => {
      resolve(waitForAdditionalPlayers(players));
    });
  });

  if (enoughPlayersToRun) {
    return startGame(players);
  } else {
    sendPlayersEmptyResults(players);
    return [[], []];
  }
}

/**
 * Attempts to await for additional players
 * @param players
 * @param retryCount
 * @returns true if the game should be run, false otherwise
 */
function waitForAdditionalPlayers(
  players: Player<BaseTile>[],
  retryCount = 0
): boolean {
  const start = Date.now();
  while (players.length < MAX_PLAYERS) {
    if (Date.now() >= start + WAIT_FOR_SIGNUPS_MS) {
      if (players.length >= MIN_PLAYERS) {
        return true;
      } else if (retryCount < MAX_RETRY_COUNT) {
        waitForAdditionalPlayers(players, retryCount + 1);
      } else {
        return false;
      }
    }
  }
  return true;
}

function sendPlayersEmptyResults(players: Player<BaseTile>[]) {
  players.forEach((player) => {
    player.win(false);
  });
}

function startGame(players: Player<BaseTile>[]) {
  return BaseReferee(players, [], new BaseRuleBook());
}

/**
 * Attempts to sign up a player. If the player responds in time, they are added
 * to the list of players.
 * @param player the player to sign up
 * @param players the list of players to add the player to if they respond in
 * time
 */
function signUp(player: Player<BaseTile>, players: Player<BaseTile>[]): void {
  try {
    player.name();
    players.push(player);
  } catch (e) {
    return;
  }
}

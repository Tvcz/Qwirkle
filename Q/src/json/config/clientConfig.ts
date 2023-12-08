import {
  DEFAULT_CONNECTION_OPTIONS,
  REFEREE_PLAYER_TIMEOUT_MS
} from '../../constants';
import { JActorsB } from '../data/data.types';

const DEFAULT_PORT = DEFAULT_CONNECTION_OPTIONS.port;
const DEFAULT_HOST = DEFAULT_CONNECTION_OPTIONS.host;
const DEFAULT_WAIT = REFEREE_PLAYER_TIMEOUT_MS / 1000;
const DEFAULT_QUIET = false;
const DEFAULT_PLAYERS: JActorsB = [
  ['playerOne', 'dag'],
  ['playerTwo', 'dag']
];

export const defaultClientConfig: ClientConfig = {
  port: DEFAULT_PORT,
  host: DEFAULT_HOST,
  wait: DEFAULT_WAIT,
  quiet: DEFAULT_QUIET,
  players: DEFAULT_PLAYERS
};

/**
 * The configuration for a client.
 * @property port the port to connect to
 * @property host the host to connect to
 * @property wait the time to wait between connecting players
 * @property quiet whether to log to the console
 * @property players the players to connect to the game
 */
export type ClientConfig = {
  port: number;
  host: string;
  wait: number;
  quiet: boolean;
  players: JActorsB;
};

export function generateClientConfig(
  port = DEFAULT_PORT,
  host = DEFAULT_HOST,
  wait = DEFAULT_WAIT,
  quiet = DEFAULT_QUIET,
  players = DEFAULT_PLAYERS
): ClientConfig {
  return {
    port,
    host,
    wait,
    quiet,
    players
  };
}

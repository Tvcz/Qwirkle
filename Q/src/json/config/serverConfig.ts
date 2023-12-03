import {
  DEFAULT_CONNECTION_OPTIONS,
  SERVER_PLAYER_NAME_TIMEOUT_MS,
  SERVER_WAIT_FOR_SIGNUPS_MS,
  SERVER_WAIT_PERIOD_RETRY_COUNT
} from '../../constants';
import { RefereeConfig, DEFAULT_REFEREE_CONFIG } from './refereeConfig';

const PORT = DEFAULT_CONNECTION_OPTIONS.port;
const SERVER_TRIES = SERVER_WAIT_PERIOD_RETRY_COUNT;
const SERVER_WAIT = SERVER_WAIT_FOR_SIGNUPS_MS / 1000;
const WAIT_FOR_SIGNUP = SERVER_PLAYER_NAME_TIMEOUT_MS / 1000;
const QUIET = false;

export const DEFAULT_SERVER_CONFIG: ServerConfig = {
  port: PORT,
  'server-tries': SERVER_TRIES,
  'server-wait': SERVER_WAIT,
  'wait-for-signup': WAIT_FOR_SIGNUP,
  quiet: QUIET,
  'ref-spec': DEFAULT_REFEREE_CONFIG
};

export type ServerConfig = {
  port: number;
  'server-tries': number;
  'server-wait': number;
  'wait-for-signup': number;
  quiet: boolean;
  'ref-spec': RefereeConfig;
};

export function generateServerConfig(
  port = PORT,
  serverTries = SERVER_TRIES,
  serverWait = SERVER_WAIT,
  waitForSignup = WAIT_FOR_SIGNUP,
  quiet = QUIET,
  refSpec = DEFAULT_REFEREE_CONFIG
): object {
  return {
    port,
    'server-tries': serverTries,
    'server-wait': serverWait,
    'wait-for-signup': waitForSignup,
    quiet,
    'ref-spec': refSpec
  };
}

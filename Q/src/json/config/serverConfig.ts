import { RefereeConfig, DEFAULT_REFEREE_CONFIG } from './refereeConfig';

const PORT = 8080;
const SERVER_TRIES = 2;
const SERVER_WAIT = 20;
const WAIT_FOR_SIGNUP = 5;
const QUIET = false;

export const DEFAULT_SERVER_CONFIG: ServerConfig = {
  port: PORT,
  serverTries: SERVER_TRIES,
  serverWait: SERVER_WAIT,
  waitForSignup: WAIT_FOR_SIGNUP,
  quiet: QUIET,
  refSpec: DEFAULT_REFEREE_CONFIG
};

export type ServerConfig = {
  port: number;
  serverTries: number;
  serverWait: number;
  waitForSignup: number;
  quiet: boolean;
  refSpec: RefereeConfig;
};

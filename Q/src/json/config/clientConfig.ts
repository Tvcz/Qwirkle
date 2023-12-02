import { JActorsB } from '../data/data.types';

const DEFAULT_PORT = 8080;
const DEFAULT_HOST = 'localhost';
const DEFAULT_WAIT = 5;
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

export type ClientConfig = {
  port: number;
  host: string;
  wait: number;
  quiet: boolean;
  players: JActorsB;
};

import { isJActorsB, isJState } from '../data/dataTypeGuards';
import { ClientConfig } from './clientConfig';
import { RefereeConfig, RefereeStateConfig } from './refereeConfig';
import { ServerConfig } from './serverConfig';

export function isClientConfig(obj: unknown): obj is ClientConfig {
  // break this down into smaller functions
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  const containsPort = hasPort(obj);
  const containsHost = hasHost(obj);
  const containsWait = hasWait(obj);
  const containsQuiet = 'quiet' in obj && typeof obj.quiet === 'boolean';
  const containsPlayers = 'players' in obj && isJActorsB(obj.players);
  const containsFiveKeys = Object.keys(obj).length === 5;
  return (
    containsPort &&
    containsHost &&
    containsWait &&
    containsQuiet &&
    containsPlayers &&
    containsFiveKeys
  );
}

function hasPort(obj: object): obj is { port: number } {
  return (
    'port' in obj &&
    typeof obj.port === 'number' &&
    obj.port >= 10000 &&
    obj.port <= 60000
  );
}

function hasHost(obj: object): obj is { host: string } {
  return (
    'host' in obj &&
    typeof obj.host === 'string' &&
    isIpAddrOrDomainName(obj.host)
  );
}

function hasWait(obj: object): obj is { wait: number } {
  return (
    'wait' in obj &&
    typeof obj.wait === 'number' &&
    obj.wait >= 0 &&
    obj.wait <= 9
  );
}

function isIpAddrOrDomainName(str: string): boolean {
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  const isIpAddress = ipv4Pattern.test(str);

  const domainRegex = /^(?!-)([a-zA-Z0-9-]{1,63}(?<!-)\.)+[a-zA-Z]{2,6}$/;
  const isDomainName = domainRegex.test(str);
  return isIpAddress || isDomainName;
}

export function isRefereeConfig(obj: unknown): obj is RefereeConfig {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  const containsState0 = 'state0' in obj && isJState(obj.state0);
  const containsQuiet = 'quiet' in obj && typeof obj.quiet === 'boolean';
  const containsConfigS =
    'config-s' in obj && isRefereeStateConfig(obj['config-s']);
  const containsPerTurn = hasPerTurn(obj);
  const containsObserve = 'observe' in obj && typeof obj.observe === 'boolean';
  const containsFiveKeys = Object.keys(obj).length === 5;
  return (
    containsState0 &&
    containsQuiet &&
    containsConfigS &&
    containsPerTurn &&
    containsObserve &&
    containsFiveKeys
  );
}

function hasPerTurn(obj: object): obj is { 'per-turn': number } {
  return (
    'per-turn' in obj &&
    typeof obj['per-turn'] === 'number' &&
    obj['per-turn'] >= 0 &&
    obj['per-turn'] <= 6
  );
}

export function isRefereeStateConfig(obj: unknown): obj is RefereeStateConfig {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  const containsQbo = hasQbo(obj);
  const containsFbo = hasFbo(obj);
  const containsTwoKeys = Object.keys(obj).length === 2;
  return containsQbo && containsFbo && containsTwoKeys;
}

function hasQbo(obj: object): obj is { qbo: number } {
  return (
    'qbo' in obj && typeof obj.qbo === 'number' && obj.qbo >= 0 && obj.qbo <= 10
  );
}

function hasFbo(obj: object): obj is { fbo: number } {
  return (
    'fbo' in obj && typeof obj.fbo === 'number' && obj.fbo >= 0 && obj.fbo <= 10
  );
}

export function isServerConfig(obj: unknown): obj is ServerConfig {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  const containsPort = hasPort(obj);
  const containsServerTries = hasServerTries(obj);
  const containsServerWait = hasServerWait(obj);
  const containsWaitForSignup = hasWaitForSignup(obj);
  const containsQuiet = 'quiet' in obj && typeof obj.quiet === 'boolean';
  const containsRefSpec = 'ref-spec' in obj && isRefereeConfig(obj['ref-spec']);
  const containsSixKeys = Object.keys(obj).length === 6;
  console.log(
    containsPort,
    containsServerTries,
    containsServerWait,
    containsWaitForSignup,
    containsQuiet,
    containsRefSpec,
    containsSixKeys
  );
  return (
    containsPort &&
    containsServerTries &&
    containsServerWait &&
    containsWaitForSignup &&
    containsQuiet &&
    containsRefSpec &&
    containsSixKeys
  );
}

function hasServerTries(obj: object): obj is { 'server-tries': number } {
  return (
    'server-tries' in obj &&
    typeof obj['server-tries'] === 'number' &&
    obj['server-tries'] >= 0 &&
    obj['server-tries'] <= 9
  );
}

function hasServerWait(obj: object): obj is { 'server-wait': number } {
  return (
    'server-wait' in obj &&
    typeof obj['server-wait'] === 'number' &&
    obj['server-wait'] >= 0 &&
    obj['server-wait'] <= 29
  );
}

function hasWaitForSignup(obj: object): obj is { 'wait-for-signup': number } {
  return (
    'wait-for-signup' in obj &&
    typeof obj['wait-for-signup'] === 'number' &&
    obj['wait-for-signup'] >= 0 &&
    obj['wait-for-signup'] <= 9
  );
}

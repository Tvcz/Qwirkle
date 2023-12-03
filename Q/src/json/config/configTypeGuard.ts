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
  const containsConfigS = 'configS' in obj && isRefereeStateConfig(obj.configS);
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

function hasPerTurn(obj: object): obj is { perTurn: number } {
  return (
    'perTurn' in obj &&
    typeof obj.perTurn === 'number' &&
    obj.perTurn >= 0 &&
    obj.perTurn <= 6
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
  const containsRefSpec = 'refSpec' in obj && isRefereeConfig(obj.refSpec);
  const containsSixKeys = Object.keys(obj).length === 6;
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

function hasServerTries(obj: object): obj is { serverTries: number } {
  return (
    'serverTries' in obj &&
    typeof obj.serverTries === 'number' &&
    obj.serverTries >= 0 &&
    obj.serverTries <= 9
  );
}

function hasServerWait(obj: object): obj is { serverWait: number } {
  return (
    'serverWait' in obj &&
    typeof obj.serverWait === 'number' &&
    obj.serverWait >= 0 &&
    obj.serverWait <= 29
  );
}

function hasWaitForSignup(obj: object): obj is { waitForSignup: number } {
  return (
    'waitForSignup' in obj &&
    typeof obj.waitForSignup === 'number' &&
    obj.waitForSignup >= 0 &&
    obj.waitForSignup <= 9
  );
}

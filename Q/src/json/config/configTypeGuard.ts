import { is } from '@electron-toolkit/utils';
import { isJActorsB } from '../data/dataTypeGuards';
import { ClientConfig } from './clientConfig';
import { RefereeConfig, RefereeStateConfig } from './refereeConfig';
import { ServerConfig } from './serverConfig';

export function isClientConfig(obj: unknown): obj is ClientConfig {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'port' in obj &&
    typeof obj.port === 'number' &&
    obj.port >= 10000 &&
    obj.port <= 60000 &&
    'host' in obj &&
    typeof obj.host === 'string' &&
    isIpAddrOrDomainName(obj.host) &&
    'wait' in obj &&
    typeof obj.wait === 'number' &&
    obj.wait >= 0 &&
    obj.wait <= 9 &&
    'quiet' in obj &&
    typeof obj.quiet === 'boolean' &&
    'players' in obj &&
    Array.isArray(obj.players) &&
    isJActorsB(obj.players)
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
  return false;
}

export function isRefereeStateConfig(obj: unknown): obj is RefereeStateConfig {
  return false;
}

export function isServerConfig(obj: unknown): obj is ServerConfig {
  return false;
}

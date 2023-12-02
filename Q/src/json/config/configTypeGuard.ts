import { ClientConfig } from './clientConfig';
import { RefereeConfig, RefereeStateConfig } from './refereeConfig';
import { ServerConfig } from './serverConfig';

export function isClientConfig(obj: unknown): obj is ClientConfig {
  return false;
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

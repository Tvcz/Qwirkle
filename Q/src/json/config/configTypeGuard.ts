export function isClientConfig(obj: unknown): obj is ClientConfig {
  return false;
}

export function isRefereeConfig(obj: unknown): obj is RefereeConfig {
  return false;
}

export function isServerConfig(obj: unknown): obj is ServerConfig {
  return false;
}

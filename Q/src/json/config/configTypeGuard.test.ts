import { JActorsB } from '../data/data.types';
import { generateClientConfig } from './clientConfig';
import { isClientConfig } from './configTypeGuard';

describe('tests for the config definitions type guards', () => {
  const localhost = '127.0.0.1';

  let twoPlayers: JActorsB;
  let threePlayers: JActorsB;
  let fourPlayers: JActorsB;

  beforeAll(() => {
    twoPlayers = [
      ['simpleJActor1', 'dag'],
      ['simpleJActor2', 'ldasg']
    ];

    // Valid JActorsB object - 3 actors
    threePlayers = [
      ['simpleJActor1', 'dag'],
      ['simpleJActor2', 'ldasg'],
      ['simpleJActor3', 'dag']
    ];
    fourPlayers = [
      ['simpleJActor', 'dag'],
      ['exceptionJactor', 'ldasg', 'new-tiles'],
      ['cheatJactor', 'dag', 'a cheat', 'tile-not-owned'],
      ['loopJactor', 'ldasg', 'win', 2]
    ];
  });

  test('isClientConfig', () => {
    const goodPortLowerLimitConfig = generateClientConfig(
      10000,
      localhost,
      5,
      false,
      threePlayers
    );
    expect(isClientConfig(goodPortLowerLimitConfig)).toBe(true);

    const goodPortUpperLimitConfig = generateClientConfig(
      60000,
      localhost,
      5,
      false,
      fourPlayers
    );
    expect(isClientConfig(goodPortUpperLimitConfig)).toBe(true);

    const goodHostIpConfig = generateClientConfig(
      18080,
      localhost,
      5,
      false,
      twoPlayers
    );
    expect(isClientConfig(goodHostIpConfig)).toBe(true);

    const goodHostDomainConfig = generateClientConfig(
      18080,
      'google.com',
      5,
      false,
      twoPlayers
    );
    expect(isClientConfig(goodHostDomainConfig)).toBe(true);

    const goodHostDomainConfig2 = generateClientConfig(
      18080,
      'google.com.ar',
      5,
      false,
      twoPlayers
    );
    expect(isClientConfig(goodHostDomainConfig2)).toBe(true);

    const goodLowerLimitWaitConfig = generateClientConfig(
      18080,
      localhost,
      0,
      false,
      fourPlayers
    );
    expect(isClientConfig(goodLowerLimitWaitConfig)).toBe(true);

    const goodUpperLimitWaitConfig = generateClientConfig(
      18080,
      localhost,
      9,
      false,
      fourPlayers
    );
    expect(isClientConfig(goodUpperLimitWaitConfig)).toBe(true);

    const goodQuietConfig = generateClientConfig(
      18080,
      localhost,
      9,
      true,
      fourPlayers
    );
    expect(isClientConfig(goodQuietConfig)).toBe(true);

    const badUpperLimitPortConfig = generateClientConfig(
      60001,
      localhost,
      5,
      false,
      fourPlayers
    );
    expect(isClientConfig(badUpperLimitPortConfig)).toBe(false);

    const badLowerLimitPortConfig = generateClientConfig(
      9999,
      localhost,
      5,
      false,
      fourPlayers
    );
    expect(isClientConfig(badLowerLimitPortConfig)).toBe(false);

    const badHostIpConfig = generateClientConfig(
      18080,
      '127.0.1',
      5,
      false,
      fourPlayers
    );
    expect(isClientConfig(badHostIpConfig)).toBe(false);

    const badHostIpConfig2 = generateClientConfig(
      18080,
      'localhost',
      5,
      false,
      fourPlayers
    );
    expect(isClientConfig(badHostIpConfig2)).toBe(false);

    const badHostIpConfig3 = generateClientConfig(
      18080,
      'https://google.com',
      5,
      false,
      fourPlayers
    );
    expect(isClientConfig(badHostIpConfig3)).toBe(false);

    const badUpperLimitWaitConfig = generateClientConfig(
      18080,
      localhost,
      10,
      false,
      fourPlayers
    );
    expect(isClientConfig(badUpperLimitWaitConfig)).toBe(false);

    const badLowerLimitWaitConfig = generateClientConfig(
      18080,
      localhost,
      -1,
      false,
      fourPlayers
    );
    expect(isClientConfig(badLowerLimitWaitConfig)).toBe(false);

    const badWrongQuietTypeConfig = generateUnknownClientConfig(
      18080,
      localhost,
      5,
      'false',
      fourPlayers
    );
    expect(isClientConfig(badWrongQuietTypeConfig)).toBe(false);

    const badWrongPortTypeConfig = generateUnknownClientConfig(
      '18080',
      localhost,
      5,
      false,
      fourPlayers
    );
    expect(isClientConfig(badWrongPortTypeConfig)).toBe(false);

    const badWrongWaitTypeConfig = generateUnknownClientConfig(
      18080,
      localhost,
      '5',
      false,
      fourPlayers
    );
    expect(isClientConfig(badWrongWaitTypeConfig)).toBe(false);

    const badWrongPlayersTypeConfig = generateUnknownClientConfig(
      18080,
      localhost,
      5,
      false,
      'fourPlayers'
    );
    expect(isClientConfig(badWrongPlayersTypeConfig)).toBe(false);

    const badWrongHostTypeConfig = generateUnknownClientConfig(
      18080,
      127.0,
      5,
      false,
      fourPlayers
    );
    expect(isClientConfig(badWrongHostTypeConfig)).toBe(false);

    const badMissingPortConfig = generateUnknownClientConfig(
      undefined,
      localhost,
      5,
      false,
      fourPlayers
    );
    expect(isClientConfig(badMissingPortConfig)).toBe(false);

    const badMissingHostConfig = generateUnknownClientConfig(
      18080,
      undefined,
      5,
      false,
      fourPlayers
    );
    expect(isClientConfig(badMissingHostConfig)).toBe(false);

    const badMissingWaitConfig = generateUnknownClientConfig(
      18080,
      localhost,
      undefined,
      false,
      fourPlayers
    );
    expect(isClientConfig(badMissingWaitConfig)).toBe(false);

    const badMissingQuietConfig = generateUnknownClientConfig(
      18080,
      localhost,
      5,
      undefined,
      fourPlayers
    );
    expect(isClientConfig(badMissingQuietConfig)).toBe(false);

    const badMissingPlayersConfig = generateUnknownClientConfig(
      18080,
      localhost,
      5,
      false,
      undefined
    );
    expect(isClientConfig(badMissingPlayersConfig)).toBe(false);
  });

  test('isRefereeConfig', () => {});

  test('isServerConfig', () => {});
});

function generateUnknownClientConfig(
  port?: unknown,
  host?: unknown,
  wait?: unknown,
  quiet?: unknown,
  players?: unknown
): object {
  const config: object = {};
  if (port) {
    config['port'] = port;
  }
  if (host) {
    config['host'] = host;
  }
  if (wait) {
    config['wait'] = wait;
  }
  if (quiet) {
    config['quiet'] = quiet;
  }
  if (players) {
    config['players'] = players;
  }
  return config;
}

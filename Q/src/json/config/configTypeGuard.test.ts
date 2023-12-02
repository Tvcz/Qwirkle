import { JActorsB, JState } from '../data/data.types';
import { generateClientConfig } from './clientConfig';
import {
  isClientConfig,
  isRefereeConfig,
  isRefereeStateConfig,
  isServerConfig
} from './configTypeGuard';
import {
  DEFAULT_REFEREE_STATE_CONFIG,
  generateRefereeConfig,
  generateRefereeStateConfig
} from './refereeConfig';
import { generateServerConfig } from './serverConfig';

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
    const goodDefaultConfig = generateClientConfig();
    expect(isClientConfig(goodDefaultConfig)).toBe(true);

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
      true,
      fourPlayers
    );
    expect(isClientConfig(badUpperLimitPortConfig)).toBe(false);

    const badLowerLimitPortConfig = generateClientConfig(
      9999,
      localhost,
      5,
      true,
      fourPlayers
    );
    expect(isClientConfig(badLowerLimitPortConfig)).toBe(false);

    const badHostIpConfig = generateClientConfig(
      18080,
      '127.0.1',
      5,
      true,
      fourPlayers
    );
    expect(isClientConfig(badHostIpConfig)).toBe(false);

    const badHostIpConfig2 = generateClientConfig(
      18080,
      'localhost',
      5,
      true,
      fourPlayers
    );
    expect(isClientConfig(badHostIpConfig2)).toBe(false);

    const badHostIpConfig3 = generateClientConfig(
      18080,
      'https://google.com',
      5,
      true,
      fourPlayers
    );
    expect(isClientConfig(badHostIpConfig3)).toBe(false);

    const badUpperLimitWaitConfig = generateClientConfig(
      18080,
      localhost,
      10,
      true,
      fourPlayers
    );
    expect(isClientConfig(badUpperLimitWaitConfig)).toBe(false);

    const badLowerLimitWaitConfig = generateClientConfig(
      18080,
      localhost,
      -1,
      true,
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
      true,
      fourPlayers
    );
    expect(isClientConfig(badWrongPortTypeConfig)).toBe(false);

    const badWrongWaitTypeConfig = generateUnknownClientConfig(
      18080,
      localhost,
      '5',
      true,
      fourPlayers
    );
    expect(isClientConfig(badWrongWaitTypeConfig)).toBe(false);

    const badWrongPlayersTypeConfig = generateUnknownClientConfig(
      18080,
      localhost,
      5,
      true,
      'fourPlayers'
    );
    expect(isClientConfig(badWrongPlayersTypeConfig)).toBe(false);

    const badWrongHostTypeConfig = generateUnknownClientConfig(
      18080,
      127.0,
      5,
      true,
      fourPlayers
    );
    expect(isClientConfig(badWrongHostTypeConfig)).toBe(false);

    const badMissingPortConfig = generateUnknownClientConfig(
      undefined,
      localhost,
      5,
      true,
      fourPlayers
    );
    expect(isClientConfig(badMissingPortConfig)).toBe(false);

    const badMissingHostConfig = generateUnknownClientConfig(
      18080,
      undefined,
      5,
      true,
      fourPlayers
    );
    expect(isClientConfig(badMissingHostConfig)).toBe(false);

    const badMissingWaitConfig = generateUnknownClientConfig(
      18080,
      localhost,
      undefined,
      true,
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
      true,
      undefined
    );
    expect(isClientConfig(badMissingPlayersConfig)).toBe(false);

    const badExtraConfig = generateUnknownClientConfig(
      18080,
      localhost,
      5,
      true,
      fourPlayers,
      'extra'
    );
    expect(isClientConfig(badExtraConfig)).toBe(false);

    const badWrongExtraTypeConfig = generateUnknownClientConfig(
      18080,
      localhost,
      undefined,
      true,
      fourPlayers,
      5
    );
    expect(isClientConfig(badWrongExtraTypeConfig)).toBe(false);
  });

  test('isRefereeConfig', () => {
    const state0: JState = {
      map: [[0, [0, { color: 'red', shape: 'circle' }]]],
      'tile*': [],
      players: [
        {
          name: 'Player 1',
          'tile*': [],
          score: 0
        },
        {
          name: 'Player 2',
          'tile*': [],
          score: 0
        }
      ]
    };
    const stateConfig = DEFAULT_REFEREE_STATE_CONFIG;

    const goodDefaultConfig = generateRefereeConfig();
    expect(isRefereeConfig(goodDefaultConfig)).toBe(true);

    const goodQuietConfig = generateRefereeConfig(undefined, true);
    expect(isRefereeConfig(goodQuietConfig)).toBe(true);

    const goodPerTurnLowerLimitConfig = generateRefereeConfig(
      undefined,
      true,
      undefined,
      0
    );
    expect(isRefereeConfig(goodPerTurnLowerLimitConfig)).toBe(true);

    const goodPerTurnUpperLimitConfig = generateRefereeConfig(
      undefined,
      false,
      undefined,
      6
    );
    expect(isRefereeConfig(goodPerTurnUpperLimitConfig)).toBe(true);

    const goodObserveConfig = generateRefereeConfig(
      undefined,
      false,
      undefined,
      undefined,
      true
    );
    expect(isRefereeConfig(goodObserveConfig)).toBe(true);

    const badPerTurnLowerLimitConfig = generateRefereeConfig(
      undefined,
      true,
      undefined,
      -1
    );
    expect(isRefereeConfig(badPerTurnLowerLimitConfig)).toBe(false);

    const badPerTurnUpperLimitConfig = generateRefereeConfig(
      undefined,
      true,
      undefined,
      7
    );
    expect(isRefereeConfig(badPerTurnUpperLimitConfig)).toBe(false);

    const badWrongState0TypeConfig = generateUnknownRefereeConfig(
      'state0',
      true,
      stateConfig,
      4,
      true
    );
    expect(isRefereeConfig(badWrongState0TypeConfig)).toBe(false);

    const badWrongQuietTypeConfig = generateUnknownRefereeConfig(
      state0,
      1,
      stateConfig,
      4,
      true
    );
    expect(isRefereeConfig(badWrongQuietTypeConfig)).toBe(false);

    const badWrongConfigSTypeConfig = generateUnknownRefereeConfig(
      state0,
      true,
      'stateConfig',
      4,
      true
    );
    expect(isRefereeConfig(badWrongConfigSTypeConfig)).toBe(false);

    const badWrongPerTurnTypeConfig = generateUnknownRefereeConfig(
      state0,
      true,
      stateConfig,
      '4',
      true
    );
    expect(isRefereeConfig(badWrongPerTurnTypeConfig)).toBe(false);

    const badWrongObserveTypeConfig = generateUnknownRefereeConfig(
      state0,
      true,
      stateConfig,
      4,
      'false'
    );
    expect(isRefereeConfig(badWrongObserveTypeConfig)).toBe(false);

    const badMissingState0Config = generateUnknownRefereeConfig(
      undefined,
      true,
      stateConfig,
      4,
      true
    );
    expect(isRefereeConfig(badMissingState0Config)).toBe(false);

    const badMissingQuietConfig = generateUnknownRefereeConfig(
      state0,
      undefined,
      stateConfig,
      4,
      true
    );
    expect(isRefereeConfig(badMissingQuietConfig)).toBe(false);

    const badMissingConfigSConfig = generateUnknownRefereeConfig(
      state0,
      true,
      undefined,
      4,
      true
    );
    expect(isRefereeConfig(badMissingConfigSConfig)).toBe(false);

    const badMissingPerTurnConfig = generateUnknownRefereeConfig(
      state0,
      true,
      stateConfig,
      undefined,
      true
    );
    expect(isRefereeConfig(badMissingPerTurnConfig)).toBe(false);

    const badMissingObserveConfig = generateUnknownRefereeConfig(
      state0,
      true,
      stateConfig,
      4,
      undefined
    );
    expect(isRefereeConfig(badMissingObserveConfig)).toBe(false);

    const badExtraConfig = generateUnknownRefereeConfig(
      state0,
      true,
      stateConfig,
      4,
      true,
      'extra'
    );
    expect(isRefereeConfig(badExtraConfig)).toBe(false);

    const badWrongExtraTypeConfig = generateUnknownRefereeConfig(
      state0,
      true,
      stateConfig,
      undefined,
      true,
      4
    );
    expect(isRefereeConfig(badWrongExtraTypeConfig)).toBe(false);
  });

  test('isRefereeStateConfig', () => {
    const goodDefaultConfig = generateRefereeStateConfig();
    expect(isRefereeStateConfig(goodDefaultConfig)).toBe(true);

    const goodQboLowerLimitConfig = generateRefereeStateConfig(0, 3);
    expect(isRefereeStateConfig(goodQboLowerLimitConfig)).toBe(true);

    const goodQboUpperLimitConfig = generateRefereeStateConfig(10, 3);
    expect(isRefereeStateConfig(goodQboUpperLimitConfig)).toBe(true);

    const goodFboLowerLimitConfig = generateRefereeStateConfig(3, 0);
    expect(isRefereeStateConfig(goodFboLowerLimitConfig)).toBe(true);

    const goodFboUpperLimitConfig = generateRefereeStateConfig(3, 10);
    expect(isRefereeStateConfig(goodFboUpperLimitConfig)).toBe(true);

    const badQboLowerLimitConfig = generateRefereeStateConfig(-1, 3);
    expect(isRefereeStateConfig(badQboLowerLimitConfig)).toBe(false);

    const badQboUpperLimitConfig = generateRefereeStateConfig(11, 3);
    expect(isRefereeStateConfig(badQboUpperLimitConfig)).toBe(false);

    const badFboLowerLimitConfig = generateRefereeStateConfig(3, -1);
    expect(isRefereeStateConfig(badFboLowerLimitConfig)).toBe(false);

    const badFboUpperLimitConfig = generateRefereeStateConfig(3, 11);
    expect(isRefereeStateConfig(badFboUpperLimitConfig)).toBe(false);

    const badWrongQboTypeConfig = generateUnknownRefereeStateConfig('3', 3);
    expect(isRefereeStateConfig(badWrongQboTypeConfig)).toBe(false);

    const badWrongFboTypeConfig = generateUnknownRefereeStateConfig(3, '3');
    expect(isRefereeStateConfig(badWrongFboTypeConfig)).toBe(false);

    const badMissingQboConfig = generateUnknownRefereeStateConfig(undefined, 3);
    expect(isRefereeStateConfig(badMissingQboConfig)).toBe(false);

    const badMissingFboConfig = generateUnknownRefereeStateConfig(3, undefined);
    expect(isRefereeStateConfig(badMissingFboConfig)).toBe(false);

    const badMissingConfig = generateUnknownRefereeStateConfig(
      undefined,
      undefined
    );
    expect(isRefereeStateConfig(badMissingConfig)).toBe(false);

    const badExtraConfig = generateUnknownRefereeStateConfig(3, 3, 'extra');
    expect(isRefereeStateConfig(badExtraConfig)).toBe(false);

    const badWrongExtraTypeConfig = generateUnknownRefereeStateConfig(
      3,
      undefined,
      3
    );
    expect(isRefereeStateConfig(badWrongExtraTypeConfig)).toBe(false);
  });

  test('isServerConfig', () => {
    const goodDefaultConfig = generateServerConfig();
    expect(isServerConfig(goodDefaultConfig)).toBe(true);

    const goodPortLowerLimitConfig = generateServerConfig(
      10000,
      undefined,
      undefined,
      undefined,
      undefined
    );
    expect(isServerConfig(goodPortLowerLimitConfig)).toBe(true);

    const goodPortUpperLimitConfig = generateServerConfig(
      60000,
      undefined,
      undefined,
      undefined,
      undefined
    );
    expect(isServerConfig(goodPortUpperLimitConfig)).toBe(true);

    const goodServerTriesLowerLimitConfig = generateServerConfig(
      undefined,
      0,
      undefined,
      undefined,
      undefined
    );
    expect(isServerConfig(goodServerTriesLowerLimitConfig)).toBe(true);

    const goodServerTriesUpperLimitConfig = generateServerConfig(
      undefined,
      9,
      undefined,
      undefined,
      undefined
    );
    expect(isServerConfig(goodServerTriesUpperLimitConfig)).toBe(true);

    const goodServerWaitLowerLimitConfig = generateServerConfig(
      undefined,
      undefined,
      0,
      undefined,
      undefined
    );
    expect(isServerConfig(goodServerWaitLowerLimitConfig)).toBe(true);

    const goodServerWaitUpperLimitConfig = generateServerConfig(
      undefined,
      undefined,
      29,
      undefined,
      undefined
    );
    expect(isServerConfig(goodServerWaitUpperLimitConfig)).toBe(true);

    const goodWaitForSignupLowerLimitConfig = generateServerConfig(
      undefined,
      undefined,
      undefined,
      0,
      undefined
    );
    expect(isServerConfig(goodWaitForSignupLowerLimitConfig)).toBe(true);

    const goodWaitForSignupUpperLimitConfig = generateServerConfig(
      undefined,
      undefined,
      undefined,
      9,
      undefined
    );
    expect(isServerConfig(goodWaitForSignupUpperLimitConfig)).toBe(true);

    const goodQuietConfig = generateServerConfig(
      undefined,
      undefined,
      undefined,
      undefined,
      true
    );
    expect(isServerConfig(goodQuietConfig)).toBe(true);

    const refereeConfig = generateRefereeConfig();
    if (!isRefereeConfig(refereeConfig)) throw new Error('bad referee config');
    const goodRefSpecConfig = generateServerConfig(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      refereeConfig
    );
    expect(isServerConfig(goodRefSpecConfig)).toBe(true);

    const badPortLowerLimitConfig = generateServerConfig(
      9999,
      undefined,
      undefined,
      undefined,
      undefined
    );
    expect(isServerConfig(badPortLowerLimitConfig)).toBe(false);

    const badPortUpperLimitConfig = generateServerConfig(
      60001,
      undefined,
      undefined,
      undefined,
      undefined
    );
    expect(isServerConfig(badPortUpperLimitConfig)).toBe(false);

    const badServerTriesLowerLimitConfig = generateServerConfig(
      undefined,
      -1,
      undefined,
      undefined,
      undefined
    );
    expect(isServerConfig(badServerTriesLowerLimitConfig)).toBe(false);

    const badServerTriesUpperLimitConfig = generateServerConfig(
      undefined,
      10,
      undefined,
      undefined,
      undefined
    );
    expect(isServerConfig(badServerTriesUpperLimitConfig)).toBe(false);

    const badServerWaitLowerLimitConfig = generateServerConfig(
      undefined,
      undefined,
      -1,
      undefined,
      undefined
    );
    expect(isServerConfig(badServerWaitLowerLimitConfig)).toBe(false);

    const badServerWaitUpperLimitConfig = generateServerConfig(
      undefined,
      undefined,
      30,
      undefined,
      undefined
    );
    expect(isServerConfig(badServerWaitUpperLimitConfig)).toBe(false);

    const badWaitForSignupLowerLimitConfig = generateServerConfig(
      undefined,
      undefined,
      undefined,
      -1,
      undefined
    );
    expect(isServerConfig(badWaitForSignupLowerLimitConfig)).toBe(false);

    const badWaitForSignupUpperLimitConfig = generateServerConfig(
      undefined,
      undefined,
      undefined,
      10,
      undefined
    );
    expect(isServerConfig(badWaitForSignupUpperLimitConfig)).toBe(false);

    const badWrongPortTypeConfig = generateUnknownServerConfig(
      '18080',
      3,
      20,
      4,
      true,
      refereeConfig
    );
    expect(isServerConfig(badWrongPortTypeConfig)).toBe(false);

    const badWrongServerTriesTypeConfig = generateUnknownServerConfig(
      18080,
      '3',
      20,
      4,
      true,
      refereeConfig
    );
    expect(isServerConfig(badWrongServerTriesTypeConfig)).toBe(false);

    const badWrongServerWaitTypeConfig = generateUnknownServerConfig(
      18080,
      3,
      '20',
      4,
      true,
      refereeConfig
    );
    expect(isServerConfig(badWrongServerWaitTypeConfig)).toBe(false);

    const badWrongWaitForSignupTypeConfig = generateUnknownServerConfig(
      18080,
      3,
      20,
      '4',
      true,
      refereeConfig
    );
    expect(isServerConfig(badWrongWaitForSignupTypeConfig)).toBe(false);

    const badWrongQuietTypeConfig = generateUnknownServerConfig(
      18080,
      3,
      20,
      4,
      'false',
      refereeConfig
    );
    expect(isServerConfig(badWrongQuietTypeConfig)).toBe(false);

    const badWrongRefSpecTypeConfig = generateUnknownServerConfig(
      18080,
      3,
      20,
      4,
      true,
      'refereeConfig'
    );
    expect(isServerConfig(badWrongRefSpecTypeConfig)).toBe(false);

    const badMissingPortConfig = generateUnknownServerConfig(
      undefined,
      3,
      20,
      4,
      true,
      refereeConfig
    );
    expect(isServerConfig(badMissingPortConfig)).toBe(false);

    const badMissingServerTriesConfig = generateUnknownServerConfig(
      18080,
      undefined,
      20,
      4,
      true,
      refereeConfig
    );
    expect(isServerConfig(badMissingServerTriesConfig)).toBe(false);

    const badMissingServerWaitConfig = generateUnknownServerConfig(
      18080,
      3,
      undefined,
      4,
      true,
      refereeConfig
    );
    expect(isServerConfig(badMissingServerWaitConfig)).toBe(false);

    const badMissingWaitForSignupConfig = generateUnknownServerConfig(
      18080,
      3,
      20,
      undefined,
      true,
      refereeConfig
    );
    expect(isServerConfig(badMissingWaitForSignupConfig)).toBe(false);

    const badMissingQuietConfig = generateUnknownServerConfig(
      18080,
      3,
      20,
      4,
      undefined,
      refereeConfig
    );
    expect(isServerConfig(badMissingQuietConfig)).toBe(false);

    const badMissingRefSpecConfig = generateUnknownServerConfig(
      18080,
      3,
      20,
      4,
      true,
      undefined
    );
    expect(isServerConfig(badMissingRefSpecConfig)).toBe(false);

    const badExtraConfig = generateUnknownServerConfig(
      18080,
      3,
      20,
      4,
      true,
      refereeConfig,
      'extra'
    );
    expect(isServerConfig(badExtraConfig)).toBe(false);

    const badWrongExtraTypeConfig = generateUnknownServerConfig(
      18080,
      3,
      20,
      undefined,
      true,
      refereeConfig,
      4
    );
    expect(isServerConfig(badWrongExtraTypeConfig)).toBe(false);
  });
});

function generateUnknownClientConfig(
  port?: unknown,
  host?: unknown,
  wait?: unknown,
  quiet?: unknown,
  players?: unknown,
  extra?: unknown
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
  if (extra) {
    config['extra'] = extra;
  }
  return config;
}

function generateUnknownRefereeConfig(
  state0?: unknown,
  quiet?: unknown,
  configS?: unknown,
  perTurn?: unknown,
  observe?: unknown,
  extra?: unknown
): object {
  const config: object = {};
  if (state0) {
    config['state0'] = state0;
  }
  if (quiet) {
    config['quiet'] = quiet;
  }
  if (configS) {
    config['configS'] = configS;
  }
  if (perTurn) {
    config['perTurn'] = perTurn;
  }
  if (observe) {
    config['observe'] = observe;
  }
  if (extra) {
    config['extra'] = extra;
  }
  return config;
}

function generateUnknownRefereeStateConfig(
  qbo?: unknown,
  fbo?: unknown,
  extra?: unknown
): object {
  const config: object = {};
  if (qbo) {
    config['qbo'] = qbo;
  }
  if (fbo) {
    config['fbo'] = fbo;
  }
  if (extra) {
    config['extra'] = extra;
  }
  return config;
}

function generateUnknownServerConfig(
  port?: unknown,
  serverTries?: unknown,
  serverWait?: unknown,
  waitForSignup?: unknown,
  quiet?: unknown,
  refSpec?: unknown,
  extra?: unknown
): object {
  const config: object = {};
  if (port) {
    config['port'] = port;
  }
  if (serverTries) {
    config['serverTries'] = serverTries;
  }
  if (serverWait) {
    config['serverWait'] = serverWait;
  }
  if (waitForSignup) {
    config['waitForSignup'] = waitForSignup;
  }
  if (quiet) {
    config['quiet'] = quiet;
  }
  if (refSpec) {
    config['refSpec'] = refSpec;
  }
  if (extra) {
    config['extra'] = extra;
  }
  return config;
}

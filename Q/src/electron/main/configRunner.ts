import { parse } from 'JSONStream';
import { ServerConfig } from '../../json/config/serverConfig';
import { ClientConfig } from '../../json/config/clientConfig';
import { runTCPGame } from '../../remote/server/server';
import {
  isClientConfig,
  isServerConfig
} from '../../json/config/configTypeGuard';
import { runClient } from '../../remote/client/client';

let inputClientConfig: ClientConfig | undefined = undefined;
let inputServerConfig: ServerConfig | undefined = undefined;

export function processInputAndRunTCPGame(port: number, isServer: boolean) {
  processInput(port, isServer);
  if (isServer) {
    runServerGame();
  } else {
    runClientGame();
  }
}

/**
 * Checks whether the input is of the expected type, and throws an error if not.
 * @param input the value to check the type of
 * @param isType a type guard for the expected type
 * @param typeName a string representing the name of the type for error messages
 * @returns the input value, if it is of the expected type
 */
function ensureIsType<T>(
  input: unknown,
  isType: (val: unknown) => val is T,
  typeName: string
): T {
  if (!isType(input)) {
    throw new Error(`invalid ${typeName}`);
  }
  return input;
}

/**
 * Processes the input from stdin and stores it in the inputState and inputActors variables.
 * @param isServer true if the input is a server config, false if it is a client config
 */
function processInput(port: number, isServer: boolean) {
  process.stdin.pipe(parse()).on('data', (data: unknown) => {
    if (isServer) {
      inputServerConfig = ensureIsType(data, isServerConfig, 'ServerConfig');
      inputServerConfig.port = port;
      return;
    } else {
      inputClientConfig = ensureIsType(data, isClientConfig, 'ClientConfig');
      inputClientConfig.port = port;
      return;
    }
  });
}

/**
 * Runs a game using a server.
 */
function runServerGame() {
  process.stdin.on('end', async () => {
    if (!inputServerConfig) {
      throw new Error(
        'invalid JSON input, improperly formatted server config defined'
      );
    }

    const [winners, eliminated] = await runTCPGame(inputServerConfig);
    winners.sort();

    process.stdout.write(JSON.stringify([winners, eliminated]));

    if (inputServerConfig && !inputServerConfig['ref-spec'].observe) {
      process.exit();
    }
  });
}

/**
 * Connects to and plays a game as a client.
 */
function runClientGame() {
  process.stdin.on('end', async () => {
    if (!inputClientConfig) {
      throw new Error(
        'invalid JSON input, improperly formatted client config defined'
      );
    }

    runClient(inputClientConfig);
  });
}

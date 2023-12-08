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

/**
 * Reads input from stdin for a server or client config, and runs a game using the config.
 * @param port the port to use for the game
 * @param isServer true if the input should be a server config, false if it
 * should be a client config
 */
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
 * Sets a handler to process the input from stdin and stores it in the
 * inputServerConfig or inputClientConfig variables.
 * @param port the port to use for the game
 * @param isServer true if the input is a server config, false if it is a client
 * config
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
 * Runs a game using a server, using the global inputServerConfig variable.
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

    if (!inputServerConfig['ref-spec'].observe) {
      process.exit();
    }
  });
}

/**
 * Connects to and plays a game as a client, using the global inputClientConfig variable.
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

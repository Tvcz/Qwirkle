import { readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { JActorsB, JState } from '../json/data/data.types';
import {
  ClientConfig,
  generateClientConfig
} from '../json/config/clientConfig';
import {
  ServerConfig,
  generateServerConfig
} from '../json/config/serverConfig';
import { generateRefereeConfig } from '../json/config/refereeConfig';
import {
  ALL_TILES_BONUS_POINT_AMOUNT,
  Q_BONUS_POINT_AMOUNT
} from '../constants';
import { isJActorsB, isJState } from '../json/data/dataTypeGuards';

const REPO_ROOT = resolve(__dirname, '../../../');
const oldTests = join(REPO_ROOT, '9/Tests/');
const newTests = join(REPO_ROOT, '10/Tests/');

const host = '127.0.0.1';
const basePort = 37650;

function buildClientConfig(jActors: JActorsB, port: number): ClientConfig {
  return generateClientConfig(port, host, 2, true, jActors);
}

function buildServerConfig(jState: JState, port: number): ServerConfig {
  return generateServerConfig(
    port,
    2,
    29,
    6,
    true,
    generateRefereeConfig(
      jState,
      true,
      { qbo: Q_BONUS_POINT_AMOUNT, fbo: ALL_TILES_BONUS_POINT_AMOUNT },
      5,
      false
    )
  );
}

for (let n = 0; n <= 9; n++) {
  try {
    const port = basePort + n;
    const jsonData = readFileSync(join(oldTests, `${n}-in.json`), 'utf-8');

    let buffer = '';
    const jsonObjects: any[] = [];

    for (let i = 0; i < jsonData.length; i++) {
      buffer += jsonData[i];
      try {
        jsonObjects.push(JSON.parse(buffer));
        buffer = ''; // Clear the buffer after successfully parsing the JSON object
      } catch (error) {
        // JSON parsing failed, continue accumulating characters in the buffer
      }
    }

    const jState = jsonObjects[0];
    const jActors = jsonObjects[1];
    if (!isJState(jState)) {
      throw new Error(`Invalid JState : ${JSON.stringify(jState)}`);
    }
    if (!isJActorsB(jActors)) {
      throw new Error(`Invalid JActorsB : ${JSON.stringify(jActors)}`);
    }
    const clientConfig = buildClientConfig(jActors, port);
    const serverConfig = buildServerConfig(jState, port);

    writeFileSync(
      join(newTests, `${n}-client-config.json`),
      JSON.stringify(clientConfig, null, 2)
    );
    writeFileSync(
      join(newTests, `${n}-server-config.json`),
      JSON.stringify(serverConfig, null, 2)
    );
  } catch (error) {
    console.error('Error reading JSON file:', error);
  }
}

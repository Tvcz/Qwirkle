import { spawn } from 'child_process';
import { existsSync, lstatSync, readFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { glob } from 'glob';

const CONFIG_FILE_PATH = join(__dirname, 'integrationTestConfigs.json');
const REPO_ROOT = resolve(__dirname, '../../../');

// Where the testScript and directories paths are relative to the repo root
interface TestConfig {
  testScript: string;
  clientScript?: string;
  directories: string[];
}

const integrationTestConfigs: TestConfig[] = JSON.parse(
  readFileSync(CONFIG_FILE_PATH, 'utf-8')
);

for (const config of integrationTestConfigs) {
  const allDirectories = getAbsolutePaths(config.directories);
  const nestedDirectories: string[] = [];
  allDirectories.forEach((dir) =>
    nestedDirectories.push(
      ...glob.sync(dir).filter((d) => lstatSync(d).isDirectory())
    )
  );
  xTest(config.testScript, nestedDirectories, config.clientScript);
}

function getAbsolutePaths(directories: string[]): string[] {
  return directories.map((directory) => join(REPO_ROOT, directory));
}

function xTest(
  testScript: string,
  directories: string[],
  clientScript?: string
) {
  const absolutePathTestScript = join(REPO_ROOT, testScript);
  const absolutePathClientScript = clientScript
    ? join(REPO_ROOT, clientScript)
    : undefined;
  const testScriptDirectory = dirname(absolutePathTestScript);

  process.chdir(testScriptDirectory);

  for (const directory of directories) {
    const directoryName = directory.split('/').pop();
    describe(`Integration tests for ${testScript} from ${directoryName}`, () => {
      for (
        let n = 0;
        existsSync(join(directory, `${n}-in.json`)) ||
        existsSync(join(directory, `${n}-server-config.json`));
        n += 1
      ) {
        let inputPath: string;
        let clientInputPath: string | undefined = undefined;
        if (clientScript) {
          inputPath = join(directory, `${n}-server-config.json`);
          clientInputPath = join(directory, `${n}-client-config.json`);
        } else {
          inputPath = join(directory, `${n}-in.json`);
        }
        const expectedOutputPath = join(directory, `${n}-out.json`);
        xTestOneFile(
          absolutePathTestScript,
          inputPath,
          expectedOutputPath,
          testScript,
          `${directoryName}/${n}`,
          absolutePathClientScript,
          clientInputPath
        );
      }
    });
  }
}

function xTestOneFile(
  testScript: string,
  inputPath: string,
  expectedOutputPath: string,
  testScriptName: string,
  inputName: string,
  clientScript?: string,
  clientInputPath?: string
) {
  test(`Integration test of ${testScriptName} against ${inputName}`, async () => {
    // try {
    expect(() => assertFileHasValidJSONs(inputPath)).not.toThrow(
      'invalid JSON'
    );
    if (clientInputPath) {
      expect(() => assertFileHasValidJSONs(clientInputPath)).not.toThrow(
        'invalid JSON'
      );
    }
    expect(() => assertFileHasValidJSONs(expectedOutputPath)).not.toThrow(
      'invalid JSON'
    );
    const inputData = readFileSync(inputPath, 'utf-8').trim();
    const clientInputData = clientInputPath
      ? readFileSync(clientInputPath, 'utf-8').trim()
      : undefined;
    const expectedOutputData = readFileSync(expectedOutputPath, 'utf-8').trim();

    const outputData = await getOutputFromTest(
      testScript,
      inputData,
      clientScript,
      clientInputData
    );

    expect(JSON.parse(outputData)).toStrictEqual(
      JSON.parse(expectedOutputData)
    );
  }, 30000);
}

let curPort = 15000;
async function getOutputFromTest(
  testScript: string,
  inputData: string,
  clientScript?: string,
  clientInputData?: string
): Promise<string> {
  curPort += 1;
  const args = clientScript ? [`${curPort}`] : [];
  const child = spawn(testScript, args, {
    stdio: ['pipe', 'pipe', 'inherit']
  });
  child.stdin.write(inputData);
  child.stdin.end();

  let clientChild: any = undefined;
  if (clientScript) {
    clientChild = spawn(clientScript, args, {
      stdio: ['pipe', 'pipe', 'inherit']
    });
    clientChild.stdin.write(clientInputData);
    clientChild.stdin.end();
  }

  const outputData = await new Promise<string>((resolve, reject) => {
    let data = '';
    child.stdout.on('data', (chunk) => (data += chunk));
    child.stdout.on('end', () => resolve(data.trim()));
    child.stdout.on('error', (err) => reject(err));
  });

  child.kill();
  if (clientChild) {
    clientChild.kill();
  }

  return outputData;
}

function assertFileHasValidJSONs(filePath: string): void {
  const content = readFileSync(filePath, 'utf-8').trim();
  const values: unknown[] = [];
  let buffer = '';
  for (const char of content) {
    buffer += char;
    try {
      const value = JSON.parse(buffer);
      values.push(value);
      buffer = '';
    } catch (error) {
      continue;
    }
  }
  if (buffer !== '') {
    throw new Error('invalid JSON');
  }
}

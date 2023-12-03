import { processInputAndRunTCPGame } from './configRunner';

const port = Number(process.argv[2]);

processInputAndRunTCPGame(port, true);

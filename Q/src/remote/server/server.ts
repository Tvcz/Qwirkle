const SECONDS_TO_WAIT_FOR_SIGNUPS: number = 20;
const SECONDS_TO_WAIT_FOR_NAME: number = 3;
const MIN_PLAYERS: number = 2;
const MAX_PLAYERS: number = 4;

const MAX_RETRY_COUNT = 1;

function runTCPGame(retryCount = 0) {
  // listen for tcp connection
  // at one connection start 20 seconds timer
  // wait for more connections
  //  wait for names
  //    build TCPPlayers with connections
  // if not enough connections, repeat once
  if (retryCount < MAX_RETRY_COUNT) {
    runTCPGame(retryCount + 1);
  }
  // if not enough still, return [[], []]
  // if enough connections, start game
}

// encompasses both information on how to send data (address, port, etc.)
// and how to address data (name of player)
export interface Connection {
  send(message: string): void;
}

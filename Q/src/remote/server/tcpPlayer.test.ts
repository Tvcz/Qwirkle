import { Server } from 'http';
import { createConnection } from 'net';
import { Connection, TCPConnection } from '../connection';
import { TCPPlayer } from './tcpPlayer';
import { SERVER_PLAYER_NAME_TIMEOUT_MS } from '../../constants';
import { isNameCall, validateJSON } from '../jsonValidator';

describe('tests for tcp player', () => {
  let clientConnection: Connection;
  let serverConnection: Connection;
  let player: TCPPlayer;

  beforeEach((done) => {
    const server = new Server();
    server.listen(3000);
    let clientReady = false;
    let serverReady = false;
    server.once('connection', (socket) => {
      serverConnection = new TCPConnection(socket);
      player = new TCPPlayer(serverConnection, SERVER_PLAYER_NAME_TIMEOUT_MS);
      serverReady = true;
    });
    const clientSocket = createConnection({ port: 3000 });
    clientSocket.once('connect', () => {
      clientConnection = new TCPConnection(clientSocket);
      clientReady = true;
    });
    const interval = setInterval(() => {
      if (clientReady && serverReady) {
        clearInterval(interval);
        done();
      }
    }, 10);
  });

  afterEach(() => {
    serverConnection.close();
    clientConnection.close();
  });

  test('name method', (done) => {
    clientConnection.onResponse((data: string) => {
      const json = validateJSON(data);
      expect(isNameCall(data)).toBe(true);
      done();
      // serverConnection.send('{"method": "name", "result": "myname"}');
    });
    const name = player.name();
    // expect(name).toBe('myname');
  });
});

import { Server, Socket, createServer } from 'net';
import { createConnection } from 'net';
import { TCPConnection } from './connection';

describe('tests for TCPConnection', () => {
  let server: Server;
  let clientSocket: Socket;

  beforeEach(() => {
    const PORT = 3333;
    server = createServer();
    server.listen(PORT);
    clientSocket = createConnection({ port: PORT });
  });

  afterEach(() => {
    server.close();
    clientSocket.end();
  });

  test('sends messages', (done) => {
    const resolvedOnMessage = new Promise<boolean>((resolve) => {
      server.on('connection', (socket) => {
        const newConnection = new TCPConnection(socket);
        newConnection.onResponse((_message) => resolve(true));
      });
    });

    clientSocket.on('connect', () => {
      const client = new TCPConnection(clientSocket);
      client.send('test');
      expect(resolvedOnMessage).resolves.toBeTruthy();
      done();
    });
  });

  test('receives messages and processes messages in json chunks', async () => {
    const receivedMessages: string[] = [];
    const sampleMessages = ['"test1', 'test2"', '"test3"', '1{}'];
    const sampleMessagesJSONChunks = ['"test1test2"', '"test3"', '1', '{}'];

    server.on('connection', (socket) => {
      const newConnection = new TCPConnection(socket);
      newConnection.onResponse((message) => {
        receivedMessages.push(message);
      });
    });

    clientSocket.on('connect', () => {
      const client = new TCPConnection(clientSocket);
      sampleMessages.forEach((message) => client.send(message));
    });

    await new Promise((resolve) => {
      const checkReceivedMessages = setInterval(() => {
        if (receivedMessages.length >= sampleMessagesJSONChunks.length) {
          clearInterval(checkReceivedMessages);
          resolve(null);
        }
      }, 100);
    });

    expect(receivedMessages).toStrictEqual(sampleMessagesJSONChunks);
  });

  test('closes connection', (done) => {
    const callOnReceived = jest.fn();
    const callOnSent = jest.fn();

    server.on('connection', (socket) => {
      const newConnection = new TCPConnection(socket);
      newConnection.onResponse((_message) => {
        callOnReceived();
        newConnection.close();
      });
    });

    clientSocket.on('close', () => {
      expect(callOnSent).toHaveBeenCalled();
      expect(callOnReceived).toHaveBeenCalled();
      done();
    });

    clientSocket.on('connect', () => {
      const client = new TCPConnection(clientSocket);
      callOnSent();
      client.send('"test"');
    });
  });
});

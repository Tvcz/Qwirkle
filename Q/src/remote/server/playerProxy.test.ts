import { Server } from 'http';
import { createConnection } from 'net';
import { Connection, TCPConnection } from '../connection';
import { TCPPlayer } from './playerProxy';
import { isNameCall, isSetUpCall, isTakeTurnCall } from '../jsonValidator';
import { BaseTile } from '../../game/map/tile';
import Coordinate from '../../game/map/coordinate';
import { MethodCall, SetUpCall } from '../types';
import { BaseTurnAction } from '../../player/turnAction';
import { validateJSON } from '../../json/validator';

describe('tests for tcp player proxy', () => {
  let server: Server;
  let clientConnection: Connection;
  let serverConnection: Connection;
  let player: TCPPlayer;

  beforeEach((done) => {
    server = new Server();
    server.listen(3333);
    let clientReady = false;
    let serverReady = false;
    server.once('connection', (socket) => {
      serverConnection = new TCPConnection(socket);
      player = new TCPPlayer(serverConnection);
      serverReady = true;
    });
    const clientSocket = createConnection({ port: 3333 });
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
    server.close();
    serverConnection.close();
    clientConnection.close();
  });

  test('name method', async () => {
    clientConnection.onResponse((data: string) => {
      const json = validateJSON(data);
      expect(isNameCall(json)).toBe(true);
      clientConnection.send('{"method": "name", "result": "myname"}');
    });
    const name = await player.name();
    expect(name).toBe('myname');
  });

  test('name method bad response', async () => {
    clientConnection.onResponse((data: string) => {
      const json = validateJSON(data);
      expect(isNameCall(json)).toBe(true);
      clientConnection.send('{"method": "name", "result": 0}');
    });
    await expect(player.name()).rejects.toThrow();
  });

  test('setUp method', async () => {
    // arrange
    const mapState = [
      {
        tile: new BaseTile('circle', 'red'),
        coordinate: new Coordinate(0, 0)
      }
    ];
    const mapStateParsed = [
      {
        tile: { shape: 'circle', color: 'red' },
        coordinate: { x: 0, y: 0 }
      }
    ];
    const startingTiles = [
      new BaseTile('circle', 'red'),
      new BaseTile('circle', 'red')
    ];
    const startingTilesParsed = [
      { shape: 'circle', color: 'red' },
      { shape: 'circle', color: 'red' }
    ];

    // act + assert
    clientConnection.onResponse((data: string) => {
      const json = validateJSON(data);
      expect(isSetUpCall(json)).toBe(true);
      const setUpCall = json as SetUpCall;
      clientConnection.send('{"method": "setUp", "result": 0}');
      expect(setUpCall.args).toStrictEqual({
        mapState: mapStateParsed,
        startingTiles: startingTilesParsed
      });
    });
    await expect(player.setUp(mapState, startingTiles)).resolves.not.toThrow();
  });

  test('setUp method bad response', async () => {
    // arrange
    const mapState = [
      {
        tile: new BaseTile('circle', 'red'),
        coordinate: new Coordinate(0, 0)
      }
    ];
    const startingTiles = [
      new BaseTile('circle', 'red'),
      new BaseTile('circle', 'red')
    ];

    // act + assert
    clientConnection.onResponse((data: string) => {
      const json = validateJSON(data);
      expect(isSetUpCall(json)).toBe(true);
      clientConnection.send('{"method": "setUp", "result": 1}');
    });
    await expect(player.setUp(mapState, startingTiles)).rejects.toThrow();
  });

  test('takeTurn method', async () => {
    const expectedTurnAction = new BaseTurnAction('PLACE', [
      { tile: new BaseTile('circle', 'red'), coordinate: new Coordinate(0, 0) }
    ]);
    const turnActionString = JSON.stringify(expectedTurnAction);

    clientConnection.onResponse((data: string) => {
      const json = validateJSON(data);
      expect(isTakeTurnCall(json)).toBe(true);
      clientConnection.send(
        `{"method": "takeTurn", "result": ${turnActionString}}`
      );
    });
    const turnAction = await player.takeTurn({
      playerTiles: [],
      mapState: [],
      scoreboard: [],
      remainingTilesCount: 0,
      playersQueue: []
    });
    expect(turnAction).toStrictEqual(expectedTurnAction);
  });

  test('takeTurn method bad response', async () => {
    clientConnection.onResponse((data: string) => {
      const json = validateJSON(data);
      expect(isTakeTurnCall(json)).toBe(true);
      clientConnection.send('{"method": "takeTurn", "result": 0}');
    });
    await expect(
      player.takeTurn({
        playerTiles: [],
        mapState: [],
        scoreboard: [],
        remainingTilesCount: 0,
        playersQueue: []
      })
    ).rejects.toThrow();
  });

  test('newTiles method', async () => {
    const newTiles = [
      new BaseTile('circle', 'red'),
      new BaseTile('square', 'purple')
    ];
    const newTilesParsed = [
      { shape: 'circle', color: 'red' },
      { shape: 'square', color: 'purple' }
    ];

    clientConnection.onResponse((data: string) => {
      const json = validateJSON(data) as MethodCall;
      expect(json.method).toBe('newTiles');
      expect(json.args).toStrictEqual({ newTiles: newTilesParsed });
      clientConnection.send('{"method": "newTiles", "result": 0}');
    });
    await expect(player.newTiles(newTiles)).resolves.not.toThrow();
  });

  test('newTiles method bad response', async () => {
    const newTiles = [
      new BaseTile('circle', 'red'),
      new BaseTile('square', 'purple')
    ];

    clientConnection.onResponse((data: string) => {
      const json = validateJSON(data) as MethodCall;
      expect(json.method).toBe('newTiles');
      clientConnection.send('{"method": "newTiles"}');
    });
    await expect(player.newTiles(newTiles)).rejects.toThrow();
  });

  test('win method', async () => {
    clientConnection.onResponse((data: string) => {
      const json = validateJSON(data) as MethodCall;
      expect(json.method).toBe('win');
      clientConnection.send('{"method": "win", "result": 0}');
    });
    await expect(player.win(true)).resolves.not.toThrow();
  });

  test('win method bad response', async () => {
    clientConnection.onResponse((data: string) => {
      const json = validateJSON(data) as MethodCall;
      expect(json.method).toBe('win');
      clientConnection.send('{"method": "blah"}');
    });
    await expect(player.win(true)).rejects.toThrow();
  });
});

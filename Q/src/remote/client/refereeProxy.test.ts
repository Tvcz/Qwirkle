import { Server, createConnection } from 'net';
import { Connection, TCPConnection } from '../connection';
import { BaseTurnAction } from '../../player/turnAction';
import { BaseTile } from '../../game/map/tile';
import Coordinate from '../../game/map/coordinate';
import { Player } from '../../player/player';
import { refereeProxy } from './refereeProxy';
import { RelevantPlayerInfo } from '../../game/types/gameState.types';
import { mock } from 'node:test';

const mockPlayer: Player<BaseTile> = {
  name: jest.fn().mockResolvedValue('Mock Player'),
  setUp: jest.fn().mockResolvedValue(undefined),
  takeTurn: jest.fn(),
  newTiles: jest.fn().mockResolvedValue(undefined),
  win: jest.fn().mockResolvedValue(undefined)
};

describe('tests for tcp referee proxy', () => {
  let server: Server;
  let clientConnection: Connection;
  let serverConnection: Connection;

  beforeEach((done) => {
    server = new Server();
    server.listen(4444);
    let clientReady = false;
    let serverReady = false;
    server.once('connection', (socket) => {
      serverConnection = new TCPConnection(socket);
      serverReady = true;
    });
    const clientSocket = createConnection({ port: 4444 });
    clientSocket.once('connect', () => {
      clientConnection = new TCPConnection(clientSocket);
      refereeProxy(mockPlayer, clientConnection);
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
    jest.resetAllMocks();
  });

  test('name method', (done) => {
    serverConnection.onResponse((data: string) => {
      const json = JSON.parse(data);
      expect(json.method).toBe('name');
      expect(json.result).toBe('Mock Player');
      expect(mockPlayer.name).toHaveBeenCalled();
      done();
    });
    serverConnection.send('{"method": "name", "args": {}}');
  });

  test('setUp method', (done) => {
    const mapState = [
      {
        tile: new BaseTile('circle', 'red'),
        coordinate: new Coordinate(0, 0)
      }
    ];
    const startingTiles = [new BaseTile('circle', 'blue')];
    serverConnection.onResponse((data: string) => {
      const json = JSON.parse(data);
      expect(json.method).toBe('setUp');
      expect(json.result).toBe(0);
      expect(mockPlayer.setUp).toHaveBeenCalledWith(mapState, startingTiles);
      done();
    });
    serverConnection.send(
      `{"method": "setUp", "args": {"mapState": ${JSON.stringify(
        mapState
      )}, "startingTiles": ${JSON.stringify(startingTiles)}}}`
    );
  });

  test('takeTurn method', (done) => {
    (mockPlayer.takeTurn as jest.Mock<any, any, any>).mockResolvedValue(
      new BaseTurnAction('PLACE', [
        {
          tile: new BaseTile('circle', 'red'),
          coordinate: new Coordinate(1, 1)
        }
      ])
    );
    const turnAction = new BaseTurnAction('PLACE', [
      {
        tile: new BaseTile('circle', 'red'),
        coordinate: new Coordinate(1, 1)
      }
    ]);
    const parsedTurnAction = JSON.parse(JSON.stringify(turnAction));
    const pubInfo: RelevantPlayerInfo<BaseTile> = {
      playerTiles: [],
      mapState: [],
      scoreboard: [],
      remainingTilesCount: 0,
      playersQueue: []
    };
    serverConnection.onResponse((data: string) => {
      const json = JSON.parse(data);
      expect(json.method).toBe('takeTurn');
      expect(json.result).toStrictEqual(parsedTurnAction);
      expect(mockPlayer.takeTurn).toHaveBeenCalledWith(pubInfo);
      done();
    });
    serverConnection.send(
      `{"method": "takeTurn", "args": { "publicState": ${JSON.stringify(
        pubInfo
      )}}}`
    );
  });

  test('newTiles method', (done) => {
    const newTiles = [
      new BaseTile('circle', 'red'),
      new BaseTile('circle', 'purple')
    ];
    serverConnection.onResponse((data: string) => {
      const json = JSON.parse(data);
      expect(json.method).toBe('newTiles');
      expect(json.result).toBe(0);
      expect(mockPlayer.newTiles).toHaveBeenCalledWith(newTiles);
      done();
    });
    serverConnection.send(
      `{"method": "newTiles", "args": {"newTiles": ${JSON.stringify(
        newTiles
      )}}}`
    );
  });

  test('win method', (done) => {
    serverConnection.onResponse((data: string) => {
      const json = JSON.parse(data);
      expect(json.method).toBe('win');
      expect(json.result).toBe(0);
      expect(mockPlayer.win).toHaveBeenCalledWith(true);
      done();
    });
    serverConnection.send('{"method": "win", "args": {"win": true}}');
  });
});

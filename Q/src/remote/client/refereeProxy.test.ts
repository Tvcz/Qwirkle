import { Server, createConnection } from 'net';
import { Connection, TCPConnection } from '../connection';
import { BaseTurnAction } from '../../player/turnAction';
import { BaseTile } from '../../game/map/tile';
import Coordinate from '../../game/map/coordinate';
import { Player } from '../../player/player';
import { refereeProxy } from './refereeProxy';
import { RelevantPlayerInfo } from '../../game/types/gameState.types';
import { toJPub } from '../../json/serialize/jPub';
import { toJTile } from '../../json/serialize/jMap';
import { toJChoice } from '../../json/serialize/jTurn';

const mockPlayer: Player = {
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
      refereeProxy(mockPlayer, clientConnection, false);
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
      expect(json).toBe('Mock Player');
      expect(mockPlayer.name).toHaveBeenCalled();
      done();
    });
    serverConnection.send('["name", []]');
  });

  test('setUp method', (done) => {
    const startingTiles = [new BaseTile('circle', 'blue')];
    const pubState: RelevantPlayerInfo = {
      playerTiles: startingTiles,
      mapState: [
        {
          tile: new BaseTile('circle', 'red'),
          coordinate: new Coordinate(0, 0)
        }
      ],
      scoreboard: [{ name: '', score: 0 }],
      remainingTilesCount: 0,
      playersQueue: ['']
    };
    const jPubState = toJPub(pubState, '');
    const jStartingTiles = startingTiles.map(toJTile);
    serverConnection.onResponse((data: string) => {
      const json = JSON.parse(data);
      expect(json).toBe('void');
      expect(mockPlayer.setUp).toHaveBeenCalledWith(pubState, startingTiles);
      done();
    });
    serverConnection.send(
      `["setup", ${JSON.stringify([jPubState, jStartingTiles])}]`
    );
  });

  test('takeTurn method', (done) => {
    const turnAction = new BaseTurnAction('PLACE', [
      {
        tile: new BaseTile('circle', 'red'),
        coordinate: new Coordinate(1, 1)
      }
    ]);
    (mockPlayer.takeTurn as jest.Mock<any, any, any>).mockResolvedValue(
      turnAction
    );
    const jTurnAction = toJChoice(turnAction);
    const pubInfo: RelevantPlayerInfo = {
      playerTiles: [],
      mapState: [],
      scoreboard: [{ name: '', score: 0 }],
      remainingTilesCount: 0,
      playersQueue: ['']
    };
    const jPubInfo = toJPub(pubInfo, '');
    serverConnection.onResponse((data: string) => {
      const json = JSON.parse(data);
      expect(json).toStrictEqual(jTurnAction);
      expect(mockPlayer.takeTurn).toHaveBeenCalledWith(pubInfo);
      done();
    });
    serverConnection.send(`["take-turn", ${JSON.stringify([jPubInfo])}]`);
  });

  test('newTiles method', (done) => {
    const newTiles = [
      new BaseTile('circle', 'red'),
      new BaseTile('circle', 'purple')
    ];
    const jNewTiles = newTiles.map(toJTile);
    serverConnection.onResponse((data: string) => {
      const json = JSON.parse(data);
      expect(json).toBe('void');
      expect(mockPlayer.newTiles).toHaveBeenCalledWith(newTiles);
      done();
    });
    serverConnection.send(`["new-tiles", ${JSON.stringify([jNewTiles])}]`);
  });

  test('win method', (done) => {
    serverConnection.onResponse((data: string) => {
      const json = JSON.parse(data);
      expect(json).toBe('void');
      expect(mockPlayer.win).toHaveBeenCalledWith(true);
      done();
    });
    serverConnection.send('["win", [true]]');
  });
});

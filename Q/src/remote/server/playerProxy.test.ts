import { Server } from 'http';
import { createConnection } from 'net';
import { Connection, TCPConnection } from '../connection';
import { TCPPlayer } from './playerProxy';
import { BaseTile } from '../../game/map/tile';
import Coordinate from '../../game/map/coordinate';
import { BaseTurnAction } from '../../player/turnAction';
import { validateJSON } from '../../json/validator/validator';
import {
  SetUpCall,
  MethodCall,
  NewTilesCall,
  WinCall
} from '../../json/messages/messages.types';
import {
  isNameCall,
  isSetUpCall,
  isTakeTurnCall
} from '../../json/messages/messagesTypeGuards';
import { RelevantPlayerInfo } from '../../game/types/gameState.types';
import { toJChoice } from '../../json/serialize/jTurn';
import { toJPub } from '../../json/serialize/jPub';

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
      player = new TCPPlayer(serverConnection, 10000);
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
      clientConnection.send('"myname"');
    });
    const name = await player.name();
    expect(name).toBe('myname');
  });

  test('name method bad response', async () => {
    clientConnection.onResponse((data: string) => {
      const json = validateJSON(data);
      expect(isNameCall(json)).toBe(true);
      clientConnection.send('1');
    });
    await expect(player.name()).rejects.toThrow();
  });

  test('setUp method', async () => {
    // arrange
    const pubState: RelevantPlayerInfo = {
      playerTiles: [],
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
    const startingTiles = [
      new BaseTile('circle', 'red'),
      new BaseTile('circle', 'red')
    ];
    const jStartingTiles = [
      { shape: 'circle', color: 'red' },
      { shape: 'circle', color: 'red' }
    ];

    // act + assert
    clientConnection.onResponse((data: string) => {
      const json = validateJSON(data);
      expect(isSetUpCall(json)).toBe(true);
      const setUpCall = json as SetUpCall;
      clientConnection.send('"void"');
      expect(setUpCall).toStrictEqual(['setup', [jPubState, jStartingTiles]]);
    });
    await expect(player.setUp(pubState, startingTiles)).resolves.not.toThrow();
  });

  test('setUp method bad response', async () => {
    // arrange
    const pubState: RelevantPlayerInfo = {
      playerTiles: [],
      mapState: [
        {
          tile: new BaseTile('circle', 'red'),
          coordinate: new Coordinate(0, 0)
        }
      ],
      scoreboard: [],
      remainingTilesCount: 0,
      playersQueue: []
    };
    const startingTiles = [
      new BaseTile('circle', 'red'),
      new BaseTile('circle', 'red')
    ];

    // act + assert
    clientConnection.onResponse((data: string) => {
      const json = validateJSON(data);
      expect(isSetUpCall(json)).toBe(true);
      clientConnection.send('1');
    });
    await expect(player.setUp(pubState, startingTiles)).rejects.toThrow();
  });

  test('takeTurn method', async () => {
    const expectedTurnAction = new BaseTurnAction('PLACE', [
      { tile: new BaseTile('circle', 'red'), coordinate: new Coordinate(0, 0) }
    ]);
    const turnActionRes = JSON.stringify(toJChoice(expectedTurnAction));

    clientConnection.onResponse((data: string) => {
      const json = validateJSON(data);
      expect(isTakeTurnCall(json)).toBe(true);
      clientConnection.send(turnActionRes);
    });
    const turnAction = await player.takeTurn({
      playerTiles: [],
      mapState: [],
      scoreboard: [{ name: '', score: 0 }],
      remainingTilesCount: 0,
      playersQueue: []
    });
    expect(turnAction).toStrictEqual(expectedTurnAction);
  });

  test('takeTurn method bad response', async () => {
    clientConnection.onResponse((data: string) => {
      const json = validateJSON(data);
      expect(isTakeTurnCall(json)).toBe(true);
      clientConnection.send('"void"');
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
      const json = validateJSON(data) as NewTilesCall;
      expect(json[0]).toBe('new-tiles');
      expect(json[1][0]).toStrictEqual(newTilesParsed);
      clientConnection.send('"void"');
    });
    await expect(player.newTiles(newTiles)).resolves.not.toThrow();
  });

  test('newTiles method bad response', async () => {
    const newTiles = [
      new BaseTile('circle', 'red'),
      new BaseTile('square', 'purple')
    ];

    clientConnection.onResponse((data: string) => {
      const json = validateJSON(data) as NewTilesCall;
      expect(json[0]).toBe('new-tiles');
      clientConnection.send('1');
    });
    await expect(player.newTiles(newTiles)).rejects.toThrow();
  });

  test('win method', async () => {
    clientConnection.onResponse((data: string) => {
      const json = validateJSON(data) as WinCall;
      expect(json[0]).toBe('win');
      clientConnection.send('"void"');
    });
    await expect(player.win(true)).resolves.not.toThrow();
  });

  test('win method bad response', async () => {
    clientConnection.onResponse((data: string) => {
      const json = validateJSON(data) as MethodCall;
      expect(json[0]).toBe('win');
      clientConnection.send('1');
    });
    await expect(player.win(true)).rejects.toThrow();
  });
});

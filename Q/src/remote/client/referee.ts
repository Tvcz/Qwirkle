import { Player } from '../../player/player';
import { BaseTile } from '../../game/map/tile';
import { Connection } from '../connection';
import {
  isNameCall,
  isNewTilesCall,
  isSetUpCall,
  isTakeTurnCall,
  isWinCall,
  validateJSON
} from '../jsonValidator';
import { NewTilesCall, SetUpCall, TakeTurnCall, WinCall } from '../types';
import { buildTile, buildTilePlacement } from '../parse';

// one exists per client player
// each refereeProxy has its own connection
export function refereeProxy(player: Player<BaseTile>, connection: Connection) {
  // listens for tcp messages from the server
  // converts them to method calls on the player
  connection.onResponse((data) => {
    // json validator
    const parsedMessage = validateJSON(data);
    if (isNameCall(parsedMessage)) {
      makeNameCall(player, connection);
    } else if (isSetUpCall(parsedMessage)) {
      makeSetUpCall(player, connection, parsedMessage);
    } else if (isTakeTurnCall(parsedMessage)) {
      makeTakeTurnCall(player, connection, parsedMessage);
    } else if (isNewTilesCall(parsedMessage)) {
      makeNewTilesCall(player, connection, parsedMessage);
    } else if (isWinCall(parsedMessage)) {
      makeWinCall(player, connection, parsedMessage);
    } else {
      throw new Error('invalid method received in message');
    }
  });
}

// send JSON string messages to the server with the return values
// from the method calls on the client player

function makeNameCall(player: Player<BaseTile>, connection: Connection) {
  const result = player.name();
  const response = { method: 'name', result };
  connection.send(JSON.stringify(response));
}

function makeSetUpCall(
  player: Player<BaseTile>,
  connection: Connection,
  message: SetUpCall
) {
  const args = message.args;
  player.setUp(
    args.mapState.map(buildTilePlacement),
    args.startingTiles.map(buildTile)
  );
  const response = { method: 'setUp', result: 0 };
  connection.send(JSON.stringify(response));
}

function makeTakeTurnCall(
  player: Player<BaseTile>,
  connection: Connection,
  message: TakeTurnCall
) {
  const parsedPublicState = message.args.publicState;
  const publicState = {
    playerTiles: parsedPublicState.playerTiles.map(buildTile),
    mapState: parsedPublicState.mapState.map(buildTilePlacement),
    scoreboard: parsedPublicState.scoreboard,
    remainingTilesCount: parsedPublicState.remainingTilesCount,
    playersQueue: parsedPublicState.playersQueue
  };

  const result = player.takeTurn(publicState);
  const response = { method: 'takeTurn', result };
  connection.send(JSON.stringify(response));
}

function makeNewTilesCall(
  player: Player<BaseTile>,
  connection: Connection,
  message: NewTilesCall
) {
  player.newTiles(message.args.newTiles.map(buildTile));
  const response = { method: 'newTiles', result: 0 };
  connection.send(JSON.stringify(response));
}

function makeWinCall(
  player: Player<BaseTile>,
  connection: Connection,
  message: WinCall
) {
  player.win(message.args.win);
  const response = { method: 'win', result: 0 };
  connection.send(JSON.stringify(response));
}

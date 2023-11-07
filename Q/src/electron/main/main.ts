import { app, ipcMain } from 'electron';
import { RandomBagOfTiles } from '../../game/gameState/bagOfTiles';
import { BaseGameState } from '../../game/gameState/gameState';
import PlayerState from '../../game/gameState/playerState';
import PlayerTurnQueue from '../../game/gameState/playerTurnQueue';
import Coordinate from '../../game/map/coordinate';
import BaseMap from '../../game/map/map';
import { BaseTile } from '../../game/map/tile';
import { BaseRuleBook } from '../../game/rules/ruleBook';
import { Color, Shape } from '../../game/types/map.types';
import { BaseObserver } from '../../observer/observer';
import { BasePlayer } from '../../player/player';
import { DagStrategy } from '../../player/strategy';
import { BaseReferee } from '../../referee/referee';

const createPlacement = (shape: Shape, color: Color, x: number, y: number) => {
  return {
    tile: new BaseTile(shape, color),
    coordinate: new Coordinate(x, y)
  };
};

const startingMap = [
  createPlacement('clover', 'purple', 3, -2),
  createPlacement('circle', 'yellow', 0, -1),
  createPlacement('8star', 'yellow', 1, -1),
  createPlacement('square', 'yellow', 2, -1),
  createPlacement('clover', 'yellow', 3, -1),
  createPlacement('diamond', 'yellow', 4, -1),
  createPlacement('star', 'yellow', 5, -1),
  createPlacement('8star', 'yellow', 6, -1)
];

const map = new BaseMap(startingMap);
const players = [
  new BasePlayer('player1', new DagStrategy(), new BaseRuleBook()),
  new BasePlayer('player2', new DagStrategy(), new BaseRuleBook())
];
const observers = [new BaseObserver<BaseTile>()];
const player1 = new PlayerState<BaseTile>(players[0]);
const player2 = new PlayerState<BaseTile>(players[1]);
const playerTurnQueue = new PlayerTurnQueue([player1, player2]);
const bagOfTiles = new RandomBagOfTiles<BaseTile>([]);
const gameState = new BaseGameState(map, playerTurnQueue, bagOfTiles);
const rulebook = new BaseRuleBook();

BaseReferee(players, observers, rulebook, gameState);

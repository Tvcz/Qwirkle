import { RandomBagOfTiles } from '../game/gameState/bagOfTiles';
import { BaseGameState } from '../game/gameState/gameState';
import PlayerState from '../game/gameState/playerState';
import PlayerTurnQueue from '../game/gameState/playerTurnQueue';
import HtmlRenderer from '../game/graphicalRenderer/graphicalRenderer';
import Coordinate from '../game/map/coordinate';
import BaseMap from '../game/map/map';
import { BaseTile } from '../game/map/tile';
import { Color, Shape } from '../game/types/map.types';
import { createWindow } from './main/gameStateWindow';

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
const player1 = new PlayerState<BaseTile>(1);
const player2 = new PlayerState<BaseTile>(2);
const playerTurnQueue = new PlayerTurnQueue([player1, player2]);
const bagOfTiles = new RandomBagOfTiles<BaseTile>([]);
const gameState = new BaseGameState(map, playerTurnQueue, bagOfTiles);

const htmlRenderer = new HtmlRenderer();
const html = gameState.getRenderableData(htmlRenderer);

createWindow(html);

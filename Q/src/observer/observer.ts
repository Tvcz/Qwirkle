import { gunzip } from 'zlib';
import { QTile } from '../game/map/tile';
import { RenderableGameState } from '../game/types/gameState.types';

interface Observer<T extends QTile> {
  /**
   * Receives an updated game state which can be used to render the game.
   * @param gameState the game data which is available for observation
   */
  receiveState(gameState: RenderableGameState<T>): void;

  /**
   * Alerts the observer that no more states will be received.
   */
  gameOver(): void;
}

class BaseObserver<T extends QTile> implements Observer<T> {
  gui;
  stateHistory = [];

  constructor() {
    gui = new GUI();
  }

  receiveState(gameState: RenderableGameState<T>) {
    this.saveStateToFile();
    this.gui.update(gameState);
  }

  gameOver() {
    this.gui.showGameOver();
  }
}

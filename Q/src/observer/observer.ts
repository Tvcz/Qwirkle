import puppeteer from 'puppeteer';
import { QTile } from '../game/map/tile';
import { RenderableGameState } from '../game/types/gameState.types';
import { htmlBuilder } from '../game/graphicalRenderer/HtmlRendererUtils/htmlBuilder';
import { RenderProcessGoneEvent } from 'electron';
import { stat } from 'fs/promises';

/**
 * Interface for observing a game.
 * Provides functionality for receiving game state updates and game over
 * notifications.
 */
export interface ObserverAPI<T extends QTile> {
  /**
   * Receives an updated game state which can be used to render the game.
   * @param gameState the game data which is available for observation
   */
  receiveState(gameState: RenderableGameState<T>): void;

  /**
   * Alerts the observer that no more states will be received.
   * @param gameState the final game state data from the referee's perspective
   * @param winnerNames the names of the winners of the game
   * @param eliminatedNames the names of the eliminated players
   */
  gameOver(
    gameState: RenderableGameState<T>,
    winnerNames: string[],
    eliminatedNames: string[]
  ): void;

  /**
   * Moves the observer's current game state to the chronological next state.
   * If there is no next state, the observer's state will not change.
   */
  nextState(): void;

  /**
   * Moves the observer's current game state to the chronological previous state.
   * If there is no previous state, the observer's state will not change.
   */
  previousState(): void;

  /**
   * Saves the current game state as a JState to a specified JSON file.
   */
  saveState(filepath: string): void;
}

export class BaseObserver<T extends QTile> implements ObserverAPI<T> {
  gui;
  stateHistory: RenderableGameState<T>[];
  currenStateIndex: number;

  constructor() {
    gui = new GUI();
    this.stateHistory = [];
    this.currenStateIndex = 0;
  }

  public receiveState(gameState: RenderableGameState<T>) {
    this.saveStateToMemory(gameState);
    this.saveStateToImage(this.stateHistory.length - 1);
    this.updateGUIView();
  }

  private saveStateToMemory(gameState: RenderableGameState<T>) {
    this.stateHistory.push(gameState);
  }

  private saveStateToImage(gameStateIndex: number) {
    const gameState = this.stateHistory[gameStateIndex];
    this.saveHtmlToImage(
      this.toHtmlView(gameState),
      `${gameStateIndex}.png`,
      this.calculateHeightAndWidth(gameState)
    );
  }

  private toHtmlView(gameState: RenderableGameState<T>): string {
    return htmlBuilder(gameState);
  }

  private calculateHeightAndWidth(gameState: RenderableGameState<T>) {
    const dimensions = gameState.mapState.dimensions;
    const width = dimensions.rightmost + 1 - dimensions.leftmost;
    const height = dimensions.topmost + 1 - dimensions.bottommost;
    return { width, height };
  }

  private async saveHtmlToImage(
    html: string,
    outputPath: string,
    widthAndHeight: { width: number; height: number }
  ) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html);

    await page.setViewport(widthAndHeight);

    await page.screenshot({ path: outputPath });

    await browser.close();
  }

  private updateGUIView() {
    this.gui.updateView(
      this.toHtmlView(this.stateHistory[this.currenStateIndex])
    );
  }

  public nextState() {
    if (this.currenStateIndex < this.stateHistory.length - 1) {
      this.currenStateIndex++;
      this.updateGUIView();
    }
  }

  public previousState() {
    if (this.currenStateIndex > 0) {
      this.currenStateIndex--;
      this.updateGUIView();
    }
  }

  private saveStateToJSON(gameState: RenderableGameState<T>) {}

  public gameOver(
    gameState: RenderableGameState<T>,
    winnerNames: string[],
    eliminatedNames: string[]
  ) {
    this.gui.showGameOver(gameState, winnerNames, eliminatedNames);
  }

  private makeGameOverCard(winners: string[], eliminated: string[]): string {
    return '<h1> GAME OVER </h1>';
  }
}

import { ShapeColorTile } from '../game/map/tile';
import {
  RelevantPlayerInfo,
  TilePlacement
} from '../game/types/gameState.types';
import { Strategy } from './strategy';
import { QRuleBook } from '../game/rules/ruleBook';
import { TurnAction } from './turnAction';

/**
 * Interface representing a Player.
 * Players are identified by a unique name, and are abstracted over a Strategy to play the game.
 * The interface provides functionality for setting up a player for a game, making moves, getting new tiles
 */
export interface Player {
  /**
   * Getter method for the player's name
   * @returns the player's name
   */
  name: () => Promise<string>;

  /**
   * Set up the player with the initial map and their starting tiles.
   * @param s The public state of the game
   * @param st The player's starting tiles
   * @returns void
   */
  setUp: (s: RelevantPlayerInfo, st: ShapeColorTile[]) => Promise<void>;

  /**
   * Given the current public game state, which includes the current map, the number of remaining tiles, and the player's tiles, make a move based on the player's strategy.
   * A turn action is one of
   * - pass
   * - ask the referee to replace all of their tiles
   * - requests the extension of the map in the given state with some tile placements
   * @param s The current public game state. Includes the map, number of remaining tiles, and the player's tiles.
   * @returns The turn action that the player wants to take
   */
  takeTurn: (s: RelevantPlayerInfo) => Promise<TurnAction>;

  /**
   * Method to receive a new hand of tiles. The new tiles are added onto whatever tiles the player currently has after their last move
   * @param st The new tiles
   * @returns void
   */
  newTiles: (st: ShapeColorTile[]) => Promise<void>;

  /**
   * Method to alert this Player that they have won the game.
   * @param w boolean, true if the player won, false otherwise
   * @returns void
   */
  win: (w: boolean) => Promise<void>;
}

/**
 * Implementation of a Base Player.
 * The Player takes in their name, strategy, and a rulebook on initialization.
 */
export class BasePlayer implements Player {
  private playerName: string;
  private strategy: Strategy;
  private rulebook: QRuleBook;
  private tiles: ShapeColorTile[];
  private map: TilePlacement[];
  private hasWon: boolean;

  constructor(name: string, strategy: Strategy, rulebook: QRuleBook) {
    this.playerName = name;
    this.strategy = strategy;
    this.rulebook = rulebook;
    this.tiles = [];
    this.map = [];
    this.hasWon = false;
  }

  public async name() {
    return this.playerName;
  }

  public async setUp(s: RelevantPlayerInfo, st: ShapeColorTile[]) {
    this.map = s.mapState;
    this.tiles = st;
  }

  public async takeTurn(s: RelevantPlayerInfo) {
    const { mapState, remainingTilesCount, playerTiles } = s;

    this.tiles = playerTiles;
    this.map = mapState;

    const action = this.strategy.suggestMove(
      this.map,
      this.tiles,
      remainingTilesCount,
      this.rulebook.getPlacementRules()
    );

    this.reduceExistingTiles(action);

    return action;
  }

  private reduceExistingTiles(action: TurnAction) {
    if (action.ofType('PLACE')) {
      this.tiles = this.tiles.filter(
        (playerTile) =>
          !action.getPlacements().find(({ tile }) => playerTile.equals(tile))
      );
    } else if (action.ofType('EXCHANGE')) {
      this.tiles = [];
    }
  }

  public async newTiles(st: T[]) {
    this.tiles = [...this.tiles, ...st];
  }

  public async win(w: boolean) {
    this.hasWon = w;
  }
}

export class SetupExceptionPlayer extends BasePlayer {
  public async setUp(s: RelevantPlayerInfo, st: ShapeColorTile[]) {
    const mapString = JSON.stringify(s.mapState);
    const startingTileString = JSON.stringify(st);
    throw new Error(
      `Setup exception for player ${this.name()} when called with map: ${mapString}, and starting tile ${startingTileString}`
    );
  }
}

export class TurnExceptionPlayer extends BasePlayer {
  public async takeTurn(s: RelevantPlayerInfo): Promise<TurnAction> {
    const stateString = JSON.stringify(s);
    throw new Error(
      `Turn exception for player ${this.name()} when called with state: ${stateString}`
    );
  }
}

export class NewTilesExceptionPlayer<
  T extends ShapeColorTile
> extends BasePlayer {
  public async newTiles(st: T[]) {
    const tilesString = JSON.stringify(st);
    throw new Error(
      `New tiles exception for player ${this.name()} when called with tiles: ${tilesString}`
    );
  }
}

export class WinExceptionPlayer extends BasePlayer {
  public async win(w: boolean) {
    throw new Error(
      `Win exception for player ${this.name()} when called with win: ${w}`
    );
  }
}

abstract class AbstractDelayedTimeoutPlayer extends BasePlayer {
  methodCallCount: number;

  constructor(
    name: string,
    strategy: Strategy,
    rulebook: QRuleBook,
    private readonly methodCallsUntilDelay: number
  ) {
    super(name, strategy, rulebook);
    this.methodCallCount = 0;
  }

  protected async callDelayedTimeoutMethod() {
    this.methodCallCount++;
    if (this.methodCallCount >= this.methodCallsUntilDelay) {
      await new Promise((resolve) => setTimeout(resolve, 500000000));
    }
  }
}

export class DelayedSetupTimeoutPlayer extends AbstractDelayedTimeoutPlayer {
  public async setUp(s: RelevantPlayerInfo, st: ShapeColorTile[]) {
    await this.callDelayedTimeoutMethod();
    super.setUp(s, st);
  }
}

export class DelayedTurnTimeoutPlayer extends AbstractDelayedTimeoutPlayer {
  public async takeTurn(s: RelevantPlayerInfo) {
    await this.callDelayedTimeoutMethod();
    return super.takeTurn(s);
  }
}

export class DelayedNewTilesTimeoutPlayer extends AbstractDelayedTimeoutPlayer {
  public async newTiles(st: T[]) {
    await this.callDelayedTimeoutMethod();
    super.newTiles(st);
  }
}

export class DelayedWinTimeoutPlayer extends AbstractDelayedTimeoutPlayer {
  public async win(w: boolean) {
    await this.callDelayedTimeoutMethod();
    super.win(w);
  }
}

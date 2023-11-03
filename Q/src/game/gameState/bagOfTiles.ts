import { QTile } from '../map/tile';

/**
 * Interface representing a bag of Q Game tiles. Defines the functionality that
 * every bag of tiles used in Q Game must implement. Contains a list of tiles
 * and provides functionality for drawing a tile, returning a tile, and
 * exchanging tiles.
 */
export interface QBagOfTiles<T extends QTile> {
  /**
   * Draws a tile from the bag. Takes from the front of the list of tiles
   * @throws Error if there are no remaining tiles in the bag
   * @returns a tile
   */
  drawTile: () => T;

  /**
   * Returns a tile to the bag. Adds it to the end of the list of tiles
   * @param tile the tile to return to the bag
   */
  returnTile: (tile: T) => void;

  /**
   * Exchanges a tile for a new tile. New tile is drawn from the front of the
   * list of tiles, and exchanged tile is added to the end of the list.
   * @param tile the tile to return to the bag
   * @throws Error if there are no remaining tiles in the bag
   * @returns a new tile from the bag
   */
  exchangeTile: (tile: T) => T;

  /**
   * Gets the number of tiles in the bag.
   * @returns the number of tiles in the bag
   */
  getRemainingCount: () => number;
}

/**
 * Abstract class representing a bag of Q Game tiles. Allows tiles to be drawn,
 * returned, and exchanged, and keeps track of the number of tiles remaining
 */
abstract class AbstractQBagOfTiles<T extends QTile> implements QBagOfTiles<T> {
  protected tiles: T[];

  constructor(tiles: T[]) {
    this.tiles = tiles;
  }

  public drawTile(): T {
    const tile = this.tiles.shift();
    if (!tile) {
      throw new Error('no tiles left to draw');
    }
    return tile;
  }

  public returnTile(tile: T): void {
    this.tiles.push(tile);
  }

  public exchangeTile(tile: T): T {
    this.returnTile(tile);
    return this.drawTile();
  }

  public getRemainingCount(): number {
    return this.tiles.length;
  }
}

/**
 * Class representing a bag of randomly-arranged Q Game tiles
 */
export class RandomBagOfTiles<T extends QTile> extends AbstractQBagOfTiles<T> {
  constructor(tiles: T[]) {
    tiles.sort(() => Math.random() - 0.5);
    super(tiles);
  }
}

/**
 * Class representing a bag of Q Game tiles arranged in the order given
 */
export class BaseBagOfTiles<T extends QTile> extends AbstractQBagOfTiles<T> {
  constructor(tiles: T[]) {
    super(tiles);
  }
}

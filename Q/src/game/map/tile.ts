import { Shape, Color } from '../types/map.types';

/**
 * Interface representing a QTile that has a Shape and Color field.
 * Provides getters and equals methods for those properties.
 */
export interface ShapeColorTile {
  /**
   * Check whether the given ShapeColorTile is equal to this ShapeColorTile.
   * @param tile A ShapeColorTile object to check equality against.
   * @returns boolean of whether the Tiles are the same.
   */
  equals: (tile: ShapeColorTile) => boolean;

  /**
   * Getter method for the shape field.
   * @returns a Shape type
   */
  getShape: () => Shape;

  /**
   * Checks whether the given ShapeColor tile has the same shape as this one.
   * @param tile A ShapeColorTile to compare with.
   * @returns boolean of whether the shapes are the same.
   */
  sameShape: (tile: ShapeColorTile) => boolean;

  /**
   * Getter method for the color field.
   * @returns a Color type
   */
  getColor: () => Color;

  /**
   * Checks whether the given ShapeColorTile has the same color as this one.
   * @param tile A ShapeColorTile to compare with.
   * @returns boolean of whether the colors are the same.
   */
  sameColor: (tile: ShapeColorTile) => boolean;
}

/**
 * A tile that implements the ShapeColorTile interface
 */
export class BaseTile implements ShapeColorTile {
  private readonly shape: Shape;
  private readonly color: Color;

  constructor(shape: Shape, color: Color) {
    this.shape = shape;
    this.color = color;
  }

  public equals(tile: ShapeColorTile): boolean {
    if (!(tile instanceof BaseTile)) {
      return false;
    }
    return this.sameShape(tile) && this.sameColor(tile);
  }

  public getShape(): Shape {
    return this.shape;
  }

  public sameShape(tile: ShapeColorTile): boolean {
    return this.shape === tile.getShape();
  }

  public getColor(): Color {
    return this.color;
  }

  public sameColor(tile: ShapeColorTile): boolean {
    return this.color === tile.getColor();
  }
}

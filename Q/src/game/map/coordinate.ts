import { util } from "typescript-collections";

/**
 * Interface representing a coordinate position
 */
interface QCoordinate {
  /**
   * Gets the coordinate x and y values
   * @returns an object containing the x and y values of the coordinate
   */
  getCoordinate: () => Readonly<{ x: number; y: number }>;

  /**
   * Creates a string representation of the coordinate
   * @returns a string representing the coordinate
   */
  toString: () => string;

  /**
   * Computes a list of coordinates that neighbor this coordinate on each side
   * @returns an object containing the top, right, bottom, and left coordinates
   */
  getNeighbors: () => {
    top: Coordinate;
    right: Coordinate;
    bottom: Coordinate;
    left: Coordinate;
  };

  /**
   * Check whether the given QCoordinate is equal to this QCoordinate. Equality here means that they have the same x and y values.
   * @param tile A QCoordinate object to check equality against.
   * @returns boolean of whether the Coordinates are the same.
   */
  equals: (coordinate: QCoordinate) => boolean;
}

/**
 * Class representing a position on the map of the Q Game.
 * Made of an x and y coordinate.
 */
class Coordinate implements QCoordinate {
  private x: Readonly<number>;
  private y: Readonly<number>;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public getCoordinate() {
    return { x: this.x, y: this.y };
  }

  public toString() {
    return util.makeString(this);
  }

  public getNeighbors() {
    return {
      top: new Coordinate(this.x, this.y + 1),
      right: new Coordinate(this.x + 1, this.y),
      bottom: new Coordinate(this.x, this.y - 1),
      left: new Coordinate(this.x - 1, this.y),
    };
  }

  public equals(coordinate: QCoordinate): boolean {
    if (!(coordinate instanceof Coordinate)) {
      return false;
    }
    return (
      coordinate.getCoordinate().x === this.x &&
      coordinate.getCoordinate().y === this.y
    );
  }
}

export default Coordinate;

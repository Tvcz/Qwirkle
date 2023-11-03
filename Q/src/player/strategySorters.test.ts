import { Dictionary } from 'typescript-collections';
import Coordinate from '../game/map/coordinate';
import {
  sortCoordinatesByMostNeighbors,
  sortCoordinatesByRowColumnOrder
} from './strategySorters';
import { BaseTile } from '../game/map/tile';

describe('tests for strategy sorter functions', () => {
  test('sortCoordinatesByRowColumnOrder returns a positive value if first coordinates row is greater than the second coordinates column', () => {
    // Arrange
    // Act
    const val = sortCoordinatesByRowColumnOrder(
      new Coordinate(0, 3),
      new Coordinate(0, 1)
    );

    // Assert
    expect(val).toBeGreaterThan(0);
  });
  test('sortCoordinatesByRowColumnOrder returns a negative value if first coordinates row is less than the second coordinates row', () => {
    // Arrange
    // Act
    const val = sortCoordinatesByRowColumnOrder(
      new Coordinate(0, 1),
      new Coordinate(0, 4)
    );

    // Assert
    expect(val).toBeLessThan(0);
  });
  test('sortCoordinatesByRowColumnOrder returns a positive value if the rows are equal, and first coordinates column is greater than the second coordinates row', () => {
    // Arrange
    // Act
    const val = sortCoordinatesByRowColumnOrder(
      new Coordinate(3, 0),
      new Coordinate(0, 0)
    );

    // Assert
    expect(val).toBeGreaterThan(0);
  });
  test('sortCoordinatesByRowColumnOrder returns a positive value if the rows are equal, and first coordinates column is less than the second coordinates row', () => {
    // Arrange
    // Act
    const val = sortCoordinatesByRowColumnOrder(
      new Coordinate(0, 0),
      new Coordinate(3, 0)
    );

    // Assert
    expect(val).toBeLessThan(0);
  });
  test('sortCoordinatesByRowColumnOrder returns 0 if the rows and columns of both coordinates are equal', () => {
    // Arrange
    // Act
    const val = sortCoordinatesByRowColumnOrder(
      new Coordinate(0, 0),
      new Coordinate(0, 0)
    );

    // Assert
    expect(val).toBe(0);
  });
  test('sortCoordinatesByMostNeighbors returns a negative number if coord1 has more neighbors than coord2', () => {
    // Arrange
    const map = new Dictionary<Coordinate, BaseTile>();
    map.setValue(new Coordinate(-1, 0), new BaseTile('8star', 'red'));
    map.setValue(new Coordinate(1, 0), new BaseTile('8star', 'red'));
    map.setValue(new Coordinate(0, 1), new BaseTile('8star', 'red'));

    map.setValue(new Coordinate(11, 10), new BaseTile('8star', 'red'));
    map.setValue(new Coordinate(9, 10), new BaseTile('8star', 'red'));

    const getTile = (coord: Coordinate) => map.getValue(coord);

    // Act
    const val = sortCoordinatesByMostNeighbors(
      new Coordinate(0, 0),
      new Coordinate(10, 10),
      getTile
    );

    // Assert
    expect(val).toBeLessThan(0);
  });
  test('sortCoordinatesByMostNeighbors returns a positive number if coord1 has less neighbors than coord2', () => {
    // Arrange
    const map = new Dictionary<Coordinate, BaseTile>();
    map.setValue(new Coordinate(-1, 0), new BaseTile('8star', 'red'));
    map.setValue(new Coordinate(1, 0), new BaseTile('8star', 'red'));
    map.setValue(new Coordinate(0, 1), new BaseTile('8star', 'red'));

    map.setValue(new Coordinate(11, 10), new BaseTile('8star', 'red'));
    map.setValue(new Coordinate(9, 10), new BaseTile('8star', 'red'));

    const getTile = (coord: Coordinate) => map.getValue(coord);

    // Act
    const val = sortCoordinatesByMostNeighbors(
      new Coordinate(10, 10),
      new Coordinate(0, 0),
      getTile
    );

    // Assert
    expect(val).toBeGreaterThan(0);
  });
  test('sortCoordinatesByMostNeighbors returns the result of sortCoordinatesByRowColumnOrder if the coordinates have the same number of neighbors', () => {
    // Arrange
    const map = new Dictionary<Coordinate, BaseTile>();
    map.setValue(new Coordinate(-1, 0), new BaseTile('8star', 'red'));
    map.setValue(new Coordinate(1, 0), new BaseTile('8star', 'red'));
    map.setValue(new Coordinate(0, 1), new BaseTile('8star', 'red'));

    map.setValue(new Coordinate(11, 10), new BaseTile('8star', 'red'));
    map.setValue(new Coordinate(9, 10), new BaseTile('8star', 'red'));
    map.setValue(new Coordinate(10, 9), new BaseTile('8star', 'red'));

    const getTile = (coord: Coordinate) => map.getValue(coord);

    const coord1 = new Coordinate(10, 10);
    const coord2 = new Coordinate(0, 0);

    // Act
    const val = sortCoordinatesByMostNeighbors(coord1, coord2, getTile);

    // Assert
    expect(val).toBeGreaterThan(0);
  });
});

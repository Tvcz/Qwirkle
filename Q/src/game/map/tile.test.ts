import { BaseTile, QTile } from './tile';

describe('tests for BaseTile class', () => {
  test('BaseTile equals method is false when given a non BaseTile', () => {
    // Arrange
    const tile = new BaseTile('8star', 'blue');

    class SomeTile implements QTile {
      equals: (tile: QTile) => boolean;
    }

    // Act
    const equalsDiffTileType = tile.equals(new SomeTile());

    // Assert
    expect(equalsDiffTileType).toBe(false);
  });
  test("BaseTile equals method is false if shape doesn't match", () => {
    // Arrange
    const tile = new BaseTile('8star', 'red');

    // Act
    const equalsDiffShape = tile.equals(new BaseTile('circle', 'red'));

    // Assert
    expect(equalsDiffShape).toBe(false);
  });
  test("BaseTile equals method is false if color doesn't match", () => {
    // Arrange
    const tile = new BaseTile('8star', 'red');

    // Act
    const equalsDiffColor = tile.equals(new BaseTile('8star', 'blue'));

    // Assert
    expect(equalsDiffColor).toBe(false);
  });
  test('BaseTile equals method is true if color and shape match', () => {
    // Arrange
    const tile = new BaseTile('8star', 'red');

    // Act
    const equalsDiffColor = tile.equals(new BaseTile('8star', 'red'));

    // Assert
    expect(equalsDiffColor).toBe(true);
  });
  test('getShape method returns the Tiles shape', () => {
    // Arrange
    const tile = new BaseTile('clover', 'blue');

    // Act
    const shape = tile.getShape();

    // Assert
    expect(shape).toBe('clover');
  });
  test('sameShape method returns true if the shape of given tile is the same', () => {
    // Arrange
    const tile = new BaseTile('8star', 'blue');

    // Act
    const hasSameShape = tile.sameShape(new BaseTile('8star', 'red'));

    // Assert
    expect(hasSameShape).toBe(true);
  });
  test('sameShape method returns false if the shape of given tile is not the same', () => {
    // Arrange
    const tile = new BaseTile('8star', 'blue');

    // Act
    const hasSameShape = tile.sameShape(new BaseTile('clover', 'red'));

    // Assert
    expect(hasSameShape).toBe(false);
  });
  test('getColor method returns the Tiles color', () => {
    // Arrange
    const tile = new BaseTile('clover', 'blue');

    // Act
    const color = tile.getColor();

    // Assert
    expect(color).toBe('blue');
  });
  test('sameColor method returns true if the color of given tile is the same', () => {
    // Arrange
    const tile = new BaseTile('circle', 'red');

    // Act
    const hasSameColor = tile.sameColor(new BaseTile('8star', 'red'));

    // Assert
    expect(hasSameColor).toBe(true);
  });
  test('sameColor method returns false if the color of given tile is not the same', () => {
    // Arrange
    const tile = new BaseTile('circle', 'blue');

    // Act
    const hasSameColor = tile.sameColor(new BaseTile('8star', 'red'));

    // Assert
    expect(hasSameColor).toBe(false);
  });
});

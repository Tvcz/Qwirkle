import { RandomBagOfTiles } from './bagOfTiles';
import { BaseTile, ShapeColorTile } from '../map/tile';

describe('Tests for AbstractQBagOfTiles methods', () => {
  test('can draw a tile', () => {
    // Arrange
    const startingTile = new BaseTile('square', 'red');
    const bagOfTiles = new RandomBagOfTiles([startingTile]);
    const startingCount = bagOfTiles.getRemainingCount();

    // Act
    const drawnTile = bagOfTiles.drawTile();

    // Assert
    expect(drawnTile).toBe(startingTile);
    expect(bagOfTiles.getRemainingCount()).toBe(startingCount - 1);
  });
  test('cannot draw a tile when the bag is empty', () => {
    // Arrange
    const bagOfTiles = new RandomBagOfTiles([]);

    // Act, Assert
    expect(() => bagOfTiles.drawTile()).toThrow();
    expect(bagOfTiles.getRemainingCount()).toBe(0);
  });
  test('can return a tile', () => {
    // Arrange
    const startingTile = new BaseTile('square', 'red');
    const bagOfTiles = new RandomBagOfTiles<ShapeColorTile>([]);
    const startingCount = bagOfTiles.getRemainingCount();

    // Act
    bagOfTiles.returnTile(startingTile);

    // Assert
    expect(bagOfTiles.getRemainingCount()).toBe(startingCount + 1);
    expect(bagOfTiles.drawTile()).toBe(startingTile);
  });
  test('can exchange a tile', () => {
    // Arrange
    const startingTile = new BaseTile('square', 'red');
    const bagOfTiles = new RandomBagOfTiles<ShapeColorTile>([]);
    const startingCount = bagOfTiles.getRemainingCount();

    // Act, Assert
    expect(bagOfTiles.exchangeTile(startingTile)).toBe(startingTile);
    expect(bagOfTiles.getRemainingCount()).toBe(startingCount);
  });
  test('can get the remaining number of tiles', () => {
    // Arrange
    const startingTile = new BaseTile('square', 'red');
    const emptyBagOfTiles = new RandomBagOfTiles<ShapeColorTile>([]);
    const bagOf3Tiles = new RandomBagOfTiles<ShapeColorTile>([
      startingTile,
      startingTile,
      startingTile
    ]);

    // Act, Assert
    for (let i = 0; i < 3; i++) {
      expect(emptyBagOfTiles.getRemainingCount()).toBe(i);
      emptyBagOfTiles.returnTile(startingTile);
      expect(bagOf3Tiles.getRemainingCount()).toBe(3 - i);
      bagOf3Tiles.drawTile();
    }
  });
});

describe('Tests for RandomBagOfTiles methods', () => {
  // mock randomness so that it can be tested reliably
  beforeAll(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);
  });
  // destroy the randomness mock
  afterAll(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
  });
  test('tiles are randomly arranged', () => {
    // Arrange
    const redSquareTile = new BaseTile('square', 'red');
    const blueCircleTile = new BaseTile('circle', 'blue');
    const greenCloverTile = new BaseTile('clover', 'green');
    const bagOfTiles = new RandomBagOfTiles([
      redSquareTile,
      blueCircleTile,
      greenCloverTile
    ]);

    // Act, Assert
    expect(bagOfTiles.drawTile()).toBe(greenCloverTile);
    expect(bagOfTiles.drawTile()).toBe(blueCircleTile);
    expect(bagOfTiles.drawTile()).toBe(redSquareTile);
  });
});

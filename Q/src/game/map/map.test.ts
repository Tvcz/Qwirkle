import Coordinate from './coordinate';
import TileMap from './map';
import { mustMatchNeighboringShapesOrColors } from '../rules/placementRules';
import { BaseTile } from './tile';

describe('Tests for AbstractMapClass methods', () => {
  test('placeTile method adds the given tile to the map if it satisfies default rule conditions', () => {
    // Arrange
    const startingTile = new BaseTile('square', 'red');
    const startingPosition = new Coordinate(0, 0);
    const map = new TileMap([
      { tile: startingTile, coordinate: startingPosition }
    ]);

    const tileToPlace = new BaseTile('circle', 'blue');
    const coordinateToPlace = new Coordinate(1, 0);

    // Act
    map.placeTile(tileToPlace, coordinateToPlace);

    // Assert
    const newTile = map.getTile(coordinateToPlace);
    expect(newTile).toBe(tileToPlace);
  });
  test('placeTile method throws error if the coordinate already has a tile', () => {
    // Arrange
    const startingTile = new BaseTile('square', 'red');
    const startingPosition = new Coordinate(0, 0);
    const map = new TileMap([
      { tile: startingTile, coordinate: startingPosition }
    ]);

    const tileToPlace = new BaseTile('circle', 'blue');
    const coordinateToPlace = new Coordinate(0, 0);

    // Act, Assert
    expect(() => map.placeTile(tileToPlace, coordinateToPlace)).toThrow();
  });
  test('placeTile method extends leftmost dimension to the left when adding a tile past the current bounds', () => {
    // Arrange
    const startingTile = new BaseTile('square', 'red');
    const startingPosition = new Coordinate(0, 0);
    const map = new TileMap([
      { tile: startingTile, coordinate: startingPosition }
    ]);

    const tileToPlace = new BaseTile('square', 'blue');
    const coordinateToPlace = new Coordinate(-1, 0);

    // Act
    map.placeTile(tileToPlace, coordinateToPlace);

    // Assert
    expect(map.getDimensions().leftmost).toBe(-1);
  });
  test('placeTile method extends rightmost dimension to the right when adding a tile past the current bounds', () => {
    // Arrange
    const startingTile = new BaseTile('square', 'red');
    const startingPosition = new Coordinate(0, 0);
    const map = new TileMap([
      { tile: startingTile, coordinate: startingPosition }
    ]);

    const tileToPlace = new BaseTile('square', 'blue');
    const coordinateToPlace = new Coordinate(1, 0);

    // Act
    map.placeTile(tileToPlace, coordinateToPlace);

    // Assert
    expect(map.getDimensions().rightmost).toBe(1);
  });
  test('placeTile method extends topmost dimension up when adding a tile past the current bounds', () => {
    // Arrange
    const startingTile = new BaseTile('square', 'red');
    const startingPosition = new Coordinate(0, 0);
    const map = new TileMap([
      { tile: startingTile, coordinate: startingPosition }
    ]);

    const tileToPlace = new BaseTile('square', 'blue');
    const coordinateToPlace = new Coordinate(0, 1);

    // Act
    map.placeTile(tileToPlace, coordinateToPlace);

    // Assert
    expect(map.getDimensions().topmost).toBe(1);
  });
  test('placeTile method extends bottomMost dimension down when adding a tile past the current bounds', () => {
    // Arrange
    const startingTile = new BaseTile('square', 'red');
    const startingPosition = new Coordinate(0, 0);
    const map = new TileMap([
      { tile: startingTile, coordinate: startingPosition }
    ]);

    const tileToPlace = new BaseTile('square', 'blue');
    const coordinateToPlace = new Coordinate(0, -1);

    // Act
    map.placeTile(tileToPlace, coordinateToPlace);

    // Assert
    expect(map.getDimensions().bottommost).toBe(-1);
  });
  test('getAllValidPositions returns a list of the valid coordinate positions for the given rules plus the default rules', () => {
    // Arrange
    const startingTile = new BaseTile('square', 'red');
    const startingPosition = new Coordinate(0, 0);
    const map = new TileMap([
      { tile: startingTile, coordinate: startingPosition }
    ]);
    map.placeTile(new BaseTile('square', 'blue'), new Coordinate(1, 0));
    map.placeTile(new BaseTile('diamond', 'blue'), new Coordinate(1, 1));

    // Act
    const validPositions = map.getAllValidPlacements(
      new BaseTile('square', 'purple'),
      [mustMatchNeighboringShapesOrColors]
    );

    // Assert
    const validCoordinates = [
      new Coordinate(-1, 0),
      new Coordinate(0, -1),
      new Coordinate(1, -1),
      new Coordinate(2, 0)
    ];
    validCoordinates.forEach((coordinate) => {
      const { x: x1, y: y1 } = coordinate.getCoordinate();
      expect(
        validPositions.some((coord) => {
          const { x: x2, y: y2 } = coord.getCoordinate();
          return x1 === x2 && y1 === y2;
        })
      ).toBe(true);
    });
    expect(validPositions.length).toBe(validCoordinates.length);
  });
  test('getTile method returns the tile at the given coordinate', () => {
    // Arrange
    const startingTile = new BaseTile('square', 'red');
    const startingPosition = new Coordinate(0, 0);
    const map = new TileMap([
      { tile: startingTile, coordinate: startingPosition }
    ]);

    // Act
    const tile = map.getTile(new Coordinate(0, 0));

    // Assert
    expect(tile).toBe(startingTile);
  });
  test('getTile method returns undefined if there is no tile at the given coordinate', () => {
    // Arrange
    const startingTile = new BaseTile('square', 'red');
    const startingPosition = new Coordinate(0, 0);
    const map = new TileMap([
      { tile: startingTile, coordinate: startingPosition }
    ]);

    // Act
    const tile = map.getTile(new Coordinate(1, 0));

    // Assert
    expect(tile).toBeUndefined();
  });
  test('getDimensions returns all dimensions as 0 when initialized', () => {
    // Arrange
    const startingTile = new BaseTile('square', 'red');
    const startingPosition = new Coordinate(0, 0);
    const map = new TileMap([
      { tile: startingTile, coordinate: startingPosition }
    ]);

    // Act
    const { leftmost, rightmost, topmost, bottommost } = map.getDimensions();

    // Assert
    expect(leftmost).toBe(0);
    expect(rightmost).toBe(0);
    expect(topmost).toBe(0);
    expect(bottommost).toBe(0);
  });
  test('getAllPlacements gets a list of tile placements in the map', () => {
    // Arrange
    const tile = new BaseTile('square', 'red');
    const startingPosition = new Coordinate(0, 0);
    const map = new TileMap([{ tile: tile, coordinate: startingPosition }]);
    map.placeTile(tile, new Coordinate(1, 0));
    map.placeTile(tile, new Coordinate(2, 0));
    map.placeTile(tile, new Coordinate(3, 0));

    // Act
    const allPlacements = map.getAllPlacements();

    // Assert
    expect(allPlacements.length).toBe(4);
    expect(
      allPlacements.some(
        (placement) =>
          placement.tile.equals(tile) &&
          placement.coordinate.equals(new Coordinate(0, 0))
      )
    ).toBe(true);
    expect(
      allPlacements.some(
        (placement) =>
          placement.tile.equals(tile) &&
          placement.coordinate.equals(new Coordinate(1, 0))
      )
    ).toBe(true);
    expect(
      allPlacements.some(
        (placement) =>
          placement.tile.equals(tile) &&
          placement.coordinate.equals(new Coordinate(2, 0))
      )
    ).toBe(true);
    expect(
      allPlacements.some(
        (placement) =>
          placement.tile.equals(tile) &&
          placement.coordinate.equals(new Coordinate(3, 0))
      )
    ).toBe(true);
  });
});

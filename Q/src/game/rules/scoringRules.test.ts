import Coordinate from '../map/coordinate';
import BaseMap from '../map/map';
import { BaseTile } from '../map/tile';
import { TilePlacement } from '../types/gameState.types';
import { Shape, Color } from '../types/map.types';
import {
  pointPerTileInSequence,
  pointPerTilePlaced,
  pointsForPlayingAllTiles,
  pointsPerQ
} from './scoringRules';

const BONUS_POINT_AMOUNT = 6;

const ColorListMock = jest.requireMock('../types/map.types');
jest.mock('../types/map.types', () => {
  const original = jest.requireActual('../types/map.types');
  return {
    BaseTile: original.BaseTile,
    colorList: ['red', 'green', 'blue'],
    shapeList: ['square', 'circle', 'diamond']
  };
});

const arrangeGameState = (
  mapTiles: TilePlacement<BaseTile>[],
  tilePlacements: TilePlacement<BaseTile>[]
) => {
  // Arrange
  const map = new BaseMap(mapTiles);
  const pointsPerQRule = pointsPerQ(BONUS_POINT_AMOUNT);

  // Act
  const score = pointsPerQRule(
    tilePlacements,
    (coord: Coordinate) => map.getTile(coord),
    []
  );

  return score;
};

const createTilePlacement = (
  shape: Shape,
  color: Color,
  x: number,
  y: number
) => {
  return {
    tile: new BaseTile(shape, color),
    coordinate: new Coordinate(x, y)
  };
};

describe('tests for scoring rules', () => {
  beforeEach(() => {
    ColorListMock.colorList = ['red', 'green', 'blue'];
  });
  test("pointsPerQ returns bonus point amount for a color Q that's by itself in a row", () => {
    // Arrange, Act
    const mapTiles = [
      createTilePlacement('square', 'blue', 1, 0),
      createTilePlacement('square', 'green', 2, 0)
    ];
    const tilePlacements = [createTilePlacement('square', 'red', 0, 0)];

    const score = arrangeGameState(mapTiles, tilePlacements);

    // Assert
    expect(score).toBe(BONUS_POINT_AMOUNT);
  });
  test('pointsPerQ returns 0 points for a color Qs that has an extra green tile', () => {
    // Arrange, Act
    const mapTiles = [
      createTilePlacement('square', 'blue', 1, 0),
      createTilePlacement('square', 'green', 2, 0),
      createTilePlacement('square', 'green', -1, 0)
    ];
    const tilePlacements = [createTilePlacement('square', 'red', 0, 0)];

    const score = arrangeGameState(mapTiles, tilePlacements);
    // Assert
    expect(score).toBe(0);
  });
  test('pointsPerQ returns bonus point amount for a color Q that has an extra tile but not in the same row', () => {
    // Arrange, Act
    const mapTiles = [
      createTilePlacement('square', 'blue', 1, 0),
      createTilePlacement('square', 'green', 2, 0),
      createTilePlacement('square', 'green', 0, -1)
    ];
    const tilePlacements = [createTilePlacement('square', 'red', 0, 0)];

    const score = arrangeGameState(mapTiles, tilePlacements);
    // Assert
    expect(score).toBe(BONUS_POINT_AMOUNT);
  });
  test('pointsPerQ returns 0 points for creating and then adding extra tiles to the a Q in one tile placement', () => {
    const mapTiles = [
      createTilePlacement('square', 'blue', 1, 0),
      createTilePlacement('square', 'green', 2, 0)
    ];
    const tilePlacements = [
      createTilePlacement('square', 'red', 0, 0),
      createTilePlacement('square', 'red', 3, 0)
    ];
    const score = arrangeGameState(mapTiles, tilePlacements);
    // Assert
    expect(score).toBe(0);
  });
  test('pointsPerQ returns bonus point amount times 2 for one tile placement that makes a Q in its row and column', () => {
    const mapTiles = [
      createTilePlacement('square', 'blue', 1, 0),
      createTilePlacement('square', 'green', -1, 0),
      createTilePlacement('square', 'blue', 0, 1),
      createTilePlacement('square', 'green', 0, -1)
    ];
    const tilePlacements = [createTilePlacement('square', 'red', 0, 0)];
    const score = arrangeGameState(mapTiles, tilePlacements);
    // Assert
    expect(score).toBe(BONUS_POINT_AMOUNT * 2);
  });
  test('pointsPerQ returns bonus point amount times 3 for creating 3 Qs in different rows and columns from 3 tile placements', () => {
    const mapTiles = [
      createTilePlacement('square', 'red', 0, 0),
      createTilePlacement('square', 'blue', 0, 1),
      createTilePlacement('square', 'green', -1, 0),
      createTilePlacement('square', 'blue', -1, -1)
    ];
    const tilePlacements = [
      createTilePlacement('square', 'green', 0, 2),
      createTilePlacement('square', 'blue', 1, 0),
      createTilePlacement('square', 'red', -1, -2)
    ];
    const score = arrangeGameState(mapTiles, tilePlacements);

    // Assert
    expect(score).toBe(BONUS_POINT_AMOUNT * 3);
  });
  test('pointsPerQ returns bonus point amount for a single shape Q in a row', () => {
    const mapTiles = [
      createTilePlacement('square', 'red', 0, 0),
      createTilePlacement('circle', 'red', 1, 0)
    ];
    const tilePlacements = [createTilePlacement('diamond', 'red', 2, 0)];
    const score = arrangeGameState(mapTiles, tilePlacements);

    // Assert
    expect(score).toBe(BONUS_POINT_AMOUNT);
  });
  test('pointsPerQ returns bonus point amount for a single shape Q in a column', () => {
    const mapTiles = [
      createTilePlacement('circle', 'red', 0, 0),
      createTilePlacement('square', 'red', 0, -1)
    ];
    const tilePlacements = [createTilePlacement('diamond', 'red', 0, 1)];
    const score = arrangeGameState(mapTiles, tilePlacements);

    // Assert
    expect(score).toBe(BONUS_POINT_AMOUNT);
  });
  test('pointsPerQ returns 0 points for a shape Q that has more tiles than necessary', () => {
    const mapTiles = [
      createTilePlacement('circle', 'red', 0, 0),
      createTilePlacement('square', 'red', 0, -1)
    ];
    const tilePlacements = [
      createTilePlacement('diamond', 'red', 0, 1),
      createTilePlacement('diamond', 'red', 0, -2)
    ];
    const score = arrangeGameState(mapTiles, tilePlacements);

    // Assert
    expect(score).toBe(0);
  });
  test('pointsPerQ returns bonus point amount times 3 for 3 Qs created in one tile placement', () => {
    const mapTiles = [
      createTilePlacement('circle', 'red', 0, 0),
      createTilePlacement('square', 'red', 1, 0),
      createTilePlacement('diamond', 'red', 0, 1),
      createTilePlacement('circle', 'red', 0, -1),
      createTilePlacement('square', 'red', -1, -1)
    ];
    const tilePlacements = [
      createTilePlacement('diamond', 'red', -1, 0),
      createTilePlacement('circle', 'red', -1, 1),
      createTilePlacement('square', 'red', -2, 1)
    ];
    const score = arrangeGameState(mapTiles, tilePlacements);

    // Assert
    expect(score).toBe(BONUS_POINT_AMOUNT * 3);
  });
  test('pointsPerQ returns bonus point amount times 2 for color Q in row and shape Q in column of same tile', () => {
    const mapTiles = [
      createTilePlacement('square', 'red', -1, 0),
      createTilePlacement('circle', 'red', 1, 0),
      createTilePlacement('diamond', 'blue', 0, 1),
      createTilePlacement('diamond', 'green', 0, -1)
    ];
    const tilePlacements = [createTilePlacement('diamond', 'red', 0, 0)];
    const score = arrangeGameState(mapTiles, tilePlacements);

    // Assert
    expect(score).toBe(BONUS_POINT_AMOUNT * 2);
  });
  test('pointsPerTilePlaced returns a point per tile in tilePlacements', () => {
    // Arrange
    const map = new BaseMap([]);
    const tilePlacements = [
      createTilePlacement('circle', 'red', 0, 0),
      createTilePlacement('circle', 'red', 1, 0),
      createTilePlacement('circle', 'red', 3, 0)
    ];

    // Act
    const score = pointPerTilePlaced(
      tilePlacements,
      (coord: Coordinate) => map.getTile(coord),
      []
    );

    // Assert
    expect(score).toBe(3);
  });
  test('pointsPerTilePlaced returns 0 if no tiles in tilePlacements', () => {
    // Arrange
    const map = new BaseMap([]);
    const tilePlacements = [];

    // Act
    const score = pointPerTilePlaced(
      tilePlacements,
      (coord: Coordinate) => map.getTile(coord),
      []
    );

    // Assert
    expect(score).toBe(0);
  });
  test('pointPerTileInSequence returns 3 point for a tile placed into a sequence of 3 in a row', () => {
    // Arrange
    const map = new BaseMap([
      createTilePlacement('square', 'red', 0, 0),
      createTilePlacement('diamond', 'blue', 0, 1)
    ]);
    const tilePlacements = [createTilePlacement('circle', 'green', 0, 2)];

    // Act
    const score = pointPerTileInSequence(
      tilePlacements,
      (coord: Coordinate) => map.getTile(coord),
      []
    );

    // Assert
    expect(score).toBe(3);
  });
  test('pointPerTileInSequence returns 3 point for a tile placed into a sequence of 3 in a column', () => {
    // Arrange
    const map = new BaseMap([
      createTilePlacement('square', 'red', 1, 0),
      createTilePlacement('diamond', 'blue', 0, 0)
    ]);
    const tilePlacements = [createTilePlacement('circle', 'green', -1, 0)];

    // Act
    const score = pointPerTileInSequence(
      tilePlacements,
      (coord: Coordinate) => map.getTile(coord),
      []
    );

    // Assert
    expect(score).toBe(3);
  });
  test('pointPerTileInSequence returns 5 points for tile placed into two sequences of 2 and 3', () => {
    // Arrange
    const map = new BaseMap([
      createTilePlacement('square', 'red', 1, 0),
      createTilePlacement('diamond', 'blue', 2, 0),
      createTilePlacement('diamond', 'green', 0, 1)
    ]);
    const tilePlacements = [createTilePlacement('circle', 'green', 0, 0)];

    // Act
    const score = pointPerTileInSequence(
      tilePlacements,
      (coord: Coordinate) => map.getTile(coord),
      []
    );

    // Assert
    expect(score).toBe(5);
  });
  test('pointPerTileInSequence returns 10 points for tile placed into a sequence of 10', () => {
    // Arrange
    const map = new BaseMap([
      createTilePlacement('square', 'red', 1, 0),
      createTilePlacement('diamond', 'blue', 2, 0),
      createTilePlacement('diamond', 'blue', 3, 0),
      createTilePlacement('diamond', 'blue', 4, 0),
      createTilePlacement('diamond', 'blue', 5, 0),
      createTilePlacement('diamond', 'blue', 6, 0),
      createTilePlacement('diamond', 'blue', 7, 0),
      createTilePlacement('diamond', 'blue', 8, 0),
      createTilePlacement('diamond', 'blue', 9, 0)
    ]);
    const tilePlacements = [createTilePlacement('circle', 'green', 0, 0)];

    // Act
    const score = pointPerTileInSequence(
      tilePlacements,
      (coord: Coordinate) => map.getTile(coord),
      []
    );

    // Assert
    expect(score).toBe(10);
  });
  test('pointPerTileInSequence returns 4 points for placing two tiles in a sequence of 4', () => {
    // Arrange
    const map = new BaseMap([
      createTilePlacement('square', 'red', 1, 0),
      createTilePlacement('diamond', 'blue', 2, 0)
    ]);
    const tilePlacements = [
      createTilePlacement('circle', 'green', 0, 0),
      createTilePlacement('diamond', 'blue', 3, 0)
    ];

    // Act
    const score = pointPerTileInSequence(
      tilePlacements,
      (coord: Coordinate) => map.getTile(coord),
      []
    );

    // Assert
    expect(score).toBe(4);
  });
  test('pointPerTileInSequence returns 8 points for placing four tiles in two sequence of 4', () => {
    // Arrange
    const map = new BaseMap([
      createTilePlacement('square', 'red', 1, 0),
      createTilePlacement('diamond', 'blue', 2, 0),
      createTilePlacement('diamond', 'blue', 2, 1)
    ]);
    const tilePlacements = [
      createTilePlacement('circle', 'green', 0, 0),
      createTilePlacement('diamond', 'blue', 3, 0),
      createTilePlacement('diamond', 'blue', 2, 2),
      createTilePlacement('diamond', 'blue', 2, -1)
    ];

    // Act
    const score = pointPerTileInSequence(
      tilePlacements,
      (coord: Coordinate) => map.getTile(coord),
      []
    );

    // Assert
    expect(score).toBe(8);
  });
  test('pointPerTileInSequence returns 4 for placing three tiles onto a map with one tile', () => {
    // Arrange
    const map = new BaseMap([
      { tile: new BaseTile('circle', 'red'), coordinate: new Coordinate(0, 0) }
    ]);
    const tilePlacements = [
      createTilePlacement('square', 'red', 1, 0),
      createTilePlacement('square', 'red', 2, 0),
      createTilePlacement('square', 'red', 3, 0)
    ];

    // Act
    const score = pointPerTileInSequence(
      tilePlacements,
      (coord: Coordinate) => map.getTile(coord),
      []
    );

    // Assert
    expect(score).toBe(4);
  });
  test('pointsForPlayingAllTiles returns bonus point amount if player placed all of their tiles', () => {
    // Arrange
    const map = new BaseMap([]);
    const tilePlacements = [
      createTilePlacement('square', 'red', 0, 0),
      createTilePlacement('square', 'red', 0, 1),
      createTilePlacement('square', 'red', 0, 2)
    ];
    const playerTiles = [
      new BaseTile('circle', 'blue'),
      new BaseTile('circle', 'blue'),
      new BaseTile('circle', 'blue')
    ];
    const pointsForPlayingAllTilesRule =
      pointsForPlayingAllTiles(BONUS_POINT_AMOUNT);

    // Act
    const score = pointsForPlayingAllTilesRule(
      tilePlacements,
      (coord: Coordinate) => map.getTile(coord),
      playerTiles
    );

    // Assert
    expect(score).toBe(BONUS_POINT_AMOUNT);
  });
  test('pointsForPlayingAllTiles returns 0 points if player did not place all of their tiles', () => {
    // Arrange
    const map = new BaseMap([]);
    const tilePlacements = [
      createTilePlacement('square', 'red', 0, 0),
      createTilePlacement('square', 'red', 0, 1),
      createTilePlacement('square', 'red', 0, 2)
    ];
    const playerTiles = [
      new BaseTile('circle', 'blue'),
      new BaseTile('circle', 'blue'),
      new BaseTile('circle', 'blue'),
      new BaseTile('circle', 'blue')
    ];
    const pointsForPlayingAllTilesRule = pointsForPlayingAllTiles(6);

    // Act
    const score = pointsForPlayingAllTilesRule(
      tilePlacements,
      (coord: Coordinate) => map.getTile(coord),
      playerTiles
    );

    // Assert
    expect(score).toBe(0);
  });
  test('pointsForPlayingAllTiles returns 0 points if player placed zero tiles', () => {
    // Arrange
    const map = new BaseMap([]);
    const tilePlacements = [];
    const playerTiles = [];
    const pointsForPlayingAllTilesRule =
      pointsForPlayingAllTiles(BONUS_POINT_AMOUNT);

    // Act
    const score = pointsForPlayingAllTilesRule(
      tilePlacements,
      (coord: Coordinate) => map.getTile(coord),
      playerTiles
    );

    // Assert
    expect(score).toBe(0);
  });
});

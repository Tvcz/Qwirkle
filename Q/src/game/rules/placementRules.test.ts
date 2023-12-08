import Coordinate from '../map/coordinate';
import TileMap from '../map/map';
import {
  coordinateMustBeEmpty,
  coordinateMustShareASide,
  mustMatchNeighboringShapesOrColors,
  mustPlaceAtLeastOneTile,
  tilesPlacedMustShareRowOrColumn
} from './placementRules';
import { BaseTile } from '../map/tile';

describe('Tests for PlacementRules', () => {
  test('coordinateMustBeEmpty is satisfied when the coordinate is empty', () => {
    // Arrange
    const tile = new BaseTile('square', 'red');
    const coordinate: Coordinate = new Coordinate(0, 0);
    const map = new TileMap([{ tile, coordinate }]);
    // Act, Assert
    expect(
      coordinateMustBeEmpty(
        [{ tile, coordinate: new Coordinate(0, 1) }],
        (coord: Coordinate) => map.getTile(coord)
      )
    ).toBe(true);
  });
  test('coordinateMustBeEmpty is not satisfied when the coordinate has a tile', () => {
    // Arrange
    const tile = new BaseTile('square', 'red');
    const coordinate: Coordinate = new Coordinate(0, 0);
    const map = new TileMap([{ tile, coordinate }]);

    // Act, Assert
    expect(
      coordinateMustBeEmpty([{ tile, coordinate }], (coord: Coordinate) =>
        map.getTile(coord)
      )
    ).toBe(false);
  });
  test('coordinateMustBeEmpty is not satisfied when tile placements contain duplicate coordinates', () => {
    // Arrange
    const tile = new BaseTile('square', 'red');
    const coordinate: Coordinate = new Coordinate(0, 0);
    const map = new TileMap([{ tile, coordinate }]);

    const tilePlacements = [
      {
        tile: new BaseTile('square', 'red'),
        coordinate: new Coordinate(1, 0)
      },
      {
        tile: new BaseTile('square', 'red'),
        coordinate: new Coordinate(1, 0)
      }
    ];

    // Act, Assert
    expect(
      coordinateMustBeEmpty(tilePlacements, (coord: Coordinate) =>
        map.getTile(coord)
      )
    ).toBe(false);
  });
  test('coordinateMustShareASide is satisfied when the coordinate shares at least one side', () => {
    // Arrange
    const tile = new BaseTile('square', 'red');
    const coordinate: Coordinate = new Coordinate(0, 0);
    const map = new TileMap([{ tile, coordinate }]);

    // Act
    map.placeTile(tile, new Coordinate(1, 0));

    // Act, Assert
    expect(
      coordinateMustShareASide([{ tile, coordinate }], (coord: Coordinate) =>
        map.getTile(coord)
      )
    ).toBe(true);
  });
  test('coordinateMustShareASide is satisfied when the coordinate shares a side with existing tiles on the map or tiles about to be placed in the same turn in order', () => {
    // Arrrange
    const tile = new BaseTile('square', 'red');
    const coordinate = new Coordinate(0, 0);
    const map = new TileMap([{ tile, coordinate }]);
    const newTilePlacements = [
      {
        tile,
        coordinate: new Coordinate(0, 1)
      },
      {
        tile,
        coordinate: new Coordinate(0, 2)
      },
      {
        tile,
        coordinate: new Coordinate(0, 3)
      }
    ];

    // Act, Assert
    expect(
      coordinateMustShareASide(newTilePlacements, (coord) => map.getTile(coord))
    ).toBe(true);
  });
  test('coordinateMustShareASide is not satisfied when the coordinate shares no sides', () => {
    // Arrange
    const tile = new BaseTile('square', 'red');
    const coordinate: Coordinate = new Coordinate(0, 0);
    const map = new TileMap([{ tile, coordinate }]);

    // Act, Assert
    expect(
      coordinateMustShareASide(
        [{ tile, coordinate: new Coordinate(10, 0) }],
        (coord: Coordinate) => map.getTile(coord)
      )
    ).toBe(false);
  });
  test('coordinateMustShareASide is not satisfied when tiles are not given in correct order', () => {
    // Arrrange
    const tile = new BaseTile('square', 'red');
    const coordinate = new Coordinate(0, 0);
    const map = new TileMap([{ tile, coordinate }]);
    const newTilePlacements = [
      {
        tile,
        coordinate: new Coordinate(0, 1)
      },
      {
        tile,
        coordinate: new Coordinate(0, 3)
      },
      {
        tile,
        coordinate: new Coordinate(0, 2)
      }
    ];

    // Act, Assert
    expect(
      coordinateMustShareASide(newTilePlacements, (coord) => map.getTile(coord))
    ).toBe(false);
  });
  test('coordinateMustShareASide is not satisfied when tiles are placed in two groups', () => {
    // Arrrange
    const tile = new BaseTile('square', 'red');
    const coordinate = new Coordinate(0, 0);
    const map = new TileMap([{ tile, coordinate }]);
    const newTilePlacements = [
      {
        tile,
        coordinate: new Coordinate(0, 1)
      },
      {
        tile,
        coordinate: new Coordinate(0, 2)
      },
      {
        tile,
        coordinate: new Coordinate(0, 4)
      },
      {
        tile,
        coordinate: new Coordinate(0, 5)
      }
    ];

    // Act, Assert
    expect(
      coordinateMustShareASide(newTilePlacements, (coord) => map.getTile(coord))
    ).toBe(false);
  });
  test('mustMatchNeighboringShapesOrColors is satisfied when the tile matches neighboring shapes in row and column', () => {
    // Arrange
    const tile = new BaseTile('square', 'red');
    const coordinate: Coordinate = new Coordinate(0, 0);
    const map = new TileMap([{ tile, coordinate }]);

    // Act
    map.placeTile(new BaseTile('square', 'blue'), new Coordinate(-1, 0));
    map.placeTile(new BaseTile('square', 'green'), new Coordinate(1, 0));
    map.placeTile(new BaseTile('square', 'yellow'), new Coordinate(0, -1));
    map.placeTile(new BaseTile('square', 'purple'), new Coordinate(0, 1));

    // Assert
    expect(
      mustMatchNeighboringShapesOrColors(
        [{ tile, coordinate }],
        (coord: Coordinate) => map.getTile(coord)
      )
    ).toBe(true);
  });
  test('mustMatchNeighboringShapesOrColors is satisfied when the tile matches neighboring colors in row and column', () => {
    // Arrange
    const tile = new BaseTile('square', 'red');
    const coordinate: Coordinate = new Coordinate(0, 0);
    const map = new TileMap([{ tile, coordinate }]);

    // Act
    map.placeTile(new BaseTile('circle', 'red'), new Coordinate(-1, 0));
    map.placeTile(new BaseTile('8star', 'red'), new Coordinate(1, 0));
    map.placeTile(new BaseTile('clover', 'red'), new Coordinate(0, -1));
    map.placeTile(new BaseTile('diamond', 'red'), new Coordinate(0, 1));

    // Assert
    expect(
      mustMatchNeighboringShapesOrColors(
        [{ tile, coordinate }],
        (coord: Coordinate) => map.getTile(coord)
      )
    ).toBe(true);
  });
  test('mustMatchNeighboringShapesOrColors is satisfied when the tile matches neighboring colors in row and shapes in column', () => {
    // Arrange
    const tile = new BaseTile('square', 'red');
    const coordinate: Coordinate = new Coordinate(0, 0);
    const map = new TileMap([{ tile, coordinate }]);

    // Act
    map.placeTile(new BaseTile('circle', 'red'), new Coordinate(-1, 0));
    map.placeTile(new BaseTile('8star', 'red'), new Coordinate(1, 0));
    map.placeTile(new BaseTile('square', 'blue'), new Coordinate(0, -1));
    map.placeTile(new BaseTile('square', 'green'), new Coordinate(0, 1));

    // Assert
    expect(
      mustMatchNeighboringShapesOrColors(
        [{ tile, coordinate }],
        (coord: Coordinate) => map.getTile(coord)
      )
    ).toBe(true);
  });
  test('mustMatchNeighboringShapesOrColors is satisfied when the tile matches neighboring shapes in row and colors in column', () => {
    // Arrange
    const tile = new BaseTile('square', 'red');
    const coordinate: Coordinate = new Coordinate(0, 0);
    const map = new TileMap([{ tile, coordinate }]);

    // Act
    map.placeTile(new BaseTile('square', 'blue'), new Coordinate(-1, 0));
    map.placeTile(new BaseTile('square', 'orange'), new Coordinate(1, 0));
    map.placeTile(new BaseTile('diamond', 'red'), new Coordinate(0, -1));
    map.placeTile(new BaseTile('star', 'red'), new Coordinate(0, 1));

    // Assert
    expect(
      mustMatchNeighboringShapesOrColors(
        [{ tile, coordinate }],
        (coord: Coordinate) => map.getTile(coord)
      )
    ).toBe(true);
  });
  test('mustMatchNeighboringShapesOrColors is not satisfied when the tile does not match neighboring shapes or colors in row or column', () => {
    // Arrange
    const tile = new BaseTile('square', 'red');
    const coordinate: Coordinate = new Coordinate(0, 0);
    const map = new TileMap([{ tile, coordinate }]);

    // Act
    map.placeTile(new BaseTile('circle', 'green'), new Coordinate(-1, 0));
    map.placeTile(new BaseTile('8star', 'blue'), new Coordinate(1, 0));
    map.placeTile(new BaseTile('clover', 'purple'), new Coordinate(0, -1));
    map.placeTile(new BaseTile('diamond', 'yellow'), new Coordinate(0, 1));

    // Assert
    expect(
      mustMatchNeighboringShapesOrColors(
        [{ tile, coordinate }],
        (coord: Coordinate) => map.getTile(coord)
      )
    ).toBe(false);
  });
  test('mustMatchNeighboringShapesOrColors is not satisfied when the tile does not match neighboring shapes or colors in row', () => {
    // Arrange
    const tile = new BaseTile('square', 'red');
    const coordinate: Coordinate = new Coordinate(0, 0);
    const map = new TileMap([{ tile, coordinate }]);

    // Act
    map.placeTile(new BaseTile('diamond', 'blue'), new Coordinate(-1, 0));
    map.placeTile(new BaseTile('square', 'red'), new Coordinate(1, 0));
    map.placeTile(new BaseTile('square', 'red'), new Coordinate(0, -1));
    map.placeTile(new BaseTile('square', 'red'), new Coordinate(0, 1));

    // Assert
    expect(
      mustMatchNeighboringShapesOrColors(
        [{ tile, coordinate }],
        (coord: Coordinate) => map.getTile(coord)
      )
    ).toBe(false);
  });
  test('mustMatchNeighboringShapesOrColors is not satisfied when the tile does not match neighboring shapes or colors in column', () => {
    // Arrange
    const tile = new BaseTile('square', 'red');
    const coordinate: Coordinate = new Coordinate(0, 0);
    const map = new TileMap([{ tile, coordinate }]);

    // Act
    map.placeTile(new BaseTile('square', 'red'), new Coordinate(-1, 0));
    map.placeTile(new BaseTile('square', 'red'), new Coordinate(1, 0));
    map.placeTile(new BaseTile('diamond', 'red'), new Coordinate(0, -1));
    map.placeTile(new BaseTile('square', 'blue'), new Coordinate(0, 1));

    // Assert
    expect(
      mustMatchNeighboringShapesOrColors(
        [{ tile, coordinate }],
        (coord: Coordinate) => map.getTile(coord)
      )
    ).toBe(false);
  });
  test('tilesPlacedMustShareRowOrColumn is satisfied when all tiles are in the same row', () => {
    // Arrange
    const placement1 = {
      tile: new BaseTile('circle', 'blue'),
      coordinate: new Coordinate(0, 0)
    };
    const placement2 = {
      tile: new BaseTile('circle', 'blue'),
      coordinate: new Coordinate(-1, 0)
    };
    const placement3 = {
      tile: new BaseTile('circle', 'blue'),
      coordinate: new Coordinate(1, 0)
    };
    const placement4 = {
      tile: new BaseTile('circle', 'blue'),
      coordinate: new Coordinate(2, 0)
    };

    // Act
    const isSameRowOrColumn = tilesPlacedMustShareRowOrColumn(
      [placement1, placement2, placement3, placement4],
      jest.fn()
    );

    // Assert
    expect(isSameRowOrColumn).toBe(true);
  });
  test('tilesPlacedMustShareRowOrColumn is satisfied when all tiles are in the same row', () => {
    // Arrange
    const placement1 = {
      tile: new BaseTile('circle', 'blue'),
      coordinate: new Coordinate(0, 0)
    };
    const placement2 = {
      tile: new BaseTile('circle', 'blue'),
      coordinate: new Coordinate(-1, 0)
    };
    const placement3 = {
      tile: new BaseTile('circle', 'blue'),
      coordinate: new Coordinate(1, 0)
    };
    const placement4 = {
      tile: new BaseTile('circle', 'blue'),
      coordinate: new Coordinate(2, 0)
    };

    // Act
    const isSameRowOrColumn = tilesPlacedMustShareRowOrColumn(
      [placement1, placement2, placement3, placement4],
      jest.fn()
    );

    // Assert
    expect(isSameRowOrColumn).toBe(true);
  });
  test('tilesPlacedMustShareRowOrColumn is satisfied when one tile is placed', () => {
    // Arrange
    const placement1 = {
      tile: new BaseTile('circle', 'blue'),
      coordinate: new Coordinate(0, 0)
    };

    // Act
    const isSameRowOrColumn = tilesPlacedMustShareRowOrColumn(
      [placement1],
      jest.fn()
    );

    // Assert
    expect(isSameRowOrColumn).toBe(true);
  });
  test('tilesPlacedMustShareRowOrColumn is not satisfied when all tiles are not in the same row or column', () => {
    // Arrange
    const placement1 = {
      tile: new BaseTile('circle', 'blue'),
      coordinate: new Coordinate(0, 0)
    };
    const placement2 = {
      tile: new BaseTile('circle', 'blue'),
      coordinate: new Coordinate(-1, -1)
    };
    const placement3 = {
      tile: new BaseTile('circle', 'blue'),
      coordinate: new Coordinate(1, 0)
    };
    const placement4 = {
      tile: new BaseTile('circle', 'blue'),
      coordinate: new Coordinate(2, 0)
    };

    // Act
    const isSameRowOrColumn = tilesPlacedMustShareRowOrColumn(
      [placement1, placement2, placement3, placement4],
      jest.fn()
    );

    // Assert
    expect(isSameRowOrColumn).toBe(false);
  });
  test('mustPlaceAtLeastOneTile is not satisfied unless at least one tile is placed', () => {
    // Arrange
    const placement = {
      tile: new BaseTile('circle', 'blue'),
      coordinate: new Coordinate(0, 0)
    };

    // Act
    const hasAtLeastOneTilePlacement1 = mustPlaceAtLeastOneTile([], jest.fn());
    const hasAtLeastOneTilePlacement2 = mustPlaceAtLeastOneTile(
      [placement],
      jest.fn()
    );

    // Assert
    expect(hasAtLeastOneTilePlacement1).toBe(false);
    expect(hasAtLeastOneTilePlacement2).toBe(true);
  });
});

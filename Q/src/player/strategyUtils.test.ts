import Coordinate from '../game/map/coordinate';
import { BaseTile } from '../game/map/tile';
import {
  coordinateMustBeEmpty,
  coordinateMustShareASide,
  mustMatchNeighboringShapesOrColors
} from '../game/rules/placementRules';
import { BaseRuleBook } from '../game/rules/ruleBook';
import { Color, Shape, colorList, shapeList } from '../game/types/map.types';
import {
  sortCoordinatesByMostNeighbors,
  sortCoordinatesByRowColumnOrder
} from './strategySorters';
import { suggestMoveByStrategy } from './strategyUtils';

const createPlacement = (shape: Shape, color: Color, x: number, y: number) => {
  return {
    tile: new BaseTile(shape, color),
    coordinate: new Coordinate(x, y)
  };
};

describe('tests for suggestMoveByStrategy function with sortCoordinatesByRowColumnOrder sorter function', () => {
  test('If no tiles can be placed and player has more tiles than are remaining, pass turn is returned', () => {
    // Arrange
    const mapState = [createPlacement('square', 'red', 0, 0)];
    const playerTiles = [new BaseTile('8star', 'blue')];
    const remainingTilesCount = 0;
    const placementRules = [
      coordinateMustBeEmpty,
      coordinateMustShareASide,
      mustMatchNeighboringShapesOrColors
    ];

    // Act
    const turnAction = suggestMoveByStrategy(
      mapState,
      playerTiles,
      remainingTilesCount,
      placementRules,
      sortCoordinatesByRowColumnOrder
    );

    // Assert
    expect(turnAction.ofType('PASS')).toBeTruthy();
  });
  test('If no tiles can be placed and player has less tiles than are remaining, exchange turn is returned', () => {
    // Arrange
    const mapState = [createPlacement('square', 'red', 0, 0)];
    const playerTiles = [new BaseTile('8star', 'blue')];
    const remainingTilesCount = 5;
    const placementRules = [
      coordinateMustBeEmpty,
      coordinateMustShareASide,
      mustMatchNeighboringShapesOrColors
    ];

    // Act
    const turnAction = suggestMoveByStrategy(
      mapState,
      playerTiles,
      remainingTilesCount,
      placementRules,
      sortCoordinatesByRowColumnOrder
    );

    // Assert
    expect(turnAction.ofType('EXCHANGE')).toBeTruthy();
  });
  test('tiles are chosen in order if all shapes can fit', () => {
    // Arrange
    const mapState = [
      createPlacement('square', 'red', 0, 0),
      createPlacement('square', 'blue', -1, 0),
      createPlacement('square', 'blue', 0, 1),
      createPlacement('square', 'blue', 0, -1)
    ];
    const playerTiles = [
      new BaseTile('8star', 'red'),
      new BaseTile('star', 'red'),
      new BaseTile('clover', 'red'),
      new BaseTile('diamond', 'red'),
      new BaseTile('circle', 'red'),
      new BaseTile('square', 'red')
    ];
    const rulebook = new BaseRuleBook();
    const placementRules = rulebook.getPlacementRules();

    // Act
    const turnAction = suggestMoveByStrategy(
      mapState,
      playerTiles,
      20,
      placementRules,
      sortCoordinatesByRowColumnOrder
    );

    // Assert
    expect(turnAction.ofType('PASS')).toBeFalsy();
    expect(turnAction.ofType('EXCHANGE')).toBeFalsy();

    if (turnAction.ofType('PLACE')) {
      turnAction.getPlacements().forEach((placement, index) => {
        expect(placement.tile).toStrictEqual(
          new BaseTile(shapeList[index], 'red')
        );
      });
    }
  });
  test('tiles are chosen in correct order if all shapes are all the same and all colors can fit', () => {
    // Arrange
    const mapState = [
      createPlacement('circle', 'blue', 0, 0),
      createPlacement('square', 'blue', -1, 0),
      createPlacement('square', 'blue', 0, 1),
      createPlacement('square', 'blue', 0, -1)
    ];
    const playerTiles = [
      new BaseTile('circle', 'red'),
      new BaseTile('circle', 'green'),
      new BaseTile('circle', 'yellow'),
      new BaseTile('circle', 'orange'),
      new BaseTile('circle', 'blue'),
      new BaseTile('circle', 'purple')
    ];
    const rulebook = new BaseRuleBook();
    const placementRules = rulebook.getPlacementRules();

    // Act
    const turnAction = suggestMoveByStrategy(
      mapState,
      playerTiles,
      20,
      placementRules,
      sortCoordinatesByRowColumnOrder
    );

    // Assert
    expect(turnAction.ofType('PASS')).toBeFalsy();
    expect(turnAction.ofType('EXCHANGE')).toBeFalsy();

    if (turnAction.ofType('PLACE')) {
      turnAction.getPlacements().forEach((placement, index) => {
        expect(placement.tile).toStrictEqual(
          new BaseTile('circle', colorList[index])
        );
      });
    }
  });
  test('row column order is used to choose tile placements', () => {
    // Arrange
    const mapState = [createPlacement('square', 'red', 0, 0)];
    const playerTiles = [
      new BaseTile('square', 'blue'),
      new BaseTile('square', 'blue'),
      new BaseTile('square', 'blue'),
      new BaseTile('square', 'blue'),
      new BaseTile('square', 'blue'),
      new BaseTile('square', 'blue')
    ];
    const rulebook = new BaseRuleBook();
    const placementRules = rulebook.getPlacementRules();

    // Act
    const turnAction = suggestMoveByStrategy(
      mapState,
      playerTiles,
      20,
      placementRules,
      sortCoordinatesByRowColumnOrder
    );

    // Assert
    expect(turnAction.ofType('PASS')).toBeFalsy();
    expect(turnAction.ofType('EXCHANGE')).toBeFalsy();

    if (turnAction.ofType('PLACE')) {
      turnAction.getPlacements().forEach((placement, index) => {
        expect(placement).toStrictEqual(
          createPlacement('square', 'blue', 0, -(index + 1))
        );
      });
    }
  });
});

describe('tests for suggestMoveByStrategy function with sortCoordinatesByMostNeighbors sorter function', () => {
  test('If no tiles can be placed and player has more tiles than are remaining, pass turn is returned', () => {
    // Arrange
    const mapState = [createPlacement('square', 'red', 0, 0)];
    const playerTiles = [new BaseTile('8star', 'blue')];
    const remainingTilesCount = 0;
    const placementRules = [
      coordinateMustBeEmpty,
      coordinateMustShareASide,
      mustMatchNeighboringShapesOrColors
    ];

    // Act
    const turnAction = suggestMoveByStrategy(
      mapState,
      playerTiles,
      remainingTilesCount,
      placementRules,
      sortCoordinatesByMostNeighbors
    );

    // Assert
    expect(turnAction.ofType('PASS')).toBeTruthy();
  });
  test('If no tiles can be placed and player has less tiles than are remaining, exchange turn is returned', () => {
    // Arrange
    const mapState = [createPlacement('square', 'red', 0, 0)];
    const playerTiles = [new BaseTile('8star', 'blue')];
    const remainingTilesCount = 5;
    const placementRules = [
      coordinateMustBeEmpty,
      coordinateMustShareASide,
      mustMatchNeighboringShapesOrColors
    ];

    // Act
    const turnAction = suggestMoveByStrategy(
      mapState,
      playerTiles,
      remainingTilesCount,
      placementRules,
      sortCoordinatesByMostNeighbors
    );

    // Assert
    expect(turnAction.ofType('EXCHANGE')).toBeTruthy();
  });
  test('tiles are chosen in order if all shapes can fit', () => {
    // Arrange
    const mapState = [
      createPlacement('square', 'red', 0, 0),
      createPlacement('square', 'blue', -1, 0),
      createPlacement('square', 'blue', 0, 1),
      createPlacement('square', 'blue', 0, -1)
    ];
    const playerTiles = [
      new BaseTile('8star', 'red'),
      new BaseTile('star', 'red'),
      new BaseTile('clover', 'red'),
      new BaseTile('diamond', 'red'),
      new BaseTile('circle', 'red'),
      new BaseTile('square', 'red')
    ];
    const rulebook = new BaseRuleBook();
    const placementRules = rulebook.getPlacementRules();

    // Act
    const turnAction = suggestMoveByStrategy(
      mapState,
      playerTiles,
      20,
      placementRules,
      sortCoordinatesByMostNeighbors
    );

    // Assert
    expect(turnAction.ofType('PASS')).toBeFalsy();
    expect(turnAction.ofType('EXCHANGE')).toBeFalsy();

    if (turnAction.ofType('PLACE')) {
      turnAction.getPlacements().forEach((placement, index) => {
        expect(placement.tile).toStrictEqual(
          new BaseTile(shapeList[index], 'red')
        );
      });
    }
  });
  test('tiles are chosen in correct order if all shapes are all the same and all colors can fit', () => {
    // Arrange
    const mapState = [
      createPlacement('circle', 'blue', 0, 0),
      createPlacement('square', 'blue', -1, 0),
      createPlacement('square', 'blue', 0, 1),
      createPlacement('square', 'blue', 0, -1)
    ];
    const playerTiles = [
      new BaseTile('circle', 'red'),
      new BaseTile('circle', 'green'),
      new BaseTile('circle', 'yellow'),
      new BaseTile('circle', 'orange'),
      new BaseTile('circle', 'blue'),
      new BaseTile('circle', 'purple')
    ];
    const rulebook = new BaseRuleBook();
    const placementRules = rulebook.getPlacementRules();

    // Act
    const turnAction = suggestMoveByStrategy(
      mapState,
      playerTiles,
      20,
      placementRules,
      sortCoordinatesByMostNeighbors
    );

    // Assert
    expect(turnAction.ofType('PASS')).toBeFalsy();
    expect(turnAction.ofType('EXCHANGE')).toBeFalsy();

    if (turnAction.ofType('PLACE')) {
      turnAction.getPlacements().forEach((placement, index) => {
        expect(placement.tile).toStrictEqual(
          new BaseTile('circle', colorList[index])
        );
      });
    }
  });
  test('tiles are placed correctly with equal number of neighbors (3 each)', () => {
    const mapState = [
      createPlacement('square', 'blue', -1, 0),
      createPlacement('square', 'blue', 2, 0),
      createPlacement('square', 'blue', 0, -1),
      createPlacement('square', 'blue', 0, 1),
      createPlacement('square', 'blue', -2, 0),
      createPlacement('circle', 'red', -1, 1),
      createPlacement('circle', 'red', -1, -1),
      createPlacement('circle', 'red', 0, 2),
      createPlacement('circle', 'red', 0, -2),
      createPlacement('circle', 'red', 1, 2),
      createPlacement('square', 'blue', 1, 1),
      createPlacement('square', 'blue', 1, -1),
      createPlacement('circle', 'red', 1, -2),
      createPlacement('circle', 'red', 2, 1),
      createPlacement('circle', 'red', 2, -1),
      createPlacement('circle', 'red', 3, 0)
    ];
    const playerTiles = [
      new BaseTile('square', 'blue'),
      new BaseTile('diamond', 'blue')
    ];
    const rulebook = new BaseRuleBook();
    const placementRules = rulebook.getPlacementRules();

    // Act
    const turnAction = suggestMoveByStrategy(
      mapState,
      playerTiles,
      20,
      placementRules,
      sortCoordinatesByMostNeighbors
    );

    // Assert
    expect(turnAction.ofType('PASS')).toBeFalsy();
    expect(turnAction.ofType('EXCHANGE')).toBeFalsy();

    expect(turnAction.getPlacements()[0]).toStrictEqual(
      createPlacement('square', 'blue', 0, 0)
    );
    expect(turnAction.getPlacements()[1]).toStrictEqual(
      createPlacement('diamond', 'blue', 1, 0)
    );
  });
  test('most neighbors order is used to choose tile placements', () => {
    // Arrange
    const mapState = [
      createPlacement('square', 'blue', -1, 0),
      createPlacement('square', 'blue', 0, 3),
      createPlacement('square', 'blue', 1, 0),
      createPlacement('square', 'blue', -1, 1),
      createPlacement('square', 'blue', 1, 1),
      createPlacement('square', 'blue', -1, 2),
      createPlacement('square', 'blue', 1, 2),
      createPlacement('square', 'blue', -1, 3),
      createPlacement('square', 'blue', 1, 3)
    ];
    const playerTiles = [
      new BaseTile('diamond', 'blue'),
      new BaseTile('square', 'blue'),
      new BaseTile('circle', 'blue'),
      new BaseTile('square', 'blue'),
      new BaseTile('8star', 'blue'),
      new BaseTile('star', 'blue')
    ];
    const rulebook = new BaseRuleBook();
    const placementRules = rulebook.getPlacementRules();

    // Act
    const turnAction = suggestMoveByStrategy(
      mapState,
      playerTiles,
      20,
      placementRules,
      sortCoordinatesByMostNeighbors
    );

    // Assert
    expect(turnAction.ofType('PASS')).toBeFalsy();
    expect(turnAction.ofType('EXCHANGE')).toBeFalsy();

    if (turnAction.ofType('PLACE')) {
      const placements = turnAction.getPlacements();
      expect(placements[0]).toStrictEqual(
        createPlacement('star', 'blue', 0, 2)
      );
      expect(placements[1]).toStrictEqual(
        createPlacement('8star', 'blue', 0, 1)
      );
      expect(placements[2]).toStrictEqual(
        createPlacement('square', 'blue', 0, 0)
      );
      expect(placements[3]).toStrictEqual(
        createPlacement('square', 'blue', 0, -1)
      );
      expect(placements[4]).toStrictEqual(
        createPlacement('circle', 'blue', 0, -2)
      );
      expect(placements[5]).toStrictEqual(
        createPlacement('diamond', 'blue', 0, -3)
      );
    }
  });
  test('most neighbors order defaults to row column order if all potential placements have same number of neighbors', () => {
    // Arrange
    const mapState = [createPlacement('square', 'blue', 0, 0)];
    const playerTiles = [
      new BaseTile('square', 'blue'),
      new BaseTile('square', 'blue'),
      new BaseTile('square', 'blue'),
      new BaseTile('square', 'blue'),
      new BaseTile('square', 'blue'),
      new BaseTile('square', 'blue')
    ];
    const rulebook = new BaseRuleBook();
    const placementRules = rulebook.getPlacementRules();

    // Act
    const turnAction = suggestMoveByStrategy(
      mapState,
      playerTiles,
      20,
      placementRules,
      sortCoordinatesByMostNeighbors
    );

    // Assert
    expect(turnAction.ofType('PASS')).toBeFalsy();
    expect(turnAction.ofType('EXCHANGE')).toBeFalsy();

    if (turnAction.ofType('PLACE')) {
      turnAction.getPlacements().forEach((placement, index) => {
        expect(placement).toStrictEqual(
          createPlacement('square', 'blue', 0, -(index + 1))
        );
      });
    }
  });
});

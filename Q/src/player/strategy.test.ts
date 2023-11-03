import Coordinate from '../game/map/coordinate';
import { BaseTile } from '../game/map/tile';
import {
  coordinateMustBeEmpty,
  coordinateMustShareASide
} from '../game/rules/placementRules';
import { DagStrategy, LdasgStrategy } from './strategy';
import {
  sortCoordinatesByMostNeighbors,
  sortCoordinatesByRowColumnOrder
} from './strategySorters';
import { suggestMoveByStrategy } from './strategyUtils';

jest.mock('./strategyUtils');

describe('tests for strategy suggestMove implementations', () => {
  test('DagStrategy method, suggestMove, calls suggestMoveByStrategy function with row column sorter function', () => {
    // Arrange
    const mockSuggestMoveByStrategy = jest.fn();
    jest
      .mocked(suggestMoveByStrategy)
      .mockImplementation(mockSuggestMoveByStrategy);
    const mapState = [
      {
        tile: new BaseTile('square', 'red'),
        coordinate: new Coordinate(0, 0)
      }
    ];
    const playerTiles = [new BaseTile('8star', 'blue')];
    const remainingTilesCount = 10;
    const placementRules = [coordinateMustBeEmpty, coordinateMustShareASide];
    const dagStrat = new DagStrategy();

    // Act
    dagStrat.suggestMove(
      mapState,
      playerTiles,
      remainingTilesCount,
      placementRules
    );

    // Assert
    expect(mockSuggestMoveByStrategy).toBeCalledWith(
      mapState,
      playerTiles,
      remainingTilesCount,
      placementRules,
      sortCoordinatesByRowColumnOrder
    );
  });
  test('LdasgStrategy method, suggestMove, calls suggestMoveByStrategy function with most neighbors sorter function', () => {
    // Arrange
    const mockSuggestMoveByStrategy = jest.fn();
    jest
      .mocked(suggestMoveByStrategy)
      .mockImplementation(mockSuggestMoveByStrategy);
    const mapState = [
      {
        tile: new BaseTile('square', 'red'),
        coordinate: new Coordinate(0, 0)
      }
    ];
    const playerTiles = [new BaseTile('8star', 'blue')];
    const remainingTilesCount = 10;
    const placementRules = [coordinateMustBeEmpty, coordinateMustShareASide];
    const dagStrat = new LdasgStrategy();

    // Act
    dagStrat.suggestMove(
      mapState,
      playerTiles,
      remainingTilesCount,
      placementRules
    );

    // Assert
    expect(mockSuggestMoveByStrategy).toBeCalledWith(
      mapState,
      playerTiles,
      remainingTilesCount,
      placementRules,
      sortCoordinatesByMostNeighbors
    );
  });
});

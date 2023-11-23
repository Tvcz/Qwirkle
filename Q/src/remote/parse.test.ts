import Coordinate from '../game/map/coordinate';
import { BaseTile } from '../game/map/tile';
import { TilePlacement } from '../game/types/gameState.types';
import { BaseTurnAction, TurnAction } from '../player/turnAction';
import { buildTilePlacement, buildTile, buildTurnAction } from './parse';
import { ParsedTile, ParsedTilePlacement, ParsedTurnAction } from './types';

describe('tests for parse', () => {
  test('buildTilePlacement should convert a parsed tile placement into a TilePlacement instance', () => {
    // arrange
    const parsedTilePlacement1: ParsedTilePlacement = {
      tile: { shape: 'square', color: 'red' },
      coordinate: { x: 1, y: 2 }
    };
    const expectedTilePlacement1: TilePlacement<BaseTile> = {
      tile: new BaseTile('square', 'red'),
      coordinate: new Coordinate(1, 2)
    };
    const parsedTilePlacement2: ParsedTilePlacement = {
      tile: { shape: 'circle', color: 'blue' },
      coordinate: { x: -3, y: 4 }
    };
    const expectedTilePlacement2: TilePlacement<BaseTile> = {
      tile: new BaseTile('circle', 'blue'),
      coordinate: new Coordinate(-3, 4)
    };
    const parsedTilePlacement3: ParsedTilePlacement = {
      tile: { shape: 'diamond', color: 'green' },
      coordinate: { x: 0, y: 0 }
    };
    const expectedTilePlacement3: TilePlacement<BaseTile> = {
      tile: new BaseTile('diamond', 'green'),
      coordinate: new Coordinate(0, 0)
    };

    // act
    const builtTilePlacement1 = buildTilePlacement(parsedTilePlacement1);
    const builtTilePlacement2 = buildTilePlacement(parsedTilePlacement2);
    const builtTilePlacement3 = buildTilePlacement(parsedTilePlacement3);

    // assert
    expect(builtTilePlacement1).toEqual(expectedTilePlacement1);
    expect(builtTilePlacement2).toEqual(expectedTilePlacement2);
    expect(builtTilePlacement3).toEqual(expectedTilePlacement3);
  });

  test('buildTile should convert a parsed tile into a BaseTile instance', () => {
    // arrange
    const parsedTile1: ParsedTile = { shape: 'square', color: 'red' };
    const expectedTile1 = new BaseTile('square', 'red');
    const parsedTile2: ParsedTile = { shape: 'circle', color: 'blue' };
    const expectedTile2 = new BaseTile('circle', 'blue');
    const parsedTile3: ParsedTile = { shape: 'diamond', color: 'green' };
    const expectedTile3 = new BaseTile('diamond', 'green');

    // act
    const buildTile1 = buildTile(parsedTile1);
    const buildTile2 = buildTile(parsedTile2);
    const buildTile3 = buildTile(parsedTile3);

    // assert
    expect(buildTile1).toEqual(expectedTile1);
    expect(buildTile2).toEqual(expectedTile2);
    expect(buildTile3).toEqual(expectedTile3);
  });

  test('buildTurnAction should convert a parsed turn action into a TurnAction instance', () => {
    // arrange
    const parsedTurnAction1: ParsedTurnAction = {
      type: 'PLACE',
      placements: [
        {
          tile: { shape: 'square', color: 'red' },
          coordinate: { x: 1, y: 1 }
        }
      ]
    };
    const expectedTurnAction1: TurnAction<BaseTile> = new BaseTurnAction(
      'PLACE',
      [
        {
          tile: new BaseTile('square', 'red'),
          coordinate: new Coordinate(1, 1)
        }
      ]
    );
    const parsedTurnAction2: ParsedTurnAction = {
      type: 'PASS',
      placements: undefined
    };
    const expectedTurnAction2: TurnAction<BaseTile> = new BaseTurnAction(
      'PASS',
      undefined
    );
    const parsedTurnAction3: ParsedTurnAction = {
      type: 'EXCHANGE',
      placements: undefined
    };
    const expectedTurnAction3: TurnAction<BaseTile> = new BaseTurnAction(
      'EXCHANGE',
      undefined
    );

    // act
    const builtTurnAction1 = buildTurnAction(parsedTurnAction1);
    const builtTurnAction2 = buildTurnAction(parsedTurnAction2);
    const builtTurnAction3 = buildTurnAction(parsedTurnAction3);

    // assert
    expect(builtTurnAction1).toEqual(expectedTurnAction1);
    expect(builtTurnAction2).toEqual(expectedTurnAction2);
    expect(builtTurnAction3).toEqual(expectedTurnAction3);
  });
});

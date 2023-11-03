import Coordinate from '../game/map/coordinate';
import { BaseTile } from '../game/map/tile';
import { BaseRuleBook } from '../game/rules/ruleBook';
import { BaseTurnAction } from './turnAction';
import { BasePlayer } from './player';
import { DagStrategy } from './strategy';

describe('tests for Player', () => {
  test('Player returns a placement from takeTurn correctly', () => {
    const player = new BasePlayer(
      'john',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const playerInfo = {
      playerTiles: [new BaseTile('square', 'red')],
      mapState: [
        {
          tile: new BaseTile('square', 'red'),
          coordinate: new Coordinate(1, 2)
        }
      ],
      scoreboard: [{ name: 'john', score: 0 }],
      remainingTilesCount: 10,
      playersQueue: ['john', 'john2']
    };
    expect(player.takeTurn(playerInfo)).toStrictEqual(
      new BaseTurnAction('PLACE', [
        {
          coordinate: new Coordinate(1, 1),
          tile: new BaseTile('square', 'red')
        }
      ])
    );
  });

  test('Player exchanges when they have no tiles to play and there are enough remaining tiles to exchange', () => {
    const player3 = new BasePlayer(
      'john3',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const playerInfo3 = {
      playerTiles: [
        new BaseTile('8star', 'blue'),
        new BaseTile('star', 'purple')
      ],
      mapState: [
        {
          tile: new BaseTile('square', 'red'),
          coordinate: new Coordinate(1, 2)
        }
      ],
      scoreboard: [{ name: 'john2', score: 0 }],
      remainingTilesCount: 2,
      playersQueue: ['john3', 'john']
    };
    expect(player3.takeTurn(playerInfo3)).toStrictEqual(
      new BaseTurnAction('EXCHANGE')
    );
  });

  test('Player passes when they have no tiles to play and there are not enough remaining tiles to exchange', () => {
    const player2 = new BasePlayer(
      'john2',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const playerInfo2 = {
      playerTiles: [
        new BaseTile('8star', 'blue'),
        new BaseTile('star', 'purple')
      ],
      mapState: [
        {
          tile: new BaseTile('square', 'red'),
          coordinate: new Coordinate(1, 2)
        }
      ],
      scoreboard: [{ name: 'john2', score: 0 }],
      remainingTilesCount: 1,
      playersQueue: ['john2', 'john']
    };
    expect(player2.takeTurn(playerInfo2)).toStrictEqual(
      new BaseTurnAction('PASS')
    );
  });

  test('Plater name getter returns correct name', () => {
    const player = new BasePlayer(
      'john',
      new DagStrategy(),
      new BaseRuleBook()
    );
    expect(player.name()).toBe('john');
  });

  test('Other player setter methods do not throw errors', () => {
    const player = new BasePlayer(
      'john',
      new DagStrategy(),
      new BaseRuleBook()
    );
    expect(() =>
      player.setUp(
        [
          {
            tile: new BaseTile('square', 'red'),
            coordinate: new Coordinate(1, 2)
          }
        ],
        []
      )
    ).not.toThrowError();
    expect(() =>
      player.newTiles([new BaseTile('square', 'red')])
    ).not.toThrowError();
    expect(() => player.win(true)).not.toThrowError();
  });
});

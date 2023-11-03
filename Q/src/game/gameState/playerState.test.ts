import PlayerState from './playerState';
import { BaseTile } from '../map/tile';
import Coordinate from '../map/coordinate';
import { BasePlayer } from '../../player/player';
import { DagStrategy } from '../../player/strategy';
import { BaseRuleBook } from '../rules/ruleBook';
import { BaseTurnAction } from '../../player/turnAction';

describe('Tests for Player methods', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  test('can get player name', () => {
    // Arrange
    const id = 'joe';
    const playerController = new BasePlayer(
      id,
      new DagStrategy(),
      new BaseRuleBook()
    );
    const player = new PlayerState<BaseTile>(playerController);

    // Act, Assert
    expect(player.getName()).toBe(id);
  });
  test('PlayerState constructor throws an error if cannot get name of Player', () => {
    // Arrange
    const id = 'joe';
    const playerController = new BasePlayer(
      id,
      new DagStrategy(),
      new BaseRuleBook()
    );
    jest.spyOn(BasePlayer.prototype, 'name').mockImplementation(() => {
      throw new Error('error on name()');
    });

    // Act, Assert
    expect(() => new PlayerState<BaseTile>(playerController)).toThrow();
  });
  test('can get player controller', () => {
    // Arrange
    const id = 'joe';
    const playerController = new BasePlayer(
      id,
      new DagStrategy(),
      new BaseRuleBook()
    );
    const player = new PlayerState<BaseTile>(playerController);

    // Act, Assert
    expect(player.getPlayerController()).toBe(playerController);
  });
  test('can get all tiles', () => {
    // Arrange
    const playerController = new BasePlayer(
      'joe',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const playerWithNoTiles = new PlayerState<BaseTile>(playerController);
    const playerController2 = new BasePlayer(
      'joe',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const playerWithTiles = new PlayerState<BaseTile>(playerController2);
    const tiles = [
      new BaseTile('square', 'red'),
      new BaseTile('circle', 'blue')
    ];
    playerWithTiles.setTiles(tiles);

    // Act, Assert
    expect(playerWithNoTiles.getAllTiles().length).toBe(0);
    expect(playerWithTiles.getAllTiles()).toStrictEqual(tiles);
  });
  test('can set tiles', () => {
    // Arrange
    const playerController = new BasePlayer(
      'joe',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const player = new PlayerState<BaseTile>(playerController);
    const tiles = [
      new BaseTile('square', 'red'),
      new BaseTile('circle', 'blue')
    ];

    // Act
    player.setTiles(tiles);
    const retrievedTiles = player.getAllTiles();

    // Assert
    expect(retrievedTiles).toStrictEqual(tiles);
    expect(retrievedTiles.length).toBe(tiles.length);
  });
  test('setting tiles overwrites existing tiles', () => {
    // Arrange
    const playerController = new BasePlayer(
      'joe',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const player = new PlayerState<BaseTile>(playerController);
    player.setTiles([new BaseTile('8star', 'green')]);
    const tiles = [
      new BaseTile('square', 'red'),
      new BaseTile('circle', 'blue')
    ];

    // Act
    player.setTiles(tiles);
    const retrievedTiles = player.getAllTiles();

    // Assert
    expect(retrievedTiles).toStrictEqual(tiles);
    expect(retrievedTiles.length).toBe(tiles.length);
  });
  test('can get tile count', () => {
    // Arrange
    const playerController = new BasePlayer(
      'joe',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const playerWithNoTiles = new PlayerState<BaseTile>(playerController);
    const playerController2 = new BasePlayer(
      'joe',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const playerWithTiles = new PlayerState<BaseTile>(playerController2);
    const tiles = [
      new BaseTile('square', 'red'),
      new BaseTile('circle', 'blue')
    ];
    playerWithTiles.setTiles(tiles);

    // Act, Assert
    expect(playerWithNoTiles.getTileCount()).toBe(0);
    expect(playerWithTiles.getTileCount()).toBe(tiles.length);
  });
  test('can get score', () => {
    // Arrange
    const playerController = new BasePlayer(
      'joe',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const player = new PlayerState<BaseTile>(playerController);

    // Act, Assert
    expect(player.getScore()).toBe(0);
  });
  test('can set score', () => {
    // Arrange
    const playerController = new BasePlayer(
      'joe',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const player = new PlayerState<BaseTile>(playerController);
    const score = 500;

    // Act
    player.updateScore(score);

    // Assert
    expect(player.getScore()).toBe(score);
  });
  test('getMostRecentTurn is undefined to start the game', () => {
    // Arrange
    const playerController = new BasePlayer(
      'joe',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const player = new PlayerState<BaseTile>(playerController);

    // Act
    const mostRecentTurn = player.getMostRecentTurn();

    // Assert
    expect(mostRecentTurn).toBeUndefined();
  });
  test('setMostRecentTurn sets the most recent turn to the given turn state', () => {
    // Arrange
    const playerController = new BasePlayer(
      'joe',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const player = new PlayerState<BaseTile>(playerController);
    const turnState = {
      turnAction: new BaseTurnAction<BaseTile>('PLACE', [
        {
          tile: new BaseTile('8star', 'blue'),
          coordinate: new Coordinate(0, 0)
        }
      ]),
      playerTiles: [new BaseTile('8star', 'blue')]
    };

    // Act
    player.setMostRecentTurn(turnState);

    // Assert
    expect(player.getMostRecentTurn()).toBe(turnState);
  });
});

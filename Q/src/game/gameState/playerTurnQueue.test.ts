import PlayerState from './playerState';
import PlayerTurnQueue from './playerTurnQueue';
import { BaseTile } from '../map/tile';
import { BasePlayer } from '../../player/player';
import { DagStrategy } from '../../player/strategy';
import { BaseRuleBook } from '../rules/ruleBook';
import { BaseTurnAction } from '../../player/turnAction';

describe('Tests for PlayerTurnQueue methods', () => {
  test('can move to next turn', () => {
    // Arrange
    const player1 = new PlayerState<BaseTile>(
      new BasePlayer('joe', new DagStrategy(), new BaseRuleBook())
    );
    const player2 = new PlayerState<BaseTile>(
      new BasePlayer('john', new DagStrategy(), new BaseRuleBook())
    );
    const queue = new PlayerTurnQueue([player1, player2]);

    // Act
    queue.nextTurn(undefined);

    // Assert
    expect(queue.getActivePlayer()).toBe(player2);
  });
  test('nextTurn throws error if no players in queue', () => {
    // Arrange
    const queue = new PlayerTurnQueue([
      new PlayerState<BaseTile>(
        new BasePlayer('joe', new DagStrategy(), new BaseRuleBook())
      )
    ]);
    queue.eliminatePlayer('joe');

    // Act, Assert
    expect(() => queue.nextTurn(undefined)).toThrow();
  });
  test('nextTurn sets the players most recent turn', () => {
    // Arrange
    const player = new PlayerState<BaseTile>(
      new BasePlayer('joe', new DagStrategy(), new BaseRuleBook())
    );
    const queue = new PlayerTurnQueue([
      player,
      new PlayerState<BaseTile>(
        new BasePlayer('bob', new DagStrategy(), new BaseRuleBook())
      )
    ]);
    const playerState = {
      playerTiles: [] as BaseTile[],
      turnAction: new BaseTurnAction('PASS')
    };

    // Act
    queue.nextTurn(playerState);

    // Assert
    expect(player.getMostRecentTurn()).toBe(playerState);
  });
  test('can get active player', () => {
    // Arrange
    const playerController = new BasePlayer(
      'joe',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const player1 = new PlayerState<BaseTile>(playerController);
    const playerController2 = new BasePlayer(
      'bob',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const player2 = new PlayerState<BaseTile>(playerController2);
    const queue = new PlayerTurnQueue([player1, player2]);

    // Act, Assert
    expect(queue.getActivePlayer()).toBe(player1);
  });
  test('getActivePlayer throws error if no players in queue', () => {
    // Arrange
    const playerController = new BasePlayer(
      'joe',
      new DagStrategy(),
      new BaseRuleBook()
    );

    const queue = new PlayerTurnQueue([
      new PlayerState<BaseTile>(playerController)
    ]);
    queue.eliminatePlayer('joe');

    // Act, Assert
    expect(() => queue.getActivePlayer()).toThrow();
  });
  test('getLastActivePlayer returns the previously active player', () => {
    // Arrange
    const playerController = new BasePlayer(
      'joe',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const player1 = new PlayerState<BaseTile>(playerController);
    const playerController2 = new BasePlayer(
      'bob',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const player2 = new PlayerState<BaseTile>(playerController2);

    const queue = new PlayerTurnQueue([player1, player2]);

    // Act, Assert
    expect(queue.getLastActivePlayer()).toBe(player2);
  });
  test('getLastActivePlayer throws error if no players in queue', () => {
    // Arrange
    const playerController = new BasePlayer(
      'joe',
      new DagStrategy(),
      new BaseRuleBook()
    );

    const queue = new PlayerTurnQueue([
      new PlayerState<BaseTile>(playerController)
    ]);
    queue.eliminatePlayer('joe');

    // Act, Assert
    expect(() => queue.getLastActivePlayer()).toThrow();
  });
  test('can eliminate player', () => {
    // Arrange
    const playerController = new BasePlayer(
      'joe',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const player1 = new PlayerState<BaseTile>(playerController);
    const playerController2 = new BasePlayer(
      'bob',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const player2 = new PlayerState<BaseTile>(playerController2);

    const queue = new PlayerTurnQueue([player1, player2]);

    // Act
    queue.eliminatePlayer(player1.getName());

    // Assert
    expect(queue.getActivePlayer()).toBe(player2);
    expect(queue.getAllPlayersNames().length).toBe(1);
  });
  test('eliminatePlayer called with an optional TurnAction, sets the previous turn of that player', () => {
    // Arrange
    const playerController = new BasePlayer(
      'joe',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const player1 = new PlayerState<BaseTile>(playerController);
    const playerController2 = new BasePlayer(
      'bob',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const player2 = new PlayerState<BaseTile>(playerController2);

    const queue = new PlayerTurnQueue([player1, player2]);

    // Act
    queue.eliminatePlayer(player1.getName(), new BaseTurnAction('PASS'));

    // Assert
    expect(player1.getMostRecentTurn()?.turnAction).toStrictEqual(
      new BaseTurnAction('PASS')
    );
  });
  test('can get scoreboard', () => {
    // Arrange
    const playerController = new BasePlayer(
      'joe',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const player1 = new PlayerState<BaseTile>(playerController);
    const score1 = 500;
    const playerController2 = new BasePlayer(
      'bob',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const player2 = new PlayerState<BaseTile>(playerController2);
    const score2 = 842;
    const queue = new PlayerTurnQueue([player1, player2]);

    // Act
    player1.updateScore(score1);
    player2.updateScore(score2);
    const scoreboard = queue.getScoreboard();

    // Assert
    expect(scoreboard[0].score).toBe(score1);
    expect(scoreboard[1].score).toBe(score2);
  });
  test('can get all player names', () => {
    // Arrange
    const playerController = new BasePlayer(
      'joe',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const player1 = new PlayerState<BaseTile>(playerController);
    const playerController2 = new BasePlayer(
      'bob',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const player2 = new PlayerState<BaseTile>(playerController2);
    const queue = new PlayerTurnQueue([player1, player2]);

    // Act, Assert
    expect(queue.getAllPlayersNames().length).toBe(2);
    expect(queue.getAllPlayersNames()).toStrictEqual(['joe', 'bob']);
  });
  test('isRoundOver is true whenever the first player is the active player', () => {
    // Arrange
    const playerController = new BasePlayer(
      'joe',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const player1 = new PlayerState<BaseTile>(playerController);
    const playerController2 = new BasePlayer(
      'bob',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const player2 = new PlayerState<BaseTile>(playerController2);
    const playerController3 = new BasePlayer(
      'john',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const player3 = new PlayerState<BaseTile>(playerController3);
    const queue = new PlayerTurnQueue([player1, player2, player3]);

    // Act, Assert
    expect(queue.isRoundOver()).toBe(true);
    queue.nextTurn(undefined);
    expect(queue.isRoundOver()).toBe(false);
    queue.nextTurn(undefined);
    expect(queue.isRoundOver()).toBe(false);
    queue.nextTurn(undefined);
    expect(queue.isRoundOver()).toBe(true);
    queue.nextTurn(undefined);
  });
  test('getAllMostRecent turns returns the most recent turns for all players', () => {
    // Arrange
    const playerController = new BasePlayer(
      'joe',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const player1 = new PlayerState<BaseTile>(playerController);
    const turn1 = {
      turnAction: new BaseTurnAction<BaseTile>('PASS'),
      playerTiles: []
    };
    player1.setMostRecentTurn(turn1);
    const playerController2 = new BasePlayer(
      'bob',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const player2 = new PlayerState<BaseTile>(playerController2);
    const turn2 = {
      turnAction: new BaseTurnAction<BaseTile>('EXCHANGE'),
      playerTiles: []
    };
    player2.setMostRecentTurn(turn2);
    const playerController3 = new BasePlayer(
      'john',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const player3 = new PlayerState<BaseTile>(playerController3);
    const queue = new PlayerTurnQueue([player1, player2, player3]);

    // Act, Assert
    expect(queue.getAllMostRecentTurns()).toStrictEqual([
      turn1,
      turn2,
      undefined
    ]);
  });
  test('getAllPlayersSetupInformation returns the name, tiles, and setup method for every player', () => {
    // Arrange
    const playerController = new BasePlayer(
      'joe',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const player1 = new PlayerState<BaseTile>(playerController);
    const playerController2 = new BasePlayer(
      'bob',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const player2 = new PlayerState<BaseTile>(playerController2);

    const playerController3 = new BasePlayer(
      'john',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const player3 = new PlayerState<BaseTile>(playerController3);
    const queue = new PlayerTurnQueue([player1, player2, player3]);

    const mockSetup = jest.fn();
    jest.spyOn(BasePlayer.prototype, 'setUp').mockImplementation(mockSetup);

    // Act
    const setupInfo = queue.getAllPlayersSetupInformation();
    const tp = [];
    const st = [new BaseTile('8star', 'blue')];
    setupInfo[0].setUp(tp, st);

    // Assert
    expect(mockSetup).toBeCalledWith(tp, st);
    expect(setupInfo).toStrictEqual([
      expect.objectContaining({
        name: 'joe',
        tiles: player1.getAllTiles()
      }),
      expect.objectContaining({
        name: 'bob',
        tiles: player2.getAllTiles()
      }),
      expect.objectContaining({
        name: 'john',
        tiles: player3.getAllTiles()
      })
    ]);
  });
  test('getAllPlayersEndGameInformation returns the name and win method for every player', () => {
    // Arrange
    const playerController = new BasePlayer(
      'joe',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const player1 = new PlayerState<BaseTile>(playerController);
    const playerController2 = new BasePlayer(
      'bob',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const player2 = new PlayerState<BaseTile>(playerController2);

    const playerController3 = new BasePlayer(
      'john',
      new DagStrategy(),
      new BaseRuleBook()
    );
    const player3 = new PlayerState<BaseTile>(playerController3);
    const queue = new PlayerTurnQueue([player1, player2, player3]);

    const mockWin = jest.fn();
    jest.spyOn(BasePlayer.prototype, 'win').mockImplementation(mockWin);

    // Act
    const endGameInfo = queue.getAllPlayersEndGameInformation();
    endGameInfo[0].win(true);
    endGameInfo[1].win(false);

    // Assert
    expect(mockWin).toHaveBeenNthCalledWith(1, true);
    expect(mockWin).toHaveBeenNthCalledWith(2, false);
    expect(endGameInfo).toStrictEqual([
      expect.objectContaining({
        name: 'joe'
      }),
      expect.objectContaining({
        name: 'bob'
      }),
      expect.objectContaining({
        name: 'john'
      })
    ]);
  });
});

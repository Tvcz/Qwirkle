import { BaseTurnAction } from '../../player/turnAction';
import { BasePlayer } from '../../player/player';
import { DagStrategy } from '../../player/strategy';
import PlayerState from '../gameState/playerState';
import PlayerTurnQueue from '../gameState/playerTurnQueue';
import Coordinate from '../map/coordinate';
import { BaseTile } from '../map/tile';
import {
  allPlayersPassedOrExchangedInRound,
  noPlayersRemaining,
  playerHasPlacedAllTilesInPossession
} from './endOfGameRules';
import { BaseRuleBook } from './ruleBook';

describe('tests for end of game rules', () => {
  test('allPlayersPassedOrExchangedInRound is false if the round is not over', () => {
    // Arrange
    const player1 = new PlayerState(
      new BasePlayer('joe', new DagStrategy(), new BaseRuleBook())
    );
    const player2 = new PlayerState(
      new BasePlayer('john', new DagStrategy(), new BaseRuleBook())
    );
    const player3 = new PlayerState(
      new BasePlayer('jordan', new DagStrategy(), new BaseRuleBook())
    );
    const queue = new PlayerTurnQueue([player1, player2, player3]);
    queue.nextTurn(undefined);

    // Act
    const isGameOver = allPlayersPassedOrExchangedInRound(queue);

    // Assert
    expect(isGameOver).toBe(false);
  });
  test('allPlayersPassedOrExchangedInRound is true every players most recent turn is pass or exchange', () => {
    // Arrange
    const player1 = new PlayerState(
      new BasePlayer('joe', new DagStrategy(), new BaseRuleBook())
    );
    const turn1 = {
      turnAction: new BaseTurnAction<BaseTile>('PASS'),
      playerTiles: []
    };
    player1.setMostRecentTurn(turn1);
    const player2 = new PlayerState(
      new BasePlayer('john', new DagStrategy(), new BaseRuleBook())
    );
    const turn2 = {
      turnAction: new BaseTurnAction<BaseTile>('EXCHANGE'),
      playerTiles: []
    };
    player2.setMostRecentTurn(turn2);
    const player3 = new PlayerState(
      new BasePlayer('jordan', new DagStrategy(), new BaseRuleBook())
    );
    const turn3 = {
      turnAction: new BaseTurnAction<BaseTile>('PASS'),
      playerTiles: []
    };
    player3.setMostRecentTurn(turn3);
    const queue = new PlayerTurnQueue([player1, player2, player3]);

    // Act
    const isGameOver = allPlayersPassedOrExchangedInRound(queue);

    // Assert
    expect(isGameOver).toBe(true);
  });
  test('allPlayersPassedOrExchangedInRound is false one of the turn states is undefined', () => {
    // Arrange
    const player1 = new PlayerState(
      new BasePlayer('joe', new DagStrategy(), new BaseRuleBook())
    );
    const turn1 = {
      turnAction: new BaseTurnAction<BaseTile>('PASS'),
      playerTiles: []
    };
    player1.setMostRecentTurn(turn1);
    const player2 = new PlayerState(
      new BasePlayer('john', new DagStrategy(), new BaseRuleBook())
    );
    const turn2 = {
      turnAction: new BaseTurnAction<BaseTile>('EXCHANGE'),
      playerTiles: []
    };
    player2.setMostRecentTurn(turn2);
    const player3 = new PlayerState(
      new BasePlayer('jordan', new DagStrategy(), new BaseRuleBook())
    );

    const queue = new PlayerTurnQueue([player1, player2, player3]);

    // Act
    const isGameOver = allPlayersPassedOrExchangedInRound(queue);

    // Assert
    expect(isGameOver).toBe(false);
  });
  test('playerHasPlacedAllTilesInPossession is false if players turn state is undefined', () => {
    // Arrange
    const player1 = new PlayerState(
      new BasePlayer('joe', new DagStrategy(), new BaseRuleBook())
    );
    const player2 = new PlayerState(
      new BasePlayer('bob', new DagStrategy(), new BaseRuleBook())
    );
    const queue = new PlayerTurnQueue([player1, player2]);
    queue.nextTurn(undefined);

    // Act
    const isGameOver = playerHasPlacedAllTilesInPossession(queue);

    // Assert
    expect(isGameOver).toBe(false);
  });
  test('playerHasPlacedAllTilesInPossession is false if players previous turn state is PASS', () => {
    // Arrange
    const player1 = new PlayerState(
      new BasePlayer('joe', new DagStrategy(), new BaseRuleBook())
    );
    const player2 = new PlayerState(
      new BasePlayer('jordan', new DagStrategy(), new BaseRuleBook())
    );
    const queue = new PlayerTurnQueue([player1, player2]);
    queue.nextTurn({ turnAction: new BaseTurnAction('PASS'), playerTiles: [] });

    // Act
    const isGameOver = playerHasPlacedAllTilesInPossession(queue);

    // Assert
    expect(isGameOver).toBe(false);
  });
  test('playerHasPlacedAllTilesInPossession is false if players previous turn state is EXCHANGE', () => {
    // Arrange
    const player1 = new PlayerState(
      new BasePlayer('joe', new DagStrategy(), new BaseRuleBook())
    );
    const player2 = new PlayerState(
      new BasePlayer('joe', new DagStrategy(), new BaseRuleBook())
    );
    const queue = new PlayerTurnQueue([player1, player2]);

    queue.nextTurn({
      turnAction: new BaseTurnAction('EXCHANGE'),
      playerTiles: []
    });

    // Act
    const isGameOver = playerHasPlacedAllTilesInPossession(queue);

    // Assert
    expect(isGameOver).toBe(false);
  });
  test('playerHasPlacedAllTilesInPossession is false if player placed less tiles than it has in its possession', () => {
    // Arrange
    const player1 = new PlayerState(
      new BasePlayer('jordan', new DagStrategy(), new BaseRuleBook())
    );
    const player2 = new PlayerState(
      new BasePlayer('joe', new DagStrategy(), new BaseRuleBook())
    );
    const queue = new PlayerTurnQueue([player1, player2]);
    player1.setTiles([
      new BaseTile('8star', 'blue'),
      new BaseTile('8star', 'green')
    ]);
    queue.nextTurn({
      turnAction: new BaseTurnAction('PLACE', [
        {
          tile: new BaseTile('8star', 'blue'),
          coordinate: new Coordinate(0, 0)
        }
      ]),
      playerTiles: []
    });

    // Act
    const isGameOver = playerHasPlacedAllTilesInPossession(queue);

    // Assert
    expect(isGameOver).toBe(false);
  });
  test('playerHasPlacedAllTilesInPossession is true if player placed all tiles that it has in its possession', () => {
    // Arrange
    const player1 = new PlayerState(
      new BasePlayer('joe', new DagStrategy(), new BaseRuleBook())
    );
    const player2 = new PlayerState(
      new BasePlayer('bob', new DagStrategy(), new BaseRuleBook())
    );
    const queue = new PlayerTurnQueue([player1, player2]);

    queue.nextTurn({
      turnAction: new BaseTurnAction('PLACE', [
        {
          tile: new BaseTile('8star', 'blue'),
          coordinate: new Coordinate(0, 0)
        },
        {
          tile: new BaseTile('8star', 'green'),
          coordinate: new Coordinate(0, 1)
        }
      ]),
      playerTiles: [
        new BaseTile('8star', 'blue'),
        new BaseTile('8star', 'green')
      ]
    });

    // Act
    const isGameOver = playerHasPlacedAllTilesInPossession(queue);

    // Assert
    expect(isGameOver).toBe(true);
  });
  test('noPlayersRemaining returns false if there are players remaining in the game', () => {
    // Arrange
    const player = new PlayerState(
      new BasePlayer('joe', new DagStrategy(), new BaseRuleBook())
    );
    const queue = new PlayerTurnQueue([player]);

    // Act
    const isGameOver = noPlayersRemaining(queue);

    // Assert
    expect(isGameOver).toBe(false);
  });
  test('noPlayersRemaining returns true if there are no players remaining in the game', () => {
    // Arrange
    const player = new PlayerState(
      new BasePlayer('joe', new DagStrategy(), new BaseRuleBook())
    );
    const queue = new PlayerTurnQueue([player]);
    queue.eliminatePlayer(player.getName());

    // Act
    const isGameOver = noPlayersRemaining(queue);

    // Assert
    expect(isGameOver).toBe(true);
  });
});

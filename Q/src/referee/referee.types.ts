import { QGameState } from '../game/gameState/gameState';
import { QTile } from '../game/map/tile';
import { QRuleBook } from '../game/rules/ruleBook';
import { Player } from '../player/player';

/**
 * Type representing the return type of a referee.
 * Consists of a two element array, where the first element is a list of the winner's names, and the second element is a list of the eliminated player's names.
 */
export type GameResult = [string[], string[]];

/**
 * Type representing the referee.
 * The referee is a function that takes in a list of the players and a rulebook.
 * It returns the winners of the game and the eliminated players.
 */
export type RefereeFunction<T extends QTile> = (
  players: Player<T>[],
  ruleBook: QRuleBook<T>,
  existingGameState?: QGameState<T>
) => GameResult;

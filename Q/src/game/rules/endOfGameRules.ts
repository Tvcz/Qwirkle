import { QTile } from '../map/tile';
import { EndOfGameRule } from '../types/rules.types';

/**
 * A rule that checks whether all players have made pass or exchange moves at the end of a round.
 * If true, then the game should be over.
 * @param playerTurnQueue The queue of PlayerStates in the game
 * @returns true if all players have have passed or exchanged in the last round, false otherwises
 */
export const allPlayersPassedOrExchangedInRound: EndOfGameRule<QTile> = (
  playerTurnQueue
) => {
  if (playerTurnQueue.isRoundOver()) {
    const mostRecentTurnsInRound = playerTurnQueue.getAllMostRecentTurns();
    return mostRecentTurnsInRound.every(
      (turnState) =>
        turnState !== undefined &&
        (turnState.turnAction.ofType('PASS') ||
          turnState.turnAction.ofType('EXCHANGE'))
    );
  }
  return false;
};

/**
 * A rule that checks whether the last active player placed all of the tiles in its possession.
 * @param playerTurnQueue The queue of PlayerStates in the game
 * @returns true if the last active player placed all of their tiles, false otherwise
 */
export const playerHasPlacedAllTilesInPossession: EndOfGameRule<QTile> = (
  playerTurnQueue
) => {
  const lastActivePlayerTurnState = playerTurnQueue
    .getLastActivePlayer()
    .getMostRecentTurn();

  const mostRecentTurnStateIsAPlacement =
    lastActivePlayerTurnState?.turnAction.ofType('PLACE') ?? false;

  return (
    mostRecentTurnStateIsAPlacement &&
    lastActivePlayerTurnState !== undefined &&
    lastActivePlayerTurnState.playerTiles.length ===
      lastActivePlayerTurnState.turnAction.getPlacements().length
  );
};

/**
 * A rule that checks if there are no players remaining in the game
 * @param playerTurnQueue The queue of PlayerStates in the game
 * @returns true if there are no players left, false otherwise
 */
export const noPlayersRemaining: EndOfGameRule<QTile> = (playerTurnQueue) => {
  return playerTurnQueue.getAllPlayersNames().length === 0;
};

import { BaseRuleBook } from './ruleBook';
import * as placmentRules from './placementRules';
import * as scoringRules from './scoringRules';
import * as endOfGameRules from './endOfGameRules';

jest.mock('./placementRules');
jest.mock('./scoringRules');

describe('tests for BaseRuleBook class', () => {
  test('rule book initialized with placement rules returns an array with those rule', () => {
    // Arrange
    const coordinateEmpty = jest.spyOn(placmentRules, 'coordinateMustBeEmpty');
    const coordinateSharesSide = jest.spyOn(
      placmentRules,
      'coordinateMustShareASide'
    );
    const matchNeighborRule = jest.spyOn(
      placmentRules,
      'mustMatchNeighboringShapesOrColors'
    );
    const tilesPlacedInRowOrColumn = jest.spyOn(
      placmentRules,
      'tilesPlacedMustShareRowOrColumn'
    );

    // Act
    const baseRulebook = new BaseRuleBook();
    const rulebook = baseRulebook.getPlacementRules();

    // Assert
    expect(rulebook[0]).toBe(coordinateEmpty);
    expect(rulebook[1]).toBe(coordinateSharesSide);
    expect(rulebook[2]).toBe(matchNeighborRule);
    expect(rulebook[3]).toBe(tilesPlacedInRowOrColumn);
  });
  test('rule book initialized with scoring rules returns an array with those rule', () => {
    // Arrange
    const tilePlaced = jest.spyOn(scoringRules, 'pointPerTilePlaced');
    const tileInSequence = jest.spyOn(scoringRules, 'pointPerTileInSequence');
    const allTilesPlaced = jest.fn();
    jest
      .spyOn(scoringRules, 'pointsForPlayingAllTiles')
      .mockReturnValue(allTilesPlaced);
    const pointsPerQ = jest.fn();
    jest.spyOn(scoringRules, 'pointsPerQ').mockReturnValue(pointsPerQ);

    // Act
    const baseRulebook = new BaseRuleBook();
    const rulebook = baseRulebook.getScoringRules();

    // Assert
    expect(rulebook[0]).toBe(tilePlaced);
    expect(rulebook[1]).toBe(tileInSequence);
    expect(rulebook[2]).toBe(allTilesPlaced);
    expect(rulebook[3]).toBe(pointsPerQ);
  });
  test('rule book initialized with endOfGame rules returns an array with those rule', () => {
    // Arrange
    const allPlayersPassedOrExchangedInRound = jest.spyOn(
      endOfGameRules,
      'allPlayersPassedOrExchangedInRound'
    );
    const playerHasPlacedAllTilesInPossession = jest.spyOn(
      endOfGameRules,
      'playerHasPlacedAllTilesInPossession'
    );
    const noPlayersRemaining = jest.spyOn(endOfGameRules, 'noPlayersRemaining');

    // Act
    const baseRulebook = new BaseRuleBook();
    const rulebook = baseRulebook.getEndOfGameRules();

    // Assert
    expect(rulebook[0]).toBe(allPlayersPassedOrExchangedInRound);
    expect(rulebook[1]).toBe(playerHasPlacedAllTilesInPossession);
    expect(rulebook[2]).toBe(noPlayersRemaining);
  });
});

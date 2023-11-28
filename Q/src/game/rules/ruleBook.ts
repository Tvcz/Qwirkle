import {
  coordinateMustBeEmpty,
  coordinateMustShareASide,
  mustMatchNeighboringShapesOrColors,
  tilesPlacedMustShareRowOrColumn,
  mustPlaceAtLeastOneTile
} from './placementRules';
import { ShapeColorTile, type BaseTile, type QTile } from '../map/tile';
import {
  pointPerTileInSequence,
  pointPerTilePlaced,
  pointsForPlayingAllTiles,
  pointsPerQ
} from './scoringRules';
import {
  EndOfGameRule,
  PlacementRule,
  ScoringRule
} from '../types/rules.types';
import {
  allPlayersPassedOrExchangedInRound,
  noPlayersRemaining,
  playerHasPlacedAllTilesInPossession
} from './endOfGameRules';
import {
  ALL_TILES_BONUS_POINT_AMOUNT,
  Q_BONUS_POINT_AMOUNT
} from '../../constants';

/**
 * Interface representing a RuleBook for the Q Game to adhere to.
 *
 * There are Structural Map Rules, which are rules that are defined in every abstract rulebook since they are always enforced by the map.
 * These rules are defined directly in the constructor of AbstractQMap class.
 * Checking these rules is redundant by the referee, since they are defined and checked in the map, but it is important for users of the RuleBook to know that they exist and will be enforced.
 *
 * There are Placement Rules which determine which tiles can be placed
 * next to one another based on their internal properties.
 *
 * There are scoring rules which determine how a move is scored.
 *
 * There are end of game rules which determine when a game has ended.
 *
 * This RuleBook is not responsible for enforcing any rules, only defining them,
 * so the only functionality provided are getter methods to get each type of rule.
 */
export interface QRuleBook<T extends QTile> {
  /**
   * Returns a list of the placement rules used for determining the validity
   * of a placement of a tiles.
   * This includes the structural map rules.
   * @returns A list of PlacementRules
   */
  getPlacementRules: () => ReadonlyArray<PlacementRule<T>>;

  /**
   * Returns a list of the scoring rules used to score a turn.
   * @returns A list of ScoringRules
   */
  getScoringRules: () => ReadonlyArray<ScoringRule<T>>;

  /**
   * Returns a list of the end of game rules used to determine when a game has ended
   * @returns a list of EndOfGameRules
   */
  getEndOfGameRules: () => ReadonlyArray<EndOfGameRule<T>>;
}

/**
 * Abstract class for a RuleBook that uses a QTile.
 */
abstract class AbstractRuleBook<T extends QTile> implements QRuleBook<T> {
  // List of rules that are always enforced by the map when placing a tile This
  // array will contain rules stating that tiles can only be placed next to one
  // another, and that tiles cannot be placed on top of one another
  protected structuralMapRules: ReadonlyArray<PlacementRule<T>>;

  // List of rules used to determine where a placement of tiles can be placed on the map
  protected placementRules: ReadonlyArray<PlacementRule<T>>;

  // List of rules used to determine how a turn is scored
  protected scoringRules: ReadonlyArray<ScoringRule<T>>;

  // List of rules used to determine when a game is over
  protected endOfGameRules: ReadonlyArray<EndOfGameRule<T>>;

  constructor(
    placementRules: PlacementRule<T>[],
    scoringRules: ScoringRule<T>[],
    endOfGameRules: EndOfGameRule<T>[]
  ) {
    this.structuralMapRules = [coordinateMustBeEmpty, coordinateMustShareASide];
    this.placementRules = placementRules;
    this.scoringRules = scoringRules;
    this.endOfGameRules = endOfGameRules;
  }

  public getPlacementRules() {
    return [...this.structuralMapRules, ...this.placementRules];
  }

  public getScoringRules() {
    return this.scoringRules;
  }

  public getEndOfGameRules() {
    return this.endOfGameRules;
  }
}

/**
 * Represents a RuleBook for shape color tiles.
 * Contains placement rules about neighbor matching properties of BaseTiles
 * and about how tiles can be placed in the same turn.
 * Contains scoring rules about BaseTiles.
 */
export class BaseRuleBook extends AbstractRuleBook<ShapeColorTile> {
  constructor() {
    super(
      [
        mustMatchNeighboringShapesOrColors,
        tilesPlacedMustShareRowOrColumn,
        mustPlaceAtLeastOneTile
      ],
      [
        pointPerTilePlaced,
        pointPerTileInSequence,
        pointsForPlayingAllTiles(ALL_TILES_BONUS_POINT_AMOUNT),
        pointsPerQ(Q_BONUS_POINT_AMOUNT)
      ],
      [
        noPlayersRemaining,
        allPlayersPassedOrExchangedInRound,
        playerHasPlacedAllTilesInPossession
      ]
    );
  }
}

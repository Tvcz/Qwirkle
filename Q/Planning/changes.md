# Changes Impact

### changing the bonus points again and allow more players to participate in a game

#### Rank: 1

#### Justification:

For changing the bonus points again, we have two constants that are used for the bonus points for scoring placing all tiles and making a Q, so the only change required would be to change each of those constants.
For allowing more players to participate in the game, no changes would be required. Nothing in our code limits the number of players in the game, because we decided that would be the job of the component that creates the referee and hands it the players.

### adding wildcard tiles

#### Rank: 2

#### Justification:

We would need to create a new WildCardTile class that implements our ShapeColorTile interface. The ShapeColorTile interface has sameShape() and sameColor() methods that compare those properties of tiles, so the WildCardTiles would just return true for all comparisons with other tiles. This means we would not need to change the rules or anything outside of the `Q/src/game/map/tile.ts` file.

### imposing restrictions that enforce the rules of Qwirkle instead of Q

#### Rank: 3

#### Justification:

For this, we just need to create new PlacementRules (and maybe also ScoringRules or EndOfGameRules) for the rules of Qwirkle. Then we can create a new QwirkleRulebook class that implements our QRuleBook interface where we pass those Qwirkle rules in the constructor of this class.

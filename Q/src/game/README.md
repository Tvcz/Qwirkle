## GAME
The `game` folder contains the interfaces and implementations of the different 
game objects. The game objects are the nouns in the game (i.e. Tile, Player, Map]

### `gameState`
Contains the:
  - `bagOfTiles` - which is the bag of tiles which is associated with the game
    state, which exists for distributing tiles
  - `gameState` - which is the state of game, including all the states of
    players and the state of the map and bag of tiles
  - `playerState` - which is the state of a player, including the player's
    hand, score, and associated player controller
  - `playerTurnQueue` - which both represents the turn order of the players
    and acts as the single source of truth on players

### `graphicalRenderer`
Contains the `gameStateHtmlBuilder` function and its helpers, which translate a
public game state into an html string which can be rendered in a browser. 

### `map`
Contains the:
  - `map` - which is the mutable state of the map, and stores information about
    the tiles on the map
  - `tile` - which is the immutable state of a tile, and stores information
    about the tile's properties (i.e. shape and color)
  - `coordinate` - which is the immutable state of a coordinate, and stores
    the coordinate's position in terms of x and y

### `rules`
Contains the `ruleBook`, which holds a collection of rules, and the
implementations for `placementRules`, `endOfGameRules`, and `scoringRules`.

### `types`
Contains type definitions for the various types we defined for use in the game.
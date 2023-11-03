#### Player Interface Planning

TO: 'Dot Game' Company \
FROM: Nathan Kirschner and Jackson Terrill \
DATE: October 3, 2023 \
SUBJECT: Planning out Q player interface \

Players should have access to the following methods to provide mechanics for executing game actions and retrieving information about the state of the game.

```
// ---- Player Interface ----
// ----    Methods   ----
// Get the tiles that the player currently has
... this.getOwnTiles() ... QTile[]

// Get the order the players will take turns in, where the first player in the list is the active player
... this.getTurnOrder() ... players[]

// Request to take a turn where the player passes
... this.requestPassTurn() ... void

// Request to take a turn where the player exchanges all tiles from the bag
... this.requestExchangeTurn() ... void

// Request to take a turn where the player places some number of tiles on the map
... this.requestPlaceTurn(TilePlacements[]) ...  void

// Check if placing some amount of tiles at some coordinates would be a valid move
... this.checkValidPlacement(TilePlacements[]) ... boolean

// Get the current scores of all players
... this.getScoreboard() ... Scoreboard

// Get the number of remaining tiles in the bag
... this.getRemainingTileCount() ... number

// Gets the current state of the map in the form of a list of tile placements (coordinates and tiles)
... this.getMapState() ... TilePlacement[]

// Check if the game is over
... this.isGameOver() ... boolean
```

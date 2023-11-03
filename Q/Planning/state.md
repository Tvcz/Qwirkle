#### Game State Planning

TO: 'Dot Game' Company \
FROM: Nathan Kirschner and Jackson Terrill \
DATE: September 26, 2023 \
SUBJECT: Planning out the Q game state \
Our data representation for the game state that will be used by the referee will need to store the following data.

- A current list of players. The referee will need to know which players have been eliminated.
- Which players turn it is.
- The current Map state. Used for assessing move validity and is already represented by our QMap interface.
- The bag of remaining tiles. Ability to distribute tiles to players, exchange tiles, and accept returned tiles.
- Score. Keep track of the score for each player and change their score based on the scoring rules.
- Game state. The referee needs to track whether a game is in progress, or has ended.

```
// ---- In GameState ----
// ----    Methods   ----
// Start a game
// ... this.startGame() ... void
// Remove the given player from the game
// ... this.eliminatePlayers(player) ... void
// Get a list of the current players in the game
// ... this.getCurrentPlayers() ... players[]
// Get the player whose turn it is currently
// ... this.getCurrentTurn() ... player
// Change the current turn to be the next player in the rotation
// ... this.nextTurn() ... void
// Get the current map state (tile positions)
// ... this.getMap() ... QMap
// Draw a specified number of tiles from the bag of tiles
// ... this.drawTiles(count) ... QTile[]
// Add the given tiles to the end of the bag, and draw the same amount from the start
// ... this.exchangeTiles(QTile[]) ... QTile[]
// Return the given tiles to the end of the bag
// ... this.returnTiles(QTile[]) ... void
// Place the given tiles on the Map
// ... this.placeTiles(QTile[]) ... void
// Get the current score a given player
// ... this.getScore(player) ... number
// Update the score of a given player
// ... this.updateScore(player, score) ... void
// Check if the game has ended
// ... this.isGameOver() ... boolean
```

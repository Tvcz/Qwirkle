# Game Observer

Created by Nathan Kirschner and Joseph Hirsch

### Game Observer Interface

The Game Observer Interface dictates how the Game System that we design
communicates with the observers for a game.

Observers are supplied with up-to-date public states of the game and are given graphical
representations of the public game state.

```
// ---- Game Observer Interface ----
// ------    Methods    -------


// An ObservableGameState is a read only representation of all of the public game data, which inclues:
//  - Tile placements on the map
//  - Number of remaining tiles that the referee holds
//  - The player turn order, names and corresponding scores

// A RenderableGameState is the serialized public game data, which can be rendered. It includes all of the same information as the ObservableGameState but able to be rendered in a graphical context.

// Sends the observer the public data representing the current state of the game
... updateObservableGameState(ObservableGameState) => void

// Sends the observer a renderable representation of the current state of the game
... updateRenderableGameState(RenderableGameState) => void

// Informs the observer that the game has ended and gives them:
//  - The final Scoreboard, which has the names and scores of each player
//  - A list of the winning players
//  - A list of the players that were eliminated during the game
... gameOver(Scoreboard, Winners, EliminatedPlayers) => void

// Sends an advertisement to the observer
... sendAdvertisement(Advertisement) => void

```

### Game System to Game Observer Protocol

- The Game Observers should be sent updated game data (via
  `updateObservableGameState` and `updateRenderableGameState`) after any change
  in the publicly visible state of the game. This includes:
  - Start of a game
  - End of each turn
  - When a player is eliminated
- At the end of the game the Game Observer should be informed via `gameOver`
- At any time, the observer can be sent an advertisement to view via
  `sendAdvertisement`

### Interactions with Game Observer View

- A single person can interact with the game observer by:
  - Rendering in a graphical context the serialized renderable data received via
    `updateRenderableGameState`
    - For example, this could be a serialized html string that can be rendered
      in a browser
  - Interpreting the `ObservableGameState` received via
    `updateObservableGameState`
    - For example, this could be used to make predictions about the game or do
      other analyses
  - Viewing the advertisement received from via `sendAdvertisement`
  - View the scoreboard, winners and eliminated players when the game ends via
    the data received from `gameOver`

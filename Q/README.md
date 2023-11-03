# Q Game

## Milestone Overviews

Milestone 2 focused on creating reusable map components. Because a main entry point has not been created yet, Q Game cannot be run.

Milestone 3 focused on creating the game state for the Q game. The game state keeps track of the players order, the map, and the remaining tiles. We also created a testing harness to test our map, and outlined a design for the player-interface in `Planning/player-interface.md`

Milestone 4 focused on adding rendering and scoring functionality to the GameState. The game state now contains a method to score a placement and to generate graphical data, in our case HTML, for the current game state. We also created a testing harness for testing valid placements, and designed a protocol for the player-referee interface in `Planning/player-protocol`.

Milestone 5 focused on adding strategies for players to use to decide what turn they should make. We implemented to concrete strategies, one that chooses placements based on row-column ordering, and one the chooses placements based on the number of neighbors. We also created a testing harness for testing scoring, and designed the game state - referee protocol in `Planning/referee-state`.

Milestone 6 focused on creating the referee and player implementations. The Player interface follows exactly the specs given in the assignment, and also takes in a strategy in its constructor. The BaseReferee function sets up a game and runs it to completion. We also created a testing harness for strategies and designed an observer interface in `Planning/game-observer`

Milestone 7 focused on cleaning up tech debt that we had in our codebase. Our todo list and completed items can be found in the git history of `Planning/todo.md`.

## Notable Files and Folders

`Common/`: Symlinks to components required for milestone submissions. If a symlink is broken, please check for the source file in `src/`

`Player/`: Symlinks to components required for milestone submissions about players.

`Referee/`: Symlinks to components required for milestone submissions about the referee.

`Planning/`: Artifacts from Q Game design tasks and ideation sessions are stored here. System and component designs in `Planning/` describe a wishlist of functionality that we intend to implement within Q Game

`src/`: Q Game's source code. Unit tests for each component are located beside the component they test (Ex. `tile.ts` and `tile.test.ts`). Only components relevant to the Q Game map and game state are currently implemented

`src/game`: The code for creating the data representation of the Q Game. Includes data representations for the Map, Rules, GameState, and others, and is outlined in more detail in the [roadmap](#roadmap) section.

`src/referee`: The code for the referee implementation. Includes the type definition for a referee function, utility methods for a referee to use, and an implementation of a BaseReferee.

`src/player`: The code for the player implementations, including the Player interface, a BasePlayer implementation of that interface, and the strategies that a player can use.

`src/electron`: Root of the electron project for this project. Contains functionality for creating a new electron window from provided html data. Currently, this directory is used more as a proof of concept, and for manually testing various map configurations.

`Makefile`: `make` rules for building, testing, and cleaning project

`package.json`: Defines Q Game's required dependencies, as well as additional project metadata

`xtest`: Executable that runs unit tests on Q Game components

`../4/`: One level above the Q directory, the `4/` directory contains an `xlegal` executable test harness used for running integration tests for checking valid placements for milestone 4. This directory also contains JSON integration tests in `4/Tests/` which can be run with the `xlegal` harness.

`../5/`: One level above the Q directory, the `5/` directory contains an `xscore` executable test harness used for running integration tests for checking scores for milestone 5. This directory also contains JSON integration tests in `5/Tests/` which can be run with the `xscore` harness

`../6/`: One level above the Q directory, the `6/` directory contains an `xstrategy` executable test harness used for running integration tests for checking strategies for milestone 6. This directory also contains JSON integration tests in `6/Tests/` which can be run with the `xstrategy` harness

`../7/`: One level above the Q directory, the `7/` directory contains an `xgames` executable test harness used for running integration tests for checking strategies for milestone 7. This directory also contains JSON integration tests in `7/Tests/` which can be run with the `xgames` harness

## Roadmap

All of the following files are located in the `src/` directory

### `src/game/gameState`

- `gameState.ts`

  The `GameState` component stores information about the progress of a game. It uses the type `GameStatus` to track whether the game is in progress or has finished. It has a `PlayerTurnQueue` to track the players currently in the game and the order in which they take turns. It also stores the map for the game and the remaining tiles. Its purpose is to track game data during a game and to provide public functionality for a future referee implementation to manipulate the state of a game by executing player moves, validating placements, and retrieving relevant information for the active player.
  As of milestone 4, the GameState also provides functionality for scoring a placement, and creating graphically renderable data for the current game state.
  As of milestone 6, the GameState provides functionality for checking end of game rules.

- `playerTurnQueue.ts`

  The `PlayerTurnQueue` is responsible for both keeping track of which players are remaining in the game, and the order in which they take turns. It provides functionality to go to the next turn, eliminate players, and get player information such as score and ids.

- `playerState.ts`

  The `PlayerState` is the knowledge that a referee has about a player. It is identified by a name which the referee provides (and which must be unique for all players in a game), the player's score, and the player's tiles. The `PlayerState` provides getters and setters for these properties.
  The `PlayerState` also contains a `Player`, which acts as a way to communicate with the 'client' player.

### `src/game/graphicalRenderer`

- `graphicalRenderer.ts`
  The `GraphicalRenderer` component is used to convert the public game state data into data that can be rendered by a graphical context. The only current implementation of that is the HTMLRenderer which converts the game state into an HTML string. A GraphicalRenderer object can be passed into the `getRenderableData` method of the GameState.

### `src/game/map`

- `map.ts`

  The `Map` component exists to store the position of tiles, and provides functionality for checking, getting, and placing a tile at a given location. The map has two default, structural rules that are always enforced: that tiles must be placed next to one another and that tiles can't be placed on top of one another. It also provides functionality for returning a list of valid placement locations when supplied with a list of `PlacementRule`s. The map is first defined by a generic `QMap` interface, which is first implemented by an abstract map. A `BaseMap` class extends the abstract map to provide a map of `BaseTile`

- `tile.ts`

  The `Tile` component is a game piece that is played on a Q Game map, first defined by a generic `QTile` interface, specifying only methods that must exist on all tiles. The interface `ShapeColorTile` extends `QTile`, enforcing required functionality for a tile that has both a shape and color, such as getting and checking equality for shape and color. `BaseTile` implements this interface

### `src/game/rules`

- `placmentmentRules.ts`

  A `PlacementRule` is a function type that uses a list of tile and coordinate pairs, alongside a map, to determine if the entire placement is valid. A placement rule returning `true` indicates that the rule is satisfied and the placement is valid, while `false` indicates that the rule is violated and the placement is invalid. Multiple functions of type `PlacementRule` are defined in `rules/placementRules.ts`. A (not yet implemented) referee will enforce these rules on player moves to determine their validity. Abstracting rules in this manner allows for easy future modifications if the rules of Q Game ever change.

- `scoreingRules.ts`

  A `ScoringRule` is a function type that uses a list of tile and coordinate pairs, a getter method for a map, and a list of the active players tiles to score a turn. A scoring rule returns a number representing the amount of points the player should receive for that rule for the given placement. These rules can be passed into the getPlacementScore method in the GameState, along with a list of tile placements, to get the total score for a turn. Scoring rules are passed into the second argument of a RuleBook to be stored for a game.

- `endOfGameRules.ts`

An `endOfGameRule` is a function type that uses the player turn queue to determine whether a game should be considered over. It returns a boolean, which is true if the game should be over, and false otherwise. These rules can be passed into the isGameOver() method in the GameState to determine whether that game should be over.

- `rules/ruleBook.ts`

  The `RuleBook` component is an elegant way to store an immutable list of rules. Using a rule book ensures that the rules of Q Game do not change during the game, allows for rulesets to be defined, and allows future expandability for other types of rules (currently `PlacementRule`, `ScoringRule`, and `EndOfGameRule` lists are supported). A `QRuleBook` interface defines common functionality for retrieving placement rules, which is implemented by an abstract class. A `BaseRuleBook` class extends the abstract class and uses the placement rules relevant for a `ShapeColorTile`.

### `src/game/types`

- Directory to store all types for the Q game.

### `src/referee/referee`

- The Referee exists to run games from start to finish. The BaseReferee function creates a game with BaseTiles, and runs the game until one of the EndOfGame rules are satisfied. The referee returns a list of the winners and a list of the eliminated players.

### `src/player/player.ts`

- The Player interface defines the functionality that a player of the Q game needs to implement. The most important functions in this interface are `takeTurn`, which uses a strategy to make moves given the public game state data, `name` which gets the players name, and `win` which tells the player if they won. The other two methods, `setup` and `newTiles` are implemented for pedagogical reasons.

### `src/player/strategy.ts`

- A strategy helps a player decide which moves to make. The two strategies we have concrete implementations of are `DagStrategy` which chooses placements based on row-column ordering, and `LdasgStrategy` which chooses placements based on most neighbors.

### `src/player/strategySorters.ts`

- The strategy sorters are the accumulator functions that are used to sort a list of placements. Given two placements, they choose which should be considered first, either based on row-column ordering or on number of neighbors

### `src/electron`

- Directory that is the root of the electron project. Defines functionality for creating a new Electron window that uses html to render the game state.

## Running Internal Tests

After installing dependencies with `make`, run `./xtest` to ensure all of Q Game's components pass their unit tests. An exit code of 0 indicates success, while all other exit codes indicate a test failure.

## Running Map Testing Harness

Navigate to the top-level directory `7/`, found in the repository root. Run `make` to install required dependencies that are required for the test harness to run. To run the harness, run `./xgames` and enter JSON input to STDIN.

Alternatively, use `<` to feed the contents of a test file to the harness. 5 of our tests are available in the `7/Tests/` directory.

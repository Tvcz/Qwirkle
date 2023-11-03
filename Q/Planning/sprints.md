# Sprint Planning Memorandum

### TO: 'Dot Game' Company

### FROM: Nathan Kirschner and Jackson Terrill

### DATE: September 13, 2023

### SUBJECT: Sprint Planning

We believe the most important component to be finished first is the referee, since this determines how the game is played. After this, we can work on collecting and validating input from users, including registration, starting games, making moves, and ending games. Finally, once we have a working game and a way for players to interact with it, we can create an interface for observers to view the state of the game.

- Sprint 1: Internal Game State
  - Implement 'referee'
  - Handles all game logic
  - Starting a game, turn order, valid and invalid turns, ending a game, etc.
  - Define all the game pieces
  - Define the map
- Sprint 2: Input
  - Implement the player-referee interface
  - Create a player implementation for validating the game, which could be used as a house player
  - Overall goal is to provide a way to interact with the referee from sprint 1
  - Defines interactions between outside players and the game
  - Handles input validation
  - Enables players to join games, make moves in the game, and end games
- Sprint 3: Observers
  - Overall goal is to provide a way to observe a current game
  - Handles interface for observers
  - Support for both showing game state and other visuals such as advertisements
  - Visualizes the interal state defined in sprint 1, and the inputs processed from sprint 2

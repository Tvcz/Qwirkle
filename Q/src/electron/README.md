## Electron
The `electron` folder contains the code for the electron app. Our application
runs on the `main` side of an electron app, which uses messages as defined in
the `preload`er to communicate with the `renderer` side of the electron app.

This allows our observer to graphically render an html representation of the
game state through electron.

### Files
`main` acts as the entry point for our app, and so contains files used in the
program startup:
- `main.ts` - which runs a local game, optionall with observers
  - `gameStateWindow.ts` - which creates an electron window for observers
  - `xgames-with-observers.ts` - which parses game state data from input for running a local game
    and creates the game
- `server.ts` and `client.ts` - which run a game over a network, for the server
  and client sides respectively
  - `configRunner.ts` - which parses configuration data from input for running a game over a network
    and spins up the server or client
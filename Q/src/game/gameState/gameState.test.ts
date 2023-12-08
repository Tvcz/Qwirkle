import { RandomBagOfTiles } from './bagOfTiles';
import Coordinate from '../map/coordinate';
import { GameState } from './gameState';
import TileMap from '../map/map';
import PlayerState from './playerState';
import PlayerTurnQueue from './playerTurnQueue';
import {
  coordinateMustBeEmpty,
  coordinateMustShareASide,
  mustMatchNeighboringShapesOrColors
} from '../rules/placementRules';
import { BaseTile } from '../map/tile';
import {
  pointPerTileInSequence,
  pointPerTilePlaced,
  pointsForPlayingAllTiles,
  pointsPerQ
} from '../rules/scoringRules';
import { BasePlayer } from '../../player/player';
import { DagStrategy } from '../../player/strategy';
import { BaseRuleBook } from '../rules/ruleBook';
import { BaseTurnAction } from '../../player/turnAction';
import { gameStateHtmlBuilder } from '../graphicalRenderer/htmlBuilder';

const arrangeGameState = () => {
  const map = new TileMap([
    { coordinate: new Coordinate(0, 0), tile: new BaseTile('square', 'red') }
  ]);
  const playerController1 = new BasePlayer(
    'bob',
    new DagStrategy(),
    new BaseRuleBook()
  );
  const player1 = new PlayerState<BaseTile>(playerController1);
  const playerController2 = new BasePlayer(
    'john',
    new DagStrategy(),
    new BaseRuleBook()
  );
  const player2 = new PlayerState<BaseTile>(playerController2);
  const playerTurnQueue = new PlayerTurnQueue<BaseTile>([player1, player2]);
  const bagOfTiles = new RandomBagOfTiles<BaseTile>([
    new BaseTile('8star', 'blue'),
    new BaseTile('8star', 'blue'),
    new BaseTile('8star', 'blue')
  ]);
  const gameState = new GameState(map, playerTurnQueue, bagOfTiles);
  return { gameState, player1, player2, map };
};

const createRedSquarePlacement = (x: number, y: number) => {
  return {
    tile: new BaseTile('square', 'red'),
    coordinate: new Coordinate(x, y)
  };
};

describe('tests for gameState class', () => {
  test('isValidPlacement is true if placement matches given rules', () => {
    // Arrange
    const { gameState, player1 } = arrangeGameState();
    player1.setTiles([new BaseTile('diamond', 'red')]);

    // Act
    const isValid = gameState.isValidPlacement(
      [
        {
          tile: new BaseTile('diamond', 'red'),
          coordinate: new Coordinate(1, 0)
        }
      ],
      [
        coordinateMustBeEmpty,
        coordinateMustShareASide,
        mustMatchNeighboringShapesOrColors
      ]
    );

    // Assert
    expect(isValid).toBe(true);
  });
  test('isValidPlacement is true if placement matches given rules for sequence of tiles', () => {
    // Arrange
    const { gameState, player1 } = arrangeGameState();
    player1.setTiles([
      new BaseTile('diamond', 'red'),
      new BaseTile('diamond', 'red'),
      new BaseTile('square', 'red')
    ]);

    // Act
    const isValid = gameState.isValidPlacement(
      [
        {
          tile: new BaseTile('diamond', 'red'),
          coordinate: new Coordinate(1, 0)
        },
        {
          tile: new BaseTile('diamond', 'red'),
          coordinate: new Coordinate(2, 0)
        },
        {
          tile: new BaseTile('square', 'red'),
          coordinate: new Coordinate(3, 0)
        }
      ],
      [
        coordinateMustBeEmpty,
        coordinateMustShareASide,
        mustMatchNeighboringShapesOrColors
      ]
    );

    // Assert
    expect(isValid).toBe(true);
  });
  test("isValidPlacement is false if placement doesn't match given rules", () => {
    // Arrange
    const { gameState } = arrangeGameState();

    // Act
    const isValid = gameState.isValidPlacement(
      [
        {
          tile: new BaseTile('diamond', 'green'),
          coordinate: new Coordinate(1, 0)
        }
      ],
      [
        coordinateMustBeEmpty,
        coordinateMustShareASide,
        mustMatchNeighboringShapesOrColors
      ]
    );

    // Assert
    expect(isValid).toBe(false);
  });
  test("isValidPlacement is false if placement doesn't match given rules for sequence of tiles", () => {
    // Arrange
    const { gameState } = arrangeGameState();

    // Act
    const isValid = gameState.isValidPlacement(
      [
        {
          tile: new BaseTile('diamond', 'green'),
          coordinate: new Coordinate(1, 0)
        },
        {
          tile: new BaseTile('diamond', 'green'),
          coordinate: new Coordinate(3, 0)
        },
        {
          tile: new BaseTile('diamond', 'green'),
          coordinate: new Coordinate(2, 0)
        }
      ],
      [
        coordinateMustBeEmpty,
        coordinateMustShareASide,
        mustMatchNeighboringShapesOrColors
      ]
    );

    // Assert
    expect(isValid).toBe(false);
  });
  test('isValidPlacement is true if player owns all the tiles they tried to place', () => {
    // Arrange
    const { gameState, player1 } = arrangeGameState();
    const tiles = [
      new BaseTile('diamond', 'red'),
      new BaseTile('diamond', 'red'),
      new BaseTile('diamond', 'blue')
    ];
    player1.setTiles(tiles);

    // Act
    const isValid = gameState.isValidPlacement(
      [
        {
          tile: tiles[0],
          coordinate: new Coordinate(1, 0)
        },
        {
          tile: tiles[1],
          coordinate: new Coordinate(2, 0)
        }
      ],
      [
        coordinateMustBeEmpty,
        coordinateMustShareASide,
        mustMatchNeighboringShapesOrColors
      ]
    );

    // Assert
    expect(isValid).toBe(true);
  });
  test("isValidPlacement is false if active player doesn't own all the tiles they try to place", () => {
    // Arrange
    const { gameState, player1 } = arrangeGameState();
    const tiles = [
      new BaseTile('diamond', 'red'),
      new BaseTile('diamond', 'blue'),
      new BaseTile('diamond', 'blue')
    ];
    player1.setTiles(tiles);

    // Act
    const isValid = gameState.isValidPlacement(
      [
        {
          tile: tiles[0],
          coordinate: new Coordinate(1, 0)
        },
        {
          tile: new BaseTile('8star', 'yellow'),
          coordinate: new Coordinate(2, 0)
        }
      ],
      [
        coordinateMustBeEmpty,
        coordinateMustShareASide,
        mustMatchNeighboringShapesOrColors
      ]
    );

    // Assert
    expect(isValid).toBe(false);
  });
  test('isValidPlacement is false if player places more than one of a tile they only own one of', () => {
    // Arrange
    const { gameState, player1 } = arrangeGameState();
    const tiles = [
      new BaseTile('diamond', 'red'),
      new BaseTile('diamond', 'blue')
    ];
    player1.setTiles(tiles);

    // Act
    const isValid = gameState.isValidPlacement(
      [
        {
          tile: tiles[0],
          coordinate: new Coordinate(1, 0)
        },
        {
          tile: tiles[0],
          coordinate: new Coordinate(2, 0)
        }
      ],
      [
        coordinateMustBeEmpty,
        coordinateMustShareASide,
        mustMatchNeighboringShapesOrColors
      ]
    );

    // Assert
    expect(isValid).toBe(false);
  });
  test('isValidPlacement is true if player places two of a tile that they own two of', () => {
    // Arrange
    const { gameState, player1 } = arrangeGameState();
    const tiles = [
      new BaseTile('diamond', 'red'),
      new BaseTile('diamond', 'red')
    ];
    player1.setTiles(tiles);

    // Act
    const isValid = gameState.isValidPlacement(
      [
        {
          tile: tiles[0],
          coordinate: new Coordinate(1, 0)
        },
        {
          tile: tiles[0],
          coordinate: new Coordinate(2, 0)
        }
      ],
      [
        coordinateMustBeEmpty,
        coordinateMustShareASide,
        mustMatchNeighboringShapesOrColors
      ]
    );

    // Assert
    expect(isValid).toBe(true);
  });
  test('passTurn changes the turn to the next player in the queue', () => {
    // Arrange
    const { gameState } = arrangeGameState();

    // Act
    gameState.passTurn();

    // Assert
    expect(gameState.getActivePlayerInfo().playersQueue[0]).toBe('john');
  });
  test('pass turn sets the players most recent turn to PASS', () => {
    // Arrange
    const { gameState, player1 } = arrangeGameState();

    // Act
    gameState.passTurn();

    // Assert
    expect(player1.getMostRecentTurn()).toStrictEqual({
      turnAction: new BaseTurnAction('PASS'),
      playerTiles: []
    });
  });
  test('exchangeTurn throws error if the player has more tiles than are remaining in the bag', () => {
    // Arrange
    const { gameState, player1 } = arrangeGameState();
    player1.setTiles([
      new BaseTile('8star', 'blue'),
      new BaseTile('8star', 'blue'),
      new BaseTile('8star', 'blue'),
      new BaseTile('8star', 'blue')
    ]);

    // Act
    // Assert
    expect(() => gameState.exchangeTurn()).toThrow(
      'player has more tiles than remaining in the bag'
    );
  });
  test('exchangeTurn replaces all player tiles with tiles from the bag', () => {
    // Arrange
    const { gameState, player1 } = arrangeGameState();
    player1.setTiles([
      new BaseTile('diamond', 'red'),
      new BaseTile('square', 'green'),
      new BaseTile('clover', 'orange')
    ]);

    // Act
    gameState.exchangeTurn();

    // Assert
    expect(player1.getAllTiles()[0].getShape()).toBe('8star');
    expect(player1.getAllTiles()[0].getColor()).toBe('blue');
    expect(player1.getAllTiles()[1].getShape()).toBe('8star');
    expect(player1.getAllTiles()[1].getColor()).toBe('blue');
    expect(player1.getAllTiles()[2].getShape()).toBe('8star');
    expect(player1.getAllTiles()[2].getColor()).toBe('blue');
  });
  test('exchangeTurn moves turn to the next player in the queue', () => {
    // Arrange
    const { gameState } = arrangeGameState();

    // Act
    gameState.exchangeTurn();

    // Assert
    expect(gameState.getActivePlayerInfo().playersQueue[0]).toBe('john');
  });
  test('exchange turn sets the players most recent turn to EXCHANGE', () => {
    // Arrange
    const { gameState, player1 } = arrangeGameState();

    // Act
    gameState.exchangeTurn();

    // Assert
    expect(player1.getMostRecentTurn()).toStrictEqual({
      turnAction: new BaseTurnAction('EXCHANGE'),
      playerTiles: []
    });
  });
  test('placeTurn adds the played tiles to the map', () => {
    // Arrange
    const { gameState, map } = arrangeGameState();

    // Act
    gameState.placeTurn([
      {
        tile: new BaseTile('square', 'green'),
        coordinate: new Coordinate(0, 1)
      },
      {
        tile: new BaseTile('diamond', 'green'),
        coordinate: new Coordinate(0, 2)
      }
    ]);

    // Assert
    expect(map.getTile(new Coordinate(0, 1))?.getShape()).toBe('square');
    expect(map.getTile(new Coordinate(0, 1))?.getColor()).toBe('green');
    expect(map.getTile(new Coordinate(0, 2))?.getShape()).toBe('diamond');
    expect(map.getTile(new Coordinate(0, 2))?.getColor()).toBe('green');
  });
  test('placeTurn adds tile to the map if given in a correct ordering such that all tiles share a side', () => {
    // Arrange
    const { gameState, map, player1 } = arrangeGameState();
    player1.setTiles([new BaseTile('square', 'red')]);

    // Act
    gameState.placeTurn([
      createRedSquarePlacement(1, 0),
      createRedSquarePlacement(2, 0),
      createRedSquarePlacement(3, 0),
      createRedSquarePlacement(4, 0),
      createRedSquarePlacement(5, 0),
      createRedSquarePlacement(2, -1),
      createRedSquarePlacement(2, -2),
      createRedSquarePlacement(6, 0),
      createRedSquarePlacement(6, 1),
      createRedSquarePlacement(6, -1),
      createRedSquarePlacement(-1, 0)
    ]);

    // Assert
    expect(map.getTile(new Coordinate(1, 0))).toBeDefined();
    expect(map.getTile(new Coordinate(2, 0))).toBeDefined();
    expect(map.getTile(new Coordinate(-1, 0))).toBeDefined();
    expect(map.getTile(new Coordinate(5, 0))).toBeDefined();
    expect(map.getTile(new Coordinate(2, -2))).toBeDefined();
    expect(map.getTile(new Coordinate(2, -1))).toBeDefined();
    expect(map.getTile(new Coordinate(3, 0))).toBeDefined();
    expect(map.getTile(new Coordinate(4, 0))).toBeDefined();
    expect(map.getTile(new Coordinate(6, 0))).toBeDefined();
    expect(map.getTile(new Coordinate(6, 1))).toBeDefined();
    expect(map.getTile(new Coordinate(6, -1))).toBeDefined();
  });
  test('placeTurn replaces players tiles with new tiles from the bag', () => {
    // Arrange
    const { gameState, player1 } = arrangeGameState();

    // Act
    gameState.placeTurn([
      {
        tile: new BaseTile('square', 'green'),
        coordinate: new Coordinate(0, 1)
      },
      {
        tile: new BaseTile('diamond', 'green'),
        coordinate: new Coordinate(0, 2)
      }
    ]);

    // Assert
    expect(gameState.getActivePlayerInfo().remainingTilesCount).toBe(1);
    expect(player1.getAllTiles()[0].getShape()).toBe('8star');
    expect(player1.getAllTiles()[0].getColor()).toBe('blue');
    expect(player1.getAllTiles()[1].getShape()).toBe('8star');
    expect(player1.getAllTiles()[1].getColor()).toBe('blue');
  });
  test('placeTurn will only replace the number of tiles left in the bag', () => {
    // Arrange
    const { gameState, player1 } = arrangeGameState();

    // Act
    gameState.placeTurn([
      {
        tile: new BaseTile('square', 'green'),
        coordinate: new Coordinate(0, 1)
      },
      {
        tile: new BaseTile('diamond', 'green'),
        coordinate: new Coordinate(0, 2)
      },
      {
        tile: new BaseTile('diamond', 'green'),
        coordinate: new Coordinate(0, 3)
      },
      {
        tile: new BaseTile('diamond', 'green'),
        coordinate: new Coordinate(0, 4)
      }
    ]);

    // Assert
    expect(player1.getAllTiles().length).toBe(3);
    expect(gameState.getActivePlayerInfo().remainingTilesCount).toBe(0);
  });
  test('placeTurn moves turn to the next player in the queue', () => {
    // Arrange
    const { gameState } = arrangeGameState();

    // Act
    gameState.placeTurn([]);

    // Assert
    expect(gameState.getActivePlayerInfo().playersQueue[0]).toBe('john');
  });
  test('pass turn sets the players most recent turn to the tiles placed and old player tiles', () => {
    // Arrange
    const { gameState, player1 } = arrangeGameState();
    player1.setTiles([new BaseTile('8star', 'blue')]);

    // Act
    gameState.placeTurn([
      { tile: new BaseTile('8star', 'blue'), coordinate: new Coordinate(0, 1) }
    ]);

    // Assert
    expect(player1.getMostRecentTurn()).toStrictEqual({
      turnAction: new BaseTurnAction('PLACE', [
        {
          tile: new BaseTile('8star', 'blue'),
          coordinate: new Coordinate(0, 1)
        }
      ]),
      playerTiles: [new BaseTile('8star', 'blue')]
    });
  });
  test('getActivePlayerInfo gets info about the active player', () => {
    // Arrange
    const { gameState, player1 } = arrangeGameState();
    const tile = new BaseTile('square', 'red');
    player1.setTiles([tile]);

    // Act
    const {
      playerTiles,
      scoreboard,
      mapState,
      remainingTilesCount,
      playersQueue
    } = gameState.getActivePlayerInfo();

    // Assert
    expect(playerTiles[0]).toBe(tile);
    expect(scoreboard[0]).toStrictEqual({ name: 'bob', score: 0 });
    expect(scoreboard[1]).toStrictEqual({ name: 'john', score: 0 });
    expect(remainingTilesCount).toBe(3);
    expect(playersQueue[0]).toBe('bob');
    expect(playersQueue[1]).toBe('john');
    expect(mapState.length).toBe(1);
    expect(mapState[0].coordinate.equals(new Coordinate(0, 0))).toBe(true);
    expect(mapState[0].tile.equals(new BaseTile('square', 'red'))).toBe(true);
  });
  test('eliminate player removes player from queue', () => {
    // Arrange
    const { gameState, player1 } = arrangeGameState();

    // Act
    gameState.eliminatePlayer(player1.getName());

    // Assert
    expect(gameState.getActivePlayerInfo().playersQueue[0]).toBe('john');
  });
  test('eliminatePlayer called with a turnAction adds that action as the players most recent move', () => {
    // Arrange
    const { gameState, player1 } = arrangeGameState();

    // Act
    gameState.eliminatePlayer(player1.getName(), new BaseTurnAction('PASS'));

    // Assert
    expect(player1.getMostRecentTurn()).toStrictEqual({
      playerTiles: [],
      turnAction: new BaseTurnAction('PASS')
    });
  });
  test('eliminatePlayer adds players tiles to the end of the bag', () => {
    // Arrange
    const { gameState, player1 } = arrangeGameState();
    player1.setTiles([
      new BaseTile('8star', 'blue'),
      new BaseTile('8star', 'blue')
    ]);

    // Act
    gameState.eliminatePlayer(player1.getName());

    // Assert
    expect(gameState.getActivePlayerInfo().remainingTilesCount).toBe(5);
  });
  test('isGameOver checks all given end of game rules and returns true if one of them returns true', () => {
    // Arrange
    const { gameState } = arrangeGameState();
    const rule1 = jest.fn().mockReturnValue(false);
    const rule2 = jest.fn().mockReturnValue(true);
    const rule3 = jest.fn().mockReturnValue(false);

    // Act
    const isOver = gameState.isGameOver([rule1, rule2, rule3]);

    expect(isOver).toBe(true);
  });
  test('isGameOver checks all given end of game rules and returns false if none of them return true', () => {
    // Arrange
    const { gameState } = arrangeGameState();
    const rule1 = jest.fn().mockReturnValue(false);
    const rule2 = jest.fn().mockReturnValue(false);
    const rule3 = jest.fn().mockReturnValue(false);

    // Act
    const isOver = gameState.isGameOver([rule1, rule2, rule3]);

    expect(isOver).toBe(false);
  });
  test('getRenderableData returns the html data for a game state when passed an HTMLRenderer object', () => {
    // Arrange
    const { gameState } = arrangeGameState();

    // Act
    const gameStateRenderableData = gameStateHtmlBuilder(
      gameState.getRenderableData()
    );

    // Assert
    expect(gameStateRenderableData.replace(/\s/g, '')).toBe(
      ARRANGED_GAME_STATE.replace(/\s/g, '')
    );
  });
  test('getPlacementScore adds the scores returned from every scoring rule', () => {
    // Arrange
    const { gameState, player1 } = arrangeGameState();
    player1.setTiles([
      new BaseTile('square', 'blue'),
      new BaseTile('diamond', 'red'),
      new BaseTile('diamond', 'red')
    ]);
    const tilePlacements = [
      {
        tile: new BaseTile('square', 'blue'),
        coordinate: new Coordinate(0, 1)
      },
      {
        tile: new BaseTile('square', 'blue'),
        coordinate: new Coordinate(0, 2)
      },
      {
        tile: new BaseTile('square', 'blue'),
        coordinate: new Coordinate(0, 3)
      }
    ];

    // Act
    const score = gameState.getPlacementScore(tilePlacements, [
      pointPerTilePlaced,
      pointPerTileInSequence,
      pointsForPlayingAllTiles(6),
      pointsPerQ(6)
    ]);

    expect(score).toBe(13);
  });
  test('isRoundOver returns true if the active player is the first player in a round', () => {
    // Arrange
    const { gameState } = arrangeGameState();

    // Act
    const isOver = gameState.isRoundOver();

    // Asset
    expect(isOver).toBe(true);
  });
  test('isRoundOver returns false if the active player is not the first player in a round', () => {
    // Arrange
    const { gameState } = arrangeGameState();
    gameState.passTurn();

    // Act
    const isOver = gameState.isRoundOver();

    // Asset
    expect(isOver).toBe(false);
  });
  test('getActivePlayerController returns the controller of the active player', () => {
    // Arrange
    const { gameState, player1 } = arrangeGameState();

    // Act
    const controller = gameState.getActivePlayerController();

    // Assert
    expect(controller).toBe(player1.getPlayerController());
  });
  test('getActivePlayerController throws error if there are no players left', () => {
    // Arrange
    const { gameState } = arrangeGameState();
    gameState.eliminatePlayer('bob');
    gameState.eliminatePlayer('john');

    // Act, Assert
    expect(() => gameState.getActivePlayerController()).toThrow();
  });
  test('getAllPlayerSetupInformation returns the name, tiles, and setup function for each player', () => {
    // Arrange
    const { gameState, player1, player2 } = arrangeGameState();

    // Act
    const setupInfo = gameState.getAllPlayersSetupInformation();

    // Assert
    expect(setupInfo[0]).toStrictEqual({
      name: 'bob',
      tiles: player1.getAllTiles(),
      setUp: expect.any(Function)
    });
    expect(setupInfo[1]).toStrictEqual({
      name: 'john',
      tiles: player2.getAllTiles(),
      setUp: expect.any(Function)
    });
    expect(setupInfo.length).toBe(2);
  });
  test('getAllPlayerEndGameInformation returns the name, and win function for each player', () => {
    // Arrange
    const { gameState } = arrangeGameState();

    // Act
    const endGameInfo = gameState.getAllPlayersEndGameInformation();

    // Assert
    expect(endGameInfo[0]).toStrictEqual({
      name: 'bob',
      win: expect.any(Function)
    });
    expect(endGameInfo[1]).toStrictEqual({
      name: 'john',
      win: expect.any(Function)
    });
    expect(endGameInfo.length).toBe(2);
  });
  test('getEliminatedPlayerNames returns the names of eliminated players', () => {
    // Arrange
    const { gameState } = arrangeGameState();
    gameState.eliminatePlayer('bob');

    // Act
    const eliminatedPlayers = gameState.getEliminatedPlayerNames();

    // Assert
    expect(eliminatedPlayers).toStrictEqual(['bob']);
  });
  test('updatePlayerScore increases the score of the given player by the given delta amount', () => {
    // Arrange
    const { gameState } = arrangeGameState();

    // Act
    gameState.updatePlayerScore('bob', 10);

    expect(gameState.getScoreboard()).toStrictEqual([
      { name: 'bob', score: 10 },
      { name: 'john', score: 0 }
    ]);
  });
});

const ARRANGED_GAME_STATE = `
<!doctype html>
<html style="height: 100vh;">
    <head>
        <title>Q</title>
    </head>
    
    <body>
        <h1>Q Game</h1>
        
    <div style="display: grid;grid-template-rows: repeat(1, 50px);grid-template-columns: repeat(1, 50px);column-gap: 10px;row-gap: 10px;width: max-content;border: 1px solid black;">
        
    <div style="width: 50px;height: 50px;position: relative;display: flex;justify-content: center;align-items: center;grid-column-start: 1;grid-row-start: 1;">
        <div style="background-color: red;width: 45px;height: 45px;"></div>
    </div>
    
    </div>
    
        <div style="display: flex;column-gap: 50px;">
            
        <div style="display: flex;flex-direction: column;">
            <h3>Scoreboard: </h3>
            <div style="display: flex;flex-direction: row;justifycontent: space-between;column-gap: 20px;font-size: 24px;">
                <p>Name</p>
                <p>Score</p>
            </div>
            
            <div style="display: flex;flex-direction: row;justify-dontent: space-between;column-gap: 20px;">
                <p>bob</p>
                <p>0</p>
            </div>
        
            <div style="display: flex;flex-direction: row;justify-dontent: space-between;column-gap: 20px;">
                <p>john</p>
                <p>0</p>
            </div>
        
        </div>

            
        <div>
            <h3>Turn Order: </h3>
            [ <span style="margin: 0 10px;">bob</span><span style="margin: 0 10px;">john</span> ]
        </div>

            
        <div>
            <h3>Remaining Tiles: </h3>
            <p style="font-size: 30px;">
                3
            </p>
        </div>

        </div>
    </body>

</html>
`;

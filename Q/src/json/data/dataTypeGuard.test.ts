import {
  isCheatJActor,
  isExceptionJActor,
  isJActorsB,
  isJChoice,
  isJMap,
  isJPlacements,
  isJPub,
  isJState,
  isJTile,
  isLoopJActor,
  isSimpleJActor
} from './dataTypeGuards';

describe('tests for the json data definitions type guards', () => {
  test('isJState', () => {
    // Arrange
    const goodJState = {
      map: [
        [0, [0, { color: 'red', shape: 'circle' }]],
        [1, [0, { color: 'blue', shape: 'square' }]],
        [2, [0, { color: 'green', shape: 'diamond' }]]
      ],
      'tile*': [
        { color: 'red', shape: 'circle' },
        { color: 'blue', shape: 'square' },
        { color: 'green', shape: 'diamond' }
      ],
      players: [
        {
          score: 2,
          name: 'player1',
          'tile*': [
            { color: 'red', shape: 'circle' },
            { color: 'blue', shape: 'square' },
            { color: 'green', shape: 'diamond' }
          ]
        },
        {
          score: 22,
          name: 'player2',
          'tile*': [
            { color: 'purple', shape: 'circle' },
            { color: 'green', shape: 'square' },
            { color: 'orange', shape: 'diamond' }
          ]
        },
        {
          score: 19,
          name: 'player3',
          'tile*': [
            { color: 'red', shape: 'circle' },
            { color: 'red', shape: 'star' },
            { color: 'green', shape: 'diamond' }
          ]
        }
      ]
    };
    const goodVariantJState = {
      map: [],
      'tile*': [],
      players: [
        {
          score: 19,
          name: 'player3',
          'tile*': [
            { color: 'red', shape: 'circle' },
            { color: 'red', shape: 'star' },
            { color: 'green', shape: 'diamond' }
          ]
        }
      ]
    };
    const badMapJState1 = {
      map: 'mymap',
      'tile*': [
        { color: 'red', shape: 'circle' },
        { color: 'blue', shape: 'square' },
        { color: 'green', shape: 'diamond' }
      ],
      players: [
        {
          score: 2,
          name: 'player1',
          'tile*': [
            { color: 'red', shape: 'circle' },
            { color: 'blue', shape: 'square' },
            { color: 'green', shape: 'diamond' }
          ]
        },
        {
          score: 22,
          name: 'player2',
          'tile*': [
            { color: 'purple', shape: 'circle' },
            { color: 'green', shape: 'square' },
            { color: 'orange', shape: 'diamond' }
          ]
        },
        {
          score: 19,
          name: 'player3',
          'tile*': [
            { color: 'red', shape: 'circle' },
            { color: 'red', shape: 'star' },
            { color: 'green', shape: 'diamond' }
          ]
        }
      ]
    };
    const badMapJState2 = {
      map: [
        [0, [0, { color: 'red', shape: 'circle' }]],
        [1, [{ color: 'blue', shape: 'square' }]],
        [2, [0, { color: 'green', shape: 'diamond' }]]
      ],
      'tile*': [
        { color: 'red', shape: 'circle' },
        { color: 'blue', shape: 'square' },
        { color: 'green', shape: 'diamond' }
      ],
      players: [
        {
          score: 2,
          name: 'player1',
          'tile*': [
            { color: 'red', shape: 'circle' },
            { color: 'blue', shape: 'square' },
            { color: 'green', shape: 'diamond' }
          ]
        },
        {
          score: 22,
          name: 'player2',
          'tile*': [
            { color: 'purple', shape: 'circle' },
            { color: 'green', shape: 'square' },
            { color: 'orange', shape: 'diamond' }
          ]
        },
        {
          score: 19,
          name: 'player3',
          'tile*': [
            { color: 'red', shape: 'circle' },
            { color: 'red', shape: 'star' },
            { color: 'green', shape: 'diamond' }
          ]
        }
      ]
    };
    const badMapJState3 = {
      map: [
        [0, [0, { color: 'red', shape: 'circle' }]],
        [1, [0, { color: 'blue', shape: 'square' }]],
        [3, [0, { color: 'green', shape: 'diamond' }]]
      ],
      'tile*': [
        { color: 'red', shape: 'circle' },
        { color: 'blue', shape: 'square' },
        { color: 'green', shape: 'diamond' }
      ],
      players: [
        {
          score: 2,
          name: 'player1',
          'tile*': [
            { color: 'red', shape: 'circle' },
            { color: 'blue', shape: 'square' },
            { color: 'green', shape: 'diamond' }
          ]
        },
        {
          score: 22,
          name: 'player2',
          'tile*': [
            { color: 'purple', shape: 'circle' },
            { color: 'green', shape: 'square' },
            { color: 'orange', shape: 'diamond' }
          ]
        },
        {
          score: 19,
          name: 'player3',
          'tile*': [
            { color: 'red', shape: 'circle' },
            { color: 'red', shape: 'star' },
            { color: 'green', shape: 'diamond' }
          ]
        }
      ]
    };
    const badMapJState4 = {
      map: [
        [0, [0, { color: 'red', shape: 'circle' }]],
        [1, [0, { color: 'blue', shape: 'square' }]],
        [[0, { color: 'green', shape: 'diamond' }]]
      ],
      'tile*': [
        { color: 'red', shape: 'circle' },
        { color: 'blue', shape: 'square' },
        { color: 'green', shape: 'diamond' }
      ],
      players: [
        {
          score: 2,
          name: 'player1',
          'tile*': [
            { color: 'red', shape: 'circle' },
            { color: 'blue', shape: 'square' },
            { color: 'green', shape: 'diamond' }
          ]
        },
        {
          score: 22,
          name: 'player2',
          'tile*': [
            { color: 'purple', shape: 'circle' },
            { color: 'green', shape: 'square' },
            { color: 'orange', shape: 'diamond' }
          ]
        },
        {
          score: 19,
          name: 'player3',
          'tile*': [
            { color: 'red', shape: 'circle' },
            { color: 'red', shape: 'star' },
            { color: 'green', shape: 'diamond' }
          ]
        }
      ]
    };
    const badMapJState5 = {
      map: [
        [0, { color: 'red', shape: 'circle' }],
        [0, { color: 'blue', shape: 'square' }],
        [0, { color: 'green', shape: 'diamond' }]
      ],
      'tile*': [
        { color: 'red', shape: 'circle' },
        { color: 'blue', shape: 'square' },
        { color: 'green', shape: 'diamond' }
      ],
      players: [
        {
          score: 2,
          name: 'player1',
          'tile*': [
            { color: 'red', shape: 'circle' },
            { color: 'blue', shape: 'square' },
            { color: 'green', shape: 'diamond' }
          ]
        },
        {
          score: 22,
          name: 'player2',
          'tile*': [
            { color: 'purple', shape: 'circle' },
            { color: 'green', shape: 'square' },
            { color: 'orange', shape: 'diamond' }
          ]
        },
        {
          score: 19,
          name: 'player3',
          'tile*': [
            { color: 'red', shape: 'circle' },
            { color: 'red', shape: 'star' },
            { color: 'green', shape: 'diamond' }
          ]
        }
      ]
    };
    const badTilesJState1 = {
      map: [
        [0, [0, { color: 'red', shape: 'circle' }]],
        [1, [0, { color: 'blue', shape: 'square' }]],
        [2, [0, { color: 'green', shape: 'diamond' }]]
      ],
      'tile*': [
        { color: 'red' },
        { color: 'blue', shape: 'square' },
        { color: 'green', shape: 'diamond' }
      ],
      players: [
        {
          score: 2,
          name: 'player1',
          'tile*': [
            { color: 'red', shape: 'circle' },
            { color: 'blue', shape: 'square' },
            { color: 'green', shape: 'diamond' }
          ]
        },
        {
          score: 22,
          name: 'player2',
          'tile*': [
            { color: 'purple', shape: 'circle' },
            { color: 'green', shape: 'square' },
            { color: 'orange', shape: 'diamond' }
          ]
        },
        {
          score: 19,
          name: 'player3',
          'tile*': [
            { color: 'red', shape: 'circle' },
            { color: 'red', shape: 'star' },
            { color: 'green', shape: 'diamond' }
          ]
        }
      ]
    };
    const badTilesJState2 = {
      map: [
        [0, [0, { color: 'red', shape: 'circle' }]],
        [1, [0, { color: 'blue', shape: 'square' }]],
        [2, [0, { color: 'green', shape: 'diamond' }]]
      ],
      'tile*': [
        { color: 'red', shape: 'circle' },
        { shape: 'square' },
        { color: 'green', shape: 'diamond' }
      ],
      players: [
        {
          score: 2,
          name: 'player1',
          'tile*': [
            { color: 'red', shape: 'circle' },
            { color: 'blue', shape: 'square' },
            { color: 'green', shape: 'diamond' }
          ]
        },
        {
          score: 22,
          name: 'player2',
          'tile*': [
            { color: 'purple', shape: 'circle' },
            { color: 'green', shape: 'square' },
            { color: 'orange', shape: 'diamond' }
          ]
        },
        {
          score: 19,
          name: 'player3',
          'tile*': [
            { color: 'red', shape: 'circle' },
            { color: 'red', shape: 'star' },
            { color: 'green', shape: 'diamond' }
          ]
        }
      ]
    };
    const badTilesJState3 = {
      map: [
        [0, [0, { color: 'red', shape: 'circle' }]],
        [1, [0, { color: 'blue', shape: 'square' }]],
        [2, [0, { color: 'green', shape: 'diamond' }]]
      ],
      'tile*': 'tilesss',
      players: [
        {
          score: 2,
          name: 'player1',
          'tile*': [
            { color: 'red', shape: 'circle' },
            { color: 'blue', shape: 'square' },
            { color: 'green', shape: 'diamond' }
          ]
        },
        {
          score: 22,
          name: 'player2',
          'tile*': [
            { color: 'purple', shape: 'circle' },
            { color: 'green', shape: 'square' },
            { color: 'orange', shape: 'diamond' }
          ]
        },
        {
          score: 19,
          name: 'player3',
          'tile*': [
            { color: 'red', shape: 'circle' },
            { color: 'red', shape: 'star' },
            { color: 'green', shape: 'diamond' }
          ]
        }
      ]
    };
    const badPlayersJState1 = {
      map: [
        [0, [0, { color: 'red', shape: 'circle' }]],
        [1, [0, { color: 'blue', shape: 'square' }]],
        [2, [0, { color: 'green', shape: 'diamond' }]]
      ],
      'tile*': [
        { color: 'red', shape: 'circle' },
        { color: 'blue', shape: 'square' },
        { color: 'green', shape: 'diamond' }
      ],
      players: [
        {
          score: 2,
          name: 'player1',
          'tile*': [
            { color: 'red', shape: 'circle' },
            { color: 'blue', shape: 'square' },
            { color: 'green', shape: 'diamond' }
          ]
        },
        233,
        {
          score: 19,
          name: 'player3',
          'tile*': [
            { color: 'red', shape: 'circle' },
            { color: 'red', shape: 'star' },
            { color: 'green', shape: 'diamond' }
          ]
        }
      ]
    };
    const badPlayersJState2 = {
      map: [
        [0, [0, { color: 'red', shape: 'circle' }]],
        [1, [0, { color: 'blue', shape: 'square' }]],
        [2, [0, { color: 'green', shape: 'diamond' }]]
      ],
      'tile*': [
        { color: 'red', shape: 'circle' },
        { color: 'blue', shape: 'square' },
        { color: 'green', shape: 'diamond' }
      ],
      players: [
        {
          score: 2,
          name: 'player1',
          'tile*': [
            { color: 'red', shape: 'circle' },
            { color: 'blue', shape: 'square' },
            { color: 'green', shape: 'diamond' }
          ]
        },
        233,
        19
      ]
    };

    // Act & Assert
    expect(isJState(goodJState)).toBe(true);
    expect(isJState(goodVariantJState)).toBe(true);
    expect(isJState(badMapJState1)).toBe(false);
    expect(isJState(badMapJState2)).toBe(false);
    expect(isJState(badMapJState3)).toBe(false);
    expect(isJState(badMapJState4)).toBe(false);
    expect(isJState(badMapJState5)).toBe(false);
    expect(isJState(badTilesJState1)).toBe(false);
    expect(isJState(badTilesJState2)).toBe(false);
    expect(isJState(badTilesJState3)).toBe(false);
    expect(isJState(badPlayersJState1)).toBe(false);
    expect(isJState(badPlayersJState2)).toBe(false);
  });

  test('isJPub', () => {
    // Arrange
    const goodJPub = {
      map: [
        [0, [0, { color: 'red', shape: 'circle' }]],
        [1, [0, { color: 'blue', shape: 'square' }]]
      ],
      'tile*': 23,
      players: [
        {
          score: 0,
          name: 'player1',
          'tile*': [
            { color: 'red', shape: 'circle' },
            { color: 'blue', shape: 'square' }
          ]
        },
        0,
        0,
        0
      ]
    };
    const goodVariantTilesJPub1 = {
      map: [
        [0, [0, { color: 'red', shape: 'circle' }]],
        [1, [0, { color: 'blue', shape: 'square' }]]
      ],
      'tile*': 23,
      players: [
        {
          score: 0,
          name: 'player1',
          'tile*': [
            { color: 'red', shape: 'circle' },
            { color: 'blue', shape: 'square' },
            { color: 'red', shape: 'circle' },
            { color: 'blue', shape: 'square' },
            { color: 'red', shape: 'circle' },
            { color: 'blue', shape: 'square' },
            { color: 'red', shape: 'circle' },
            { color: 'blue', shape: 'square' },
            { color: 'red', shape: 'circle' },
            { color: 'blue', shape: 'square' }
          ]
        },
        0,
        0,
        0
      ]
    };
    const goodVariantTilesJPub2 = {
      map: [
        [0, [0, { color: 'red', shape: 'circle' }]],
        [1, [0, { color: 'blue', shape: 'square' }]]
      ],
      'tile*': 23,
      players: [
        {
          score: 0,
          name: 'player1',
          'tile*': []
        },
        0,
        0,
        0
      ]
    };
    const badTileCount1JPub = {
      map: [
        [0, [0, { color: 'red', shape: 'circle' }]],
        [1, [0, { color: 'blue', shape: 'square' }]]
      ],
      'tile*': -223,
      players: [
        {
          score: 0,
          name: 'player1',
          'tile*': [
            { color: 'red', shape: 'circle' },
            { color: 'blue', shape: 'square' }
          ]
        },
        0,
        0,
        0
      ]
    };
    const badTileCount2JPub = {
      map: [
        [0, [0, { color: 'red', shape: 'circle' }]],
        [1, [0, { color: 'blue', shape: 'square' }]]
      ],
      'tile*': 123123123121212,
      players: [
        {
          score: 0,
          name: 'player1',
          'tile*': [
            { color: 'red', shape: 'circle' },
            { color: 'blue', shape: 'square' }
          ]
        },
        0,
        0,
        0
      ]
    };
    const badScoresJPub1 = {
      map: [
        [0, [0, { color: 'red', shape: 'circle' }]],
        [1, [0, { color: 'blue', shape: 'square' }]]
      ],
      'tile*': 23,
      players: [
        {
          score: -2,
          name: 'player1',
          'tile*': [
            { color: 'red', shape: 'circle' },
            { color: 'blue', shape: 'square' }
          ]
        },
        0,
        0,
        0
      ]
    };
    const badScoresJPub2 = {
      map: [
        [0, [0, { color: 'red', shape: 'circle' }]],
        [1, [0, { color: 'blue', shape: 'square' }]]
      ],
      'tile*': 23,
      players: [
        {
          score: 2,
          name: 'player1',
          'tile*': [
            { color: 'red', shape: 'circle' },
            { color: 'blue', shape: 'square' }
          ]
        },
        0,
        -3,
        0
      ]
    };
    const badScoresJPub3 = {
      map: [
        [0, [0, { color: 'red', shape: 'circle' }]],
        [1, [0, { color: 'blue', shape: 'square' }]]
      ],
      'tile*': 23,
      players: [
        {
          score: 2,
          name: 'player1',
          'tile*': [
            { color: 'red', shape: 'circle' },
            { color: 'blue', shape: 'square' }
          ]
        },
        0,
        21000000,
        0
      ]
    };
    const badScoresJPub4 = {
      map: [
        [0, [0, { color: 'red', shape: 'circle' }]],
        [1, [0, { color: 'blue', shape: 'square' }]]
      ],
      'tile*': 23,
      players: [
        {
          score: 132123123123,
          name: 'player1',
          'tile*': [
            { color: 'red', shape: 'circle' },
            { color: 'blue', shape: 'square' }
          ]
        },
        0,
        230,
        0
      ]
    };
    const badPlayerNameJPub = {
      map: [
        [0, [0, { color: 'red', shape: 'circle' }]],
        [1, [0, { color: 'blue', shape: 'square' }]]
      ],
      'tile*': 23,
      players: [
        {
          score: 0,
          name: 123,
          'tile*': [
            { color: 'red', shape: 'circle' },
            { color: 'blue', shape: 'square' }
          ]
        },
        0,
        0,
        0
      ]
    };
    const badPlayerScoreJPub = {
      map: [
        [0, [0, { color: 'red', shape: 'circle' }]],
        [1, [0, { color: 'blue', shape: 'square' }]]
      ],
      'tile*': 23,
      players: [
        {
          score: '0',
          name: 'player1',
          'tile*': [
            { color: 'red', shape: 'circle' },
            { color: 'blue', shape: 'square' }
          ]
        },
        0,
        0,
        0
      ]
    };
    const badPlayerTilesJPub1 = {
      map: [
        [0, [0, { color: 'red', shape: 'circle' }]],
        [1, [0, { color: 'blue', shape: 'square' }]]
      ],
      'tile*': 23,
      players: [
        {
          score: 0,
          name: 'player1',
          'tile*': [{ color: 'red' }, { color: 'blue', shape: 'square' }]
        },
        0,
        0,
        0
      ]
    };
    const badPlayerTilesJPub2 = {
      map: [
        [0, [0, { color: 'red', shape: 'circle' }]],
        [1, [0, { color: 'blue', shape: 'square' }]]
      ],
      'tile*': 23,
      players: [
        {
          score: 0,
          name: 'player1',
          'tile*': '[{"color":"red"},{"color":"blue","shape":"square"}]'
        },
        0,
        0,
        0
      ]
    };

    // Act & Assert
    expect(isJPub(goodJPub)).toBe(true);
    expect(isJPub(goodVariantTilesJPub1)).toBe(true);
    expect(isJPub(goodVariantTilesJPub2)).toBe(true);
    expect(isJPub(badTileCount1JPub)).toBe(false);
    expect(isJPub(badTileCount2JPub)).toBe(false);
    expect(isJPub(badScoresJPub1)).toBe(false);
    expect(isJPub(badScoresJPub2)).toBe(false);
    expect(isJPub(badScoresJPub3)).toBe(false);
    expect(isJPub(badScoresJPub4)).toBe(false);
    expect(isJPub(badPlayerNameJPub)).toBe(false);
    expect(isJPub(badPlayerScoreJPub)).toBe(false);
    expect(isJPub(badPlayerTilesJPub1)).toBe(false);
    expect(isJPub(badPlayerTilesJPub2)).toBe(false);
  });

  test('isJMap', () => {
    // Valid JMap object
    expect(
      isJMap([
        [0, [0, { color: 'red', shape: 'circle' }]],
        [1, [0, { color: 'blue', shape: 'square' }]]
      ])
    ).toBe(true);

    // Valid JMap object - negative indices
    expect(
      isJMap([
        [0, [-2, { color: 'purple', shape: 'circle' }]],
        [-1, [4, { color: 'green', shape: 'clover' }]]
      ])
    ).toBe(true);

    // Valid JMap object - multiple cells per row
    expect(
      isJMap([
        [
          1,
          [0, { color: 'red', shape: 'circle' }],
          [2, { color: 'yellow', shape: 'circle' }]
        ],
        [
          2,
          [-2, { color: 'blue', shape: 'square' }],
          [2, { color: 'orange', shape: '8star' }]
        ],
        [3, [0, { color: 'green', shape: 'square' }]]
      ])
    ).toBe(true);

    // Invalid JMap object - no row indices
    expect(
      isJMap([
        [[0, { color: 'red', shape: 'circle' }]],
        [[0, { color: 'blue', shape: 'square' }]]
      ])
    ).toBe(false);

    // Invalid JMap object - no column indices
    expect(
      isJMap([
        [0, [{ color: 'red', shape: 'circle' }]],
        [1, [{ color: 'blue', shape: 'square' }]]
      ])
    ).toBe(false);

    // Invalid JMap object - no tiles
    expect(
      isJMap([
        [0, [0]],
        [1, [0]]
      ])
    ).toBe(false);

    // Invalid JMap object - no row or cell
    expect(isJMap({ color: 'red', shape: 'circle' })).toBe(false);

    // Invalid JMap object - no row
    expect(isJMap([0, { color: 'red', shape: 'circle' }])).toBe(false);

    // Invalid JMap object - no cells in row
    expect(isJMap([[0]])).toBe(false);

    // Invalid JMap object - array with invalid row
    expect(
      isJMap([
        [{ color: 'red', shape: 'circle' }],
        { color: 'blue', shape: 'square' }
      ])
    ).toBe(false);

    // Invalid JMap object - rows overlap
    expect(
      isJMap([
        [0, [0, { color: 'red', shape: 'circle' }]],
        [0, [0, { color: 'blue', shape: 'square' }]],
        [1, [0, { color: 'green', shape: 'diamond' }]]
      ])
    ).toBe(false);

    // Invalid JMap object - rows have gap
    expect(
      isJMap([
        [0, [0, { color: 'red', shape: 'circle' }]],
        [2, [0, { color: 'blue', shape: 'square' }]],
        [3, [0, { color: 'green', shape: 'diamond' }]]
      ])
    ).toBe(false);

    // Invalid JMap object - columns overlap
    expect(
      isJMap([
        [
          1,
          [0, { color: 'red', shape: 'circle' }],
          [0, { color: 'yellow', shape: 'circle' }]
        ],
        [2, [0, { color: 'blue', shape: 'square' }]],
        [3, [0, { color: 'green', shape: 'diamond' }]]
      ])
    ).toBe(false);

    // Invalid JMap object - null value
    expect(isJMap(null)).toBe(false);

    // Invalid JMap object - non-object value
    expect(isJMap('red')).toBe(false);
  });

  test('isJChoice', () => {
    // Valid JChoice object - 'pass'
    expect(isJChoice('pass')).toBe(true);

    // Valid JChoice object - 'replace'
    expect(isJChoice('replace')).toBe(true);

    // Valid JChoice object - valid JPlacements
    expect(
      isJChoice([
        {
          coordinate: { column: 1, row: 2 },
          '1tile': { color: 'red', shape: 'circle' }
        },
        {
          coordinate: { column: 3, row: 4 },
          '1tile': { color: 'orange', shape: 'circle' }
        }
      ])
    ).toBe(true);

    // Invalid JChoice object - invalid value
    expect(isJChoice('invalid')).toBe(false);

    // Invalid JChoice object - null value
    expect(isJChoice(null)).toBe(false);

    // Invalid JChoice object - non-object value
    expect(isJChoice('red')).toBe(false);
  });

  test('isJPlacements', () => {
    // Valid JPlacements object
    expect(
      isJPlacements([
        {
          coordinate: { column: 1, row: 2 },
          '1tile': { color: 'red', shape: 'circle' }
        },
        {
          coordinate: { column: 3, row: 4 },
          '1tile': { color: 'blue', shape: 'square' }
        }
      ])
    ).toBe(true);

    // Invalid JPlacements object - not an array
    expect(isJPlacements({ column: 1, row: 2 })).toBe(false);

    // Valid JPlacements object - empty array
    expect(isJPlacements([])).toBe(true);

    // Invalid JPlacements object - array with invalid placement
    expect(
      isJPlacements([
        {
          coordinate: { column: 1, row: 2 },
          '1tile': { column: '3', row: 4 } // Invalid JTile object
        }
      ])
    ).toBe(false);

    // Invalid JPlacements object - array with missing property
    expect(
      isJPlacements([
        {
          coordinate: { column: 1 },
          '1tile': { color: 'red', shape: 'circle' }
        }
      ])
    ).toBe(false);
  });

  test('isJTile', () => {
    // Valid JTile object
    expect(isJTile({ color: 'red', shape: 'circle' })).toBe(true);

    // Invalid JTile object - missing color property
    expect(isJTile({ shape: 'circle' })).toBe(false);

    // Invalid JTile object - invalid color value
    expect(isJTile({ color: 'brown', shape: 'circle' })).toBe(false);

    // Invalid JTile object - missing shape property
    expect(isJTile({ color: 'red' })).toBe(false);

    // Invalid JTile object - invalid shape value
    expect(isJTile({ color: 'red', shape: 'triangle' })).toBe(false);

    // Invalid JTile object - null value
    expect(isJTile(null)).toBe(false);

    // Invalid JTile object - non-object value
    expect(isJTile('red')).toBe(false);
  });

  test('isJActorsB', () => {
    // Valid JActorsB object - 2 actors
    expect(
      isJActorsB([
        ['simpleJActor1', 'dag'],
        ['simpleJActor2', 'ldasg']
      ])
    ).toBe(true);

    // Valid JActorsB object - 3 actors
    expect(
      isJActorsB([
        ['simpleJActor1', 'dag'],
        ['simpleJActor2', 'ldasg'],
        ['simpleJActor3', 'dag']
      ])
    ).toBe(true);

    // Valid JActorsB object - 4 actors
    expect(
      isJActorsB([
        ['simpleJActor', 'dag'],
        ['exceptionJactor', 'ldasg', 'new-tiles'],
        ['cheatJactor', 'dag', 'a cheat', 'tile-not-owned'],
        ['loopJactor', 'ldasg', 'win', 2]
      ])
    ).toBe(true);

    // Invalid JActorsB object - 1 actor
    expect(isJActorsB([['simpleJActor', 'dag']])).toBe(false);

    // Invalid JActorsB object - 5 actors
    expect(
      isJActorsB([
        ['simpleJActor1', 'dag'],
        ['simpleJActor2', 'ldasg'],
        ['simpleJActor3', 'dag'],
        ['simpleJActor4', 'ldasg'],
        ['simpleJActor5', 'dag']
      ])
    ).toBe(false);

    // Invalid JActorsB object - null value
    expect(isJActorsB(null)).toBe(false);

    // Invalid JActorsB object - non-array value
    expect(isJActorsB('red')).toBe(false);

    // Invalid JActorsB object - wrong JExn value
    expect(
      isJActorsB([
        ['simpleJActor', 'dag'],
        ['exceptionJactor', 'ldasg', 'take turn'], // missing "-"
        ['cheatJactor', 'dag', 'a cheat', 'tile-not-owned'],
        ['loopJactor', 'ldasg', 'win', 2]
      ])
    ).toBe(false);

    // Invalid JActorsB object - wrong JCheat value
    expect(
      isJActorsB([
        ['simpleJActor', 'dag'],
        ['exceptionJactor', 'ldasg', 'new-tiles'],
        ['cheatJactor', 'dag', 'a cheat', 'no fit'], // missing "-"
        ['loopJactor', 'ldasg', 'win', 2]
      ])
    ).toBe(false);

    // Invalid JActorsB object - wrong JStrategy value
    expect(
      isJActorsB([
        ['simpleJActor', 'dag'],
        ['exceptionJactor', 'invalid', 'new-tiles'],
        ['cheatJactor', 'dag', 'a cheat', 'tile-not-owned'],
        ['loopJactor', 'ldasg', 'win', 2]
      ])
    ).toBe(false);

    // Invalid JActorsB object - JName too long
    expect(
      isJActorsB([
        ['simpleJActor', 'dag'],
        ['exceptionJactor', 'ldasg', 'new-tiles'],
        ['nameTooLongJactoraaaa', 'dag', 'a cheat', 'tile-not-owned'],
        ['loopJactor', 'ldasg', 'win', 2]
      ])
    ).toBe(false);

    // Invalid JActorsB object - JName too short
    expect(
      isJActorsB([
        ['simpleJActor', 'dag'],
        ['exceptionJactor', 'ldasg', 'new-tiles'],
        ['', 'dag', 'a cheat', 'tile-not-owned'],
        ['loopJactor', 'ldasg', 'win', 2]
      ])
    ).toBe(false);

    // Invalid JActorsB object - JName not a string
    expect(
      isJActorsB([
        ['simpleJActor', 'dag'],
        ['exceptionJactor', 'ldasg', 'new-tiles'],
        [1, 'dag', 'a cheat', 'tile-not-owned'],
        ['loopJactor', 'ldasg', 'win', 2]
      ])
    ).toBe(false);

    // Invalid JActorsB object - JName contains invalid character
    expect(
      isJActorsB([
        ['simpleJActor', 'dag'],
        ['exceptionJactor', 'ldasg', 'new-tiles'],
        ['name with space', 'dag', 'a cheat', 'tile-not-owned'],
        ['loopJactor', 'ldasg', 'win', 2]
      ])
    ).toBe(false);
  });

  test('isSimpleJActor', () => {
    // Valid SimpleJActor object
    expect(isSimpleJActor(['simpleJActor', 'dag'])).toBe(true);

    // Valid SimpleJActor object
    expect(isSimpleJActor(['simpleJActor', 'ldasg'])).toBe(true);

    // Invalid SimpleJActor object - null value
    expect(isSimpleJActor(null)).toBe(false);

    // Invalid SimpleJActor object - non-array value
    expect(isSimpleJActor('red')).toBe(false);

    // Invalid SimpleJActor object - JName too long
    expect(isSimpleJActor(['nameTooLongJactoraaaa', 'dag'])).toBe(false);

    // Invalid SimpleJActor object - JName too short
    expect(isSimpleJActor(['', 'dag'])).toBe(false);

    // Invalid SimpleJActor object - JName not a string
    expect(isSimpleJActor([1, 'dag'])).toBe(false);

    // Invalid SimpleJActor object - JName contains invalid character
    expect(isSimpleJActor(['name with space', 'dag'])).toBe(false);

    // Invalid SimpleJActor object - JName contains invalid character
    expect(isSimpleJActor(['name-with-hyphen', 'dag'])).toBe(false);

    // Invalid SimpleJActor object - JName contains invalid character
    expect(isSimpleJActor(['name_with_underscore', 'dag'])).toBe(false);

    // Invalid SimpleJActor object - wrong JStrategy value
    expect(isSimpleJActor(['simpleJActor', 'invalid'])).toBe(false);

    // Invalid SimpleJActor object - JStrategy not a string
    expect(isSimpleJActor(['simpleJActor', 1])).toBe(false);
  });

  test('isExceptionJActor', () => {
    // Valid ExceptionJActor object
    expect(isExceptionJActor(['exceptionJactor', 'dag', 'new-tiles'])).toBe(
      true
    );

    // Valid ExceptionJActor object
    expect(isExceptionJActor(['exceptionJactor', 'ldasg', 'take-turn'])).toBe(
      true
    );

    // Invalid ExceptionJActor object - null value
    expect(isExceptionJActor(null)).toBe(false);

    // Invalid ExceptionJActor object - non-array value
    expect(isExceptionJActor('red')).toBe(false);

    // Invalid ExceptionJActor object - JName too long
    expect(
      isExceptionJActor(['nameTooLongJactoraaaa', 'dag', 'new-tiles'])
    ).toBe(false);

    // Invalid ExceptionJActor object - JName too short
    expect(isExceptionJActor(['', 'dag', 'new-tiles'])).toBe(false);

    // Invalid ExceptionJActor object - JName not a string
    expect(isExceptionJActor([1, 'dag', 'new-tiles'])).toBe(false);

    // Invalid ExceptionJActor object - JName contains invalid character
    expect(isExceptionJActor(['name with space', 'dag', 'new-tiles'])).toBe(
      false
    );

    // Invalid ExceptionJActor object - JName contains invalid character
    expect(isExceptionJActor(['name-with-hyphen', 'dag', 'new-tiles'])).toBe(
      false
    );

    // Invalid ExceptionJActor object - JName contains invalid character
    expect(
      isExceptionJActor(['name_with_underscore', 'dag', 'new-tiles'])
    ).toBe(false);

    // Invalid ExceptionJActor object - wrong JStrategy value
    expect(isExceptionJActor(['exceptionJactor', 'invalid', 'new-tiles'])).toBe(
      false
    );

    // Invalid ExceptionJActor object - JStrategy not a string
    expect(isExceptionJActor(['exceptionJactor', 1, 'new-tiles'])).toBe(false);

    // Invalid ExceptionJActor object - wrong JExn value
    expect(
      isExceptionJActor(['exceptionJactor', 'ldasg', 'take turn']) // missing "-"
    ).toBe(false);

    // Invalid ExceptionJActor object - JExn not a string
    expect(isExceptionJActor(['exceptionJactor', 'ldasg', 1])).toBe(false);
  });

  test('isCheatJActor', () => {
    // Valid CheatJActor object
    expect(
      isCheatJActor(['cheatJactor', 'dag', 'a cheat', 'tile-not-owned'])
    ).toBe(true);

    // Valid CheatJActor object
    expect(
      isCheatJActor([
        'cheatJactor',
        'ldasg',
        'a cheat',
        'non-adjacent-coordinate'
      ])
    ).toBe(true);

    // Invalid CheatJActor object - null value
    expect(isCheatJActor(null)).toBe(false);

    // Invalid CheatJActor object - non-array value
    expect(isCheatJActor('red')).toBe(false);

    // Invalid CheatJActor object - JName too long
    expect(
      isCheatJActor([
        'nameTooLongJactoraaaa',
        'dag',
        'a cheat',
        'tile-not-owned'
      ])
    ).toBe(false);

    // Invalid CheatJActor object - JName too short
    expect(isCheatJActor(['', 'dag', 'a cheat', 'tile-not-owned'])).toBe(false);

    // Invalid CheatJActor object - JName not a string
    expect(isCheatJActor([1, 'dag', 'a cheat', 'tile-not-owned'])).toBe(false);

    // Invalid CheatJActor object - JName contains invalid character
    expect(
      isCheatJActor(['name with space', 'dag', 'a cheat', 'tile-not-owned'])
    ).toBe(false);

    // Invalid CheatJActor object - JName contains invalid character
    expect(
      isCheatJActor(['name-with-hyphen', 'dag', 'a cheat', 'tile-not-owned'])
    ).toBe(false);

    // Invalid CheatJActor object - JName contains invalid character
    expect(
      isCheatJActor([
        'name_with_underscore',
        'dag',
        'a cheat',
        'tile-not-owned'
      ])
    ).toBe(false);

    // Invalid CheatJActor object - wrong JStrategy value
    expect(
      isCheatJActor(['cheatJactor', 'invalid', 'a cheat', 'tile-not-owned'])
    ).toBe(false);

    // Invalid CheatJActor object - JStrategy not a string
    expect(isCheatJActor(['cheatJactor', 1, 'a cheat', 'tile-not-owned'])).toBe(
      false
    );

    // Invalid CheatJActor object - "a cheat" not a string
    expect(isCheatJActor(['cheatJactor', 'dag', 1, 'tile-not-owned'])).toBe(
      false
    );

    // Invalid CheatJActor object - wrong JCheat value
    expect(
      isCheatJActor(['cheatJactor', 'dag', 'a cheat', 'no fit']) // missing "-"
    ).toBe(false);

    // Invalid CheatJActor object - JCheat not a string
    expect(isCheatJActor(['cheatJactor', 'dag', 'a cheat', 1])).toBe(false);
  });

  test('isLoopJActor', () => {
    // Valid LoopJActor object
    expect(isLoopJActor(['loopJactor', 'dag', 'win', 2])).toBe(true);

    // Valid LoopJActor object
    expect(isLoopJActor(['loopJactor', 'ldasg', 'setup', 3])).toBe(true);

    // Invalid LoopJActor object - null value
    expect(isLoopJActor(null)).toBe(false);

    // Invalid LoopJActor object - non-array value
    expect(isLoopJActor('red')).toBe(false);

    // Invalid LoopJActor object - JName too long
    expect(isLoopJActor(['nameTooLongJactoraaaa', 'dag', 'win', 2])).toBe(
      false
    );

    // Invalid LoopJActor object - JName too short
    expect(isLoopJActor(['', 'dag', 'win', 2])).toBe(false);

    // Invalid LoopJActor object - JName not a string
    expect(isLoopJActor([1, 'dag', 'win', 2])).toBe(false);

    // Invalid LoopJActor object - JName contains invalid character
    expect(isLoopJActor(['name with space', 'dag', 'win', 2])).toBe(false);

    // Invalid LoopJActor object - JName contains invalid character
    expect(isLoopJActor(['name-with-hyphen', 'dag', 'win', 2])).toBe(false);

    // Invalid LoopJActor object - JName contains invalid character
    expect(isLoopJActor(['name_with_underscore', 'dag', 'win', 2])).toBe(false);

    // Invalid LoopJActor object - wrong JStrategy value
    expect(isLoopJActor(['loopJactor', 'invalid', 'win', 2])).toBe(false);

    // Invalid LoopJActor object - JStrategy not a string
    expect(isLoopJActor(['loopJactor', 1, 'win', 2])).toBe(false);

    // Invalid LoopJActor object - wrong JExn value
    expect(isLoopJActor(['loopJactor', 'ldasg', 'new tiles', '2'])).toBe(false); // missing "-"

    // Invalid LoopJActor object - JExn not a string
    expect(isLoopJActor(['loopJactor', 'ldasg', 1, 3])).toBe(false);

    // Invalid LoopJActor object - Count value too small
    expect(isLoopJActor(['loopJactor', 'dag', 'win', 0])).toBe(false);

    // Invalid LoopJActor object - Count value too large
    expect(isLoopJActor(['loopJactor', 'dag', 'win', 8])).toBe(false);

    // Invalid LoopJActor object - Count not a number
    expect(isLoopJActor(['loopJactor', 'dag', 'win', '2'])).toBe(false);
  });
});

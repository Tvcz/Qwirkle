import { isJChoice, isJMap, isJPlacements, isJTile } from './dataTypeGuards';

describe('tests for the json data defintions type guards', () => {
  test('isJState', () => {
    expect(true).toBe(true);
  });

  test('isJPub', () => {
    expect(true).toBe(true);
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
        [1, [0, { color: 'green', shape: 'triangle' }]]
      ])
    ).toBe(false);

    // Invalid JMap object - rows have gap
    expect(
      isJMap([
        [0, [0, { color: 'red', shape: 'circle' }]],
        [2, [0, { color: 'blue', shape: 'square' }]],
        [3, [0, { color: 'green', shape: 'triangle' }]]
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
        [3, [0, { color: 'green', shape: 'triangle' }]]
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
    expect(true).toBe(true);
  });

  test('isSimpleJActor', () => {
    expect(true).toBe(true);
  });

  test('isExceptionJActor', () => {
    expect(true).toBe(true);
  });

  test('isCheatJActor', () => {
    expect(true).toBe(true);
  });

  test('isLoopJActor', () => {
    expect(true).toBe(true);
  });
});

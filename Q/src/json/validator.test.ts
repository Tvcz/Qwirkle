import { validateJSON, isValidJSON } from './validator';

describe('tests for json validator', () => {
  const turnActionMessage = {
    method: 'takeTurn',
    args: {
      publicState: {
        playerTiles: [
          { shape: 'circle', color: 'red' },
          { shape: 'circle', color: 'red' },
          { shape: 'circle', color: 'red' }
        ],
        mapState: [
          {
            tile: { shape: 'circle', color: 'red' },
            coordinate: { x: 0, y: 0 }
          },
          {
            tile: { shape: 'circle', color: 'red' },
            coordinate: { x: 0, y: 1 }
          },
          {
            tile: { shape: 'circle', color: 'red' },
            coordinate: { x: 0, y: 2 }
          }
        ],
        scoreboard: [
          { name: '1', score: 0 },
          { name: '2', score: 0 },
          { name: '3', score: 0 },
          { name: '4', score: 0 }
        ],
        remainingTilesCount: 0,
        playersQueue: ['1', '2', '3', '4']
      }
    }
  };

  test('validateJson returns an object for valid json', () => {
    expect(validateJSON('{ "method": "name", "args": [] }')).toStrictEqual({
      method: 'name',
      args: []
    });
    expect(validateJSON(JSON.stringify(turnActionMessage))).toStrictEqual(
      turnActionMessage
    );
    expect(validateJSON('{}')).toStrictEqual({});
    expect(validateJSON('[]')).toStrictEqual([]);
    expect(validateJSON('null')).toStrictEqual(null);
    expect(validateJSON('true')).toStrictEqual(true);
    expect(validateJSON('false')).toStrictEqual(false);
    expect(validateJSON('1')).toStrictEqual(1);
  });
  test('validateJson throws for invalid json', () => {
    expect(() => validateJSON('')).toThrow();
    expect(() => validateJSON('foo')).toThrow();
    expect(() => validateJSON('{')).toThrow();
    expect(() => validateJSON('}')).toThrow();
    expect(() => validateJSON('[]foo')).toThrow();
    expect(() => validateJSON('{ "method": "name", "args": []')).toThrow();
  });
  test('isValidJson returns true for valid Json', () => {
    const turnActionMessage = {
      method: 'takeTurn',
      args: {
        publicState: {
          playerTiles: [
            { shape: 'circle', color: 'red' },
            { shape: 'circle', color: 'red' },
            { shape: 'circle', color: 'red' }
          ],
          mapState: [
            {
              tile: { shape: 'circle', color: 'red' },
              coordinate: { x: 0, y: 0 }
            },
            {
              tile: { shape: 'circle', color: 'red' },
              coordinate: { x: 0, y: 1 }
            },
            {
              tile: { shape: 'circle', color: 'red' },
              coordinate: { x: 0, y: 2 }
            }
          ],
          scoreboard: [
            { name: '1', score: 0 },
            { name: '2', score: 0 },
            { name: '3', score: 0 },
            { name: '4', score: 0 }
          ],
          remainingTilesCount: 0,
          playersQueue: ['1', '2', '3', '4']
        }
      }
    };

    expect(isValidJSON('{ "method": "name", "args": [] }')).toBe(true);
    expect(isValidJSON(JSON.stringify(turnActionMessage))).toBe(true);
    expect(isValidJSON('{}')).toBe(true);
    expect(isValidJSON('[]')).toBe(true);
    expect(isValidJSON('null')).toBe(true);
    expect(isValidJSON('true')).toBe(true);
    expect(isValidJSON('false')).toBe(true);
    expect(isValidJSON('1')).toBe(true);
  });
  test('isValidJson returns false for invalid Json', () => {
    expect(isValidJSON('')).toBe(false);
    expect(isValidJSON('foo')).toBe(false);
    expect(isValidJSON('{')).toBe(false);
    expect(isValidJSON('}')).toBe(false);
    expect(isValidJSON('[]foo')).toBe(false);
    expect(isValidJSON("{ method: 'name', args: []")).toBe(false);
  });
});

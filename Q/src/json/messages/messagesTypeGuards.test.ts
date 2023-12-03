import {
  isNameCall,
  isNameResponse,
  isNewTilesCall,
  isNewTilesResponse,
  isSetUpCall,
  isSetUpResponse,
  isTakeTurnCall,
  isTakeTurnResponse,
  isWinCall,
  isWinResponse
} from './messagesTypeGuards';

describe('tests for the json message type guards', () => {
  describe('name method types', () => {
    test('isNameCall returns true for valid NameCall', () => {
      expect(isNameCall(['name', []])).toBe(true);
    });
    test('isNameCall returns false for invalid NameCall', () => {
      expect(isNameCall(['name', 'foo'])).toBe(false);
      expect(isNameCall(['name', {}])).toBe(false);
      expect(isNameCall(['setup', []])).toBe(false);
      expect(isNameCall(['win', [true]])).toBe(false);
      expect(isNameCall(['foo', []])).toBe(false);
      expect(isNameCall(['name'])).toBe(false);
      expect(isNameCall({ nonsense: 'name', args: { this: 0 } })).toBe(false);
    });
    test('isNameResponse returns true for valid NameResponse', () => {
      expect(isNameResponse('name')).toBe(true);
      expect(isNameResponse('othername')).toBe(true);
      expect(isNameResponse('')).toBe(true);
    });
    test('isNameResponse returns false for invalid NameResponse', () => {
      expect(isNameResponse(['name', 1])).toBe(false);
      expect(isNameResponse(['name', true])).toBe(false);
      expect(isNameResponse(['name', null])).toBe(false);
      expect(isNameResponse(['name', []])).toBe(false);
      expect(isNameResponse(['name', {}])).toBe(false);
      expect(isNameResponse(['name', { foo: 'bar' }])).toBe(false);
      expect(isNameResponse(['name', []])).toBe(false);
      expect(isNameResponse(['name', 'foo'])).toBe(false);
      expect(isNameResponse(['setup', 0])).toBe(false);
      expect(isNameResponse(['win', 0])).toBe(false);
    });
  });

  describe('setUp method types', () => {
    test('isSetUpCall returns true for valid SetUpCall', () => {
      expect(
        isSetUpCall([
          'setup',
          [
            {
              map: [
                [0, [0, { color: 'red', shape: 'circle' }]],
                [1, [0, { color: 'red', shape: 'circle' }]],
                [2, [0, { color: 'red', shape: 'circle' }]]
              ],
              'tile*': 232,
              players: [
                {
                  score: 0,
                  name: '1',
                  'tile*': [
                    { color: 'red', shape: 'circle' },
                    { color: 'red', shape: 'circle' },
                    { color: 'red', shape: 'circle' }
                  ]
                },
                23,
                23,
                19
              ]
            },
            [
              { shape: 'circle', color: 'red' },
              { shape: 'circle', color: 'red' },
              { shape: 'circle', color: 'red' }
            ]
          ]
        ])
      ).toBe(true);
    });
    test('isSetUpCall returns false for invalid SetUpCall', () => {
      expect(isSetUpCall(['setup', 'foo'])).toBe(false);
      expect(isSetUpCall(['setup', []])).toBe(false);
      expect(isSetUpCall(['name', []])).toBe(false);
      expect(isSetUpCall(['win', [true]])).toBe(false);
      expect(isSetUpCall(['foo', []])).toBe(false);
      expect(isSetUpCall(['setup'])).toBe(false);
      expect(isSetUpCall({ nonsense: 'name', args: ['this'] })).toBe(false);
    });
    test('isSetUpResponse returns true for valid SetUpResponse', () => {
      expect(isSetUpResponse('void')).toBe(true);
    });
    test('isSetUpResponse returns false for invalid SetUpResponse', () => {
      expect(isSetUpResponse('name')).toBe(false);
      expect(isSetUpResponse(1)).toBe(false);
      expect(isSetUpResponse(true)).toBe(false);
      expect(isSetUpResponse(null)).toBe(false);
      expect(isSetUpResponse([])).toBe(false);
      expect(isSetUpResponse({})).toBe(false);
      expect(isSetUpResponse(0)).toBe(false);
    });
  });

  describe('takeTurn method types', () => {
    test('isTakeTurnCall returns true for valid TakeTurnCall', () => {
      expect(
        isTakeTurnCall([
          'take-turn',
          [
            {
              map: [
                [0, [0, { color: 'red', shape: 'circle' }]],
                [1, [0, { color: 'red', shape: 'circle' }]],
                [2, [0, { color: 'red', shape: 'circle' }]]
              ],
              players: [
                {
                  score: 0,
                  name: '1',
                  'tile*': [
                    { color: 'red', shape: 'circle' },
                    { color: 'red', shape: 'circle' },
                    { color: 'red', shape: 'circle' }
                  ]
                },
                23,
                23,
                19
              ],
              'tile*': 0
            }
          ]
        ])
      ).toBe(true);
    });
    test('isTakeTurnCall returns false for invalid TakeTurnCall', () => {
      expect(isTakeTurnCall(['take-turn', 'foo'])).toBe(false);
      expect(isTakeTurnCall(['take-turn', {}])).toBe(false);
      expect(isTakeTurnCall(['name', []])).toBe(false);
      expect(isTakeTurnCall(['win', [true]])).toBe(false);
      expect(isTakeTurnCall(['foo', []])).toBe(false);
      expect(isTakeTurnCall(['take-turn'])).toBe(false);
      expect(isTakeTurnCall({ nonsense: 'name', args: ['this'] })).toBe(false);
    });
    test('isTakeTurnResponse returns true for valid TakeTurnResponse', () => {
      expect(isTakeTurnResponse('pass')).toBe(true);
      expect(isTakeTurnResponse('replace')).toBe(true);
      expect(
        isTakeTurnResponse([
          {
            '1tile': { shape: 'circle', color: 'red' },
            coordinate: { column: 0, row: 0 }
          },
          {
            '1tile': { shape: 'circle', color: 'red' },
            coordinate: { row: 1, column: 0 }
          },
          {
            '1tile': { shape: 'circle', color: 'red' },
            coordinate: { column: 0, row: 2 }
          }
        ])
      ).toBe(true);
    });
    test('isTakeTurnResponse returns false for invalid TakeTurnResponse', () => {
      expect(
        isTakeTurnResponse([
          {
            '1tile': { shape: 'circle', color: 'red' }
          },
          {
            '1tile': { shape: 'circle', color: 'red' },
            coordinate: { column: 0, row: 1 }
          },
          {
            coordinate: { column: 0, row: 2 }
          }
        ])
      ).toBe(false);
      expect(
        isTakeTurnResponse([
          {
            '1tile': { shape: 'circle', color: 'red' },
            coordinate: { x: 0, y: 2 }
          },
          {
            '1tile': { shape: 'circle', color: 'red' },
            coordinate: { x: 0, y: 1 }
          }
        ])
      ).toBe(false);
      expect(
        isTakeTurnResponse([
          {
            tile: { shape: 'circle', color: 'red' },
            coordinate: { column: 0, row: 2 }
          },
          {
            tile: { shape: 'circle', color: 'red' },
            coordinate: { column: 0, row: 1 }
          }
        ])
      ).toBe(false);
      expect(isTakeTurnResponse(2)).toBe(false);
      expect(isTakeTurnResponse('notTurnDesription')).toBe(false);
    });
  });

  describe('newTiles method types', () => {
    test('isNewTilesCall returns true for valid NewTilesCall', () => {
      expect(
        isNewTilesCall([
          'new-tiles',
          [
            [
              { shape: 'circle', color: 'red' },
              { shape: 'circle', color: 'red' },
              { shape: 'circle', color: 'red' }
            ]
          ]
        ])
      ).toBe(true);
      expect(isNewTilesCall(['new-tiles', [[]]])).toBe(true);
    });
    test('isNewTilesCall returns false for invalid NewTilesCall', () => {
      expect(
        isNewTilesCall([
          'new-tiles',
          [
            { shape: 'circle', color: 'red' },
            { shape: 'circle', color: 'red' },
            { shape: 'circle', color: 'red' }
          ]
        ])
      ).toBe(false);
      expect(isNewTilesCall(['new-tiles', []])).toBe(false);
      expect(isNewTilesCall(['new-tiles', 'foo'])).toBe(false);
      expect(isNewTilesCall(['new-tiles', {}])).toBe(false);
      expect(isNewTilesCall(['name', []])).toBe(false);
      expect(isNewTilesCall(['win', [true]])).toBe(false);
      expect(isNewTilesCall(['foo', []])).toBe(false);
      expect(isNewTilesCall(['new-tiles'])).toBe(false);
      expect(isNewTilesCall({ nonsense: 'name', args: ['this'] })).toBe(false);
    });
    test('isNewTilesResponse returns true for valid NewTilesResponse', () => {
      expect(isNewTilesResponse('void')).toBe(true);
    });
    test('isNewTilesResponse returns false for invalid NewTilesResponse', () => {
      expect(isNewTilesResponse('name')).toBe(false);
      expect(isNewTilesResponse(1)).toBe(false);
      expect(isNewTilesResponse(true)).toBe(false);
      expect(isNewTilesResponse(null)).toBe(false);
      expect(isNewTilesResponse([])).toBe(false);
      expect(isNewTilesResponse({})).toBe(false);
      expect(isNewTilesResponse(0)).toBe(false);
    });
  });

  describe('win method types', () => {
    test('isWinCall returns true for valid WinCall', () => {
      expect(isWinCall(['win', [true]])).toBe(true);
      expect(isWinCall(['win', [false]])).toBe(true);
    });
    test('isWinCall returns false for invalid WinCall', () => {
      expect(isWinCall(['win', 'foo'])).toBe(false);
      expect(isWinCall(['win', [2]])).toBe(false);
      expect(isWinCall(['win', []])).toBe(false);
      expect(isWinCall(['name', []])).toBe(false);
      expect(isWinCall(['foo', []])).toBe(false);
      expect(isWinCall(['win'])).toBe(false);
      expect(isWinCall(['name', ['this']])).toBe(false);
    });
    test('isWinResponse returns true for valid WinResponse', () => {
      expect(isWinResponse('void')).toBe(true);
    });
    test('isWinResponse returns false for invalid WinResponse', () => {
      expect(isWinResponse('name')).toBe(false);
      expect(isWinResponse(1)).toBe(false);
      expect(isWinResponse(true)).toBe(false);
      expect(isWinResponse(null)).toBe(false);
      expect(isWinResponse([])).toBe(false);
      expect(isWinResponse({})).toBe(false);
      expect(isWinResponse(0)).toBe(false);
    });
  });
});

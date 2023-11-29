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
      expect(isNameCall({ method: 'name', args: {} })).toBe(true);
    });
    test('isNameCall returns false for invalid NameCall', () => {
      expect(isNameCall({ method: 'name', args: 'foo' })).toBe(false);
      expect(isNameCall({ method: 'name', args: [] })).toBe(false);
      expect(isNameCall({ method: 'setUp', args: {} })).toBe(false);
      expect(isNameCall({ method: 'win', args: [true] })).toBe(false);
      expect(isNameCall({ method: 'foo', args: {} })).toBe(false);
      expect(isNameCall({ method: 'name' })).toBe(false);
      expect(isNameCall({ nonsense: 'name', args: { this: 0 } })).toBe(false);
    });
    test('isNameResponse returns true for valid NameResponse', () => {
      expect(isNameResponse({ method: 'name', result: 'name' })).toBe(true);
      expect(isNameResponse({ method: 'name', result: 'othername' })).toBe(
        true
      );
      expect(isNameResponse({ method: 'name', result: '' })).toBe(true);
    });
    test('isNameResponse returns false for invalid NameResponse', () => {
      expect(isNameResponse({ method: 'name', result: 1 })).toBe(false);
      expect(isNameResponse({ method: 'name', result: true })).toBe(false);
      expect(isNameResponse({ method: 'name', result: null })).toBe(false);
      expect(isNameResponse({ method: 'name', result: [] })).toBe(false);
      expect(isNameResponse({ method: 'name', result: {} })).toBe(false);
      expect(isNameResponse({ method: 'name', result: { foo: 'bar' } })).toBe(
        false
      );
      expect(isNameResponse({ method: 'name', args: [] })).toBe(false);
      expect(isNameResponse({ method: 'name', nonsense: 'foo' })).toBe(false);
      expect(isNameResponse({ method: 'setUp', result: 0 })).toBe(false);
      expect(isNameResponse({ method: 'win', result: 0 })).toBe(false);
    });
  });

  describe('setUp method types', () => {
    test('isSetUpCall returns true for valid SetUpCall', () => {
      expect(
        isSetUpCall({
          method: 'setUp',
          args: {
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
            startingTiles: [
              { shape: 'circle', color: 'red' },
              { shape: 'circle', color: 'red' },
              { shape: 'circle', color: 'red' }
            ]
          }
        })
      ).toBe(true);
    });
    test('isSetUpCall returns false for invalid SetUpCall', () => {
      expect(isSetUpCall({ method: 'setUp', args: 'foo' })).toBe(false);
      expect(isSetUpCall({ method: 'name', args: [] })).toBe(false);
      expect(isSetUpCall({ method: 'win', args: [true] })).toBe(false);
      expect(isSetUpCall({ method: 'foo', args: [] })).toBe(false);
      expect(isSetUpCall({ method: 'setUp' })).toBe(false);
      expect(isSetUpCall({ nonsense: 'name', args: ['this'] })).toBe(false);
    });
    test('isSetUpResponse returns true for valid SetUpResponse', () => {
      expect(isSetUpResponse({ method: 'setUp', result: 0 })).toBe(true);
    });
    test('isSetUpResponse returns false for invalid SetUpResponse', () => {
      expect(isSetUpResponse({ method: 'setUp', result: 'name' })).toBe(false);
      expect(isSetUpResponse({ method: 'setUp', result: 1 })).toBe(false);
      expect(isSetUpResponse({ method: 'setUp', result: true })).toBe(false);
      expect(isSetUpResponse({ method: 'setUp', result: null })).toBe(false);
      expect(isSetUpResponse({ method: 'setUp', result: [] })).toBe(false);
      expect(isSetUpResponse({ method: 'setUp', result: {} })).toBe(false);
      expect(isSetUpResponse({ method: 'setUp', notResult: 0 })).toBe(false);
      expect(isSetUpResponse({ method: 'name', result: 0 })).toBe(false);
      expect(isSetUpResponse({ method: 'win', result: 0 })).toBe(false);
    });
  });

  describe('takeTurn method types', () => {
    test('isTakeTurnCall returns true for valid TakeTurnCall', () => {
      expect(
        isTakeTurnCall({
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
                {
                  name: '1',
                  score: 0
                },
                {
                  name: '2',
                  score: 0
                },
                {
                  name: '3',
                  score: 0
                },
                {
                  name: '4',
                  score: 0
                }
              ],
              remainingTilesCount: 0,
              playersQueue: ['1', '2', '3', '4']
            }
          }
        })
      ).toBe(true);
    });
    test('isTakeTurnCall returns false for invalid TakeTurnCall', () => {
      expect(isTakeTurnCall({ method: 'takeTurn', args: 'foo' })).toBe(false);
      expect(isTakeTurnCall({ method: 'name', args: [] })).toBe(false);
      expect(isTakeTurnCall({ method: 'win', args: [true] })).toBe(false);
      expect(isTakeTurnCall({ method: 'foo', args: [] })).toBe(false);
      expect(isTakeTurnCall({ method: 'takeTurn' })).toBe(false);
      expect(isTakeTurnCall({ nonsense: 'name', args: ['this'] })).toBe(false);
    });
    test('isTakeTurnResponse returns true for valid TakeTurnResponse', () => {
      expect(
        isTakeTurnResponse({
          method: 'takeTurn',
          result: {
            type: 'PASS'
          }
        })
      ).toBe(true);
      expect(
        isTakeTurnResponse({
          method: 'takeTurn',
          result: {
            type: 'EXCHANGE'
          }
        })
      ).toBe(true);
      expect(
        isTakeTurnResponse({
          method: 'takeTurn',
          result: {
            type: 'PLACE',
            placements: [
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
            ]
          }
        })
      ).toBe(true);
    });
    test('isTakeTurnResponse returns false for invalid TakeTurnResponse', () => {
      expect(
        isTakeTurnResponse({
          method: 'takeTurn',
          result: {
            type: 'PLACE',
            placements: [
              {
                tile: { shape: 'circle', color: 'red' }
              },
              {
                tile: { shape: 'circle', color: 'red' },
                coordinate: { x: 0, y: 1 }
              },
              {
                coordinate: { x: 0, y: 2 }
              }
            ]
          }
        })
      ).toBe(false);
      expect(
        isTakeTurnResponse({
          method: 'takeTurn',
          result: {
            type: 'PLACE',
            placements: 2
          }
        })
      ).toBe(false);
      expect(
        isTakeTurnResponse({
          method: 'takeTurn',
          result: {
            type: 'notTurnDesription'
          }
        })
      ).toBe(false);
    });
  });

  describe('newTiles method types', () => {
    test('isNewTilesCall returns true for valid NewTilesCall', () => {
      expect(
        isNewTilesCall({
          method: 'newTiles',
          args: {
            newTiles: [
              { shape: 'circle', color: 'red' },
              { shape: 'circle', color: 'red' },
              { shape: 'circle', color: 'red' }
            ]
          }
        })
      ).toBe(true);
    });
    test('isNewTilesCall returns false for invalid NewTilesCall', () => {
      expect(isNewTilesCall({ method: 'newTiles', args: 'foo' })).toBe(false);
      expect(isNewTilesCall({ method: 'name', args: [] })).toBe(false);
      expect(isNewTilesCall({ method: 'win', args: [true] })).toBe(false);
      expect(isNewTilesCall({ method: 'foo', args: [] })).toBe(false);
      expect(isNewTilesCall({ method: 'newTiles' })).toBe(false);
      expect(isNewTilesCall({ nonsense: 'name', args: ['this'] })).toBe(false);
    });
    test('isNewTilesResponse returns true for valid NewTilesResponse', () => {
      expect(isNewTilesResponse({ method: 'newTiles', result: 0 })).toBe(true);
    });
    test('isNewTilesResponse returns false for invalid NewTilesResponse', () => {
      expect(isNewTilesResponse({ method: 'newTiles', result: 'name' })).toBe(
        false
      );
      expect(isNewTilesResponse({ method: 'newTiles', result: 1 })).toBe(false);
      expect(isNewTilesResponse({ method: 'newTiles', result: true })).toBe(
        false
      );
      expect(isNewTilesResponse({ method: 'newTiles', result: null })).toBe(
        false
      );
      expect(isNewTilesResponse({ method: 'newTiles', result: [] })).toBe(
        false
      );
      expect(isNewTilesResponse({ method: 'newTiles', result: {} })).toBe(
        false
      );
      expect(isNewTilesResponse({ method: 'newTiles', notResult: 0 })).toBe(
        false
      );
      expect(isNewTilesResponse({ method: 'name', result: 0 })).toBe(false);
      expect(isNewTilesResponse({ method: 'win', result: 0 })).toBe(false);
    });
  });

  describe('win method types', () => {
    test('isWinCall returns true for valid WinCall', () => {
      expect(
        isWinCall({
          method: 'win',
          args: {
            win: true
          }
        })
      ).toBe(true);
      expect(
        isWinCall({
          method: 'win',
          args: {
            win: false
          }
        })
      ).toBe(true);
    });
    test('isWinCall returns false for invalid WinCall', () => {
      expect(isWinCall({ method: 'win', args: 'foo' })).toBe(false);
      expect(isWinCall({ method: 'name', args: [] })).toBe(false);
      expect(isWinCall({ method: 'foo', args: [] })).toBe(false);
      expect(isWinCall({ method: 'win' })).toBe(false);
      expect(isWinCall({ nonsense: 'name', args: ['this'] })).toBe(false);
    });
    test('isWinResponse returns true for valid WinResponse', () => {
      expect(isWinResponse({ method: 'win', result: 0 })).toBe(true);
    });
    test('isWinResponse returns false for invalid WinResponse', () => {
      expect(isWinResponse({ method: 'win', result: 'name' })).toBe(false);
      expect(isWinResponse({ method: 'win', result: 1 })).toBe(false);
      expect(isWinResponse({ method: 'win', result: true })).toBe(false);
      expect(isWinResponse({ method: 'win', result: null })).toBe(false);
      expect(isWinResponse({ method: 'win', result: [] })).toBe(false);
      expect(isWinResponse({ method: 'win', result: {} })).toBe(false);
      expect(isWinResponse({ method: 'win', notResult: 0 })).toBe(false);
      expect(isWinResponse({ method: 'name', result: 0 })).toBe(false);
      expect(isWinResponse({ method: 'newTiles', result: 0 })).toBe(false);
    });
  });
});

describe('test for validateJson', () => {
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
});

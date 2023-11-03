import { BaseTurnAction } from './turnAction';
import { QTile } from '../game/map/tile';
import { TilePlacement } from '../game/types/gameState.types';

describe('turn action tests', () => {
  let tilePlacement: TilePlacement<QTile>;

  it('should throw an error if placements are undefined for a PLACE action', () => {
    // arrange, act, assert
    expect(() => new BaseTurnAction('PLACE')).toThrow(
      'Placement turn action requires tile placements to be specified'
    );
  });

  it('should not throw an error if placements are specified for a PLACE action', () => {
    // arrange, act, assert
    expect(() => new BaseTurnAction('PLACE', [tilePlacement])).not.toThrow();
  });

  it('should throw an error if placements are specified for a non-PLACE action', () => {
    // arrange, act, assert
    expect(() => new BaseTurnAction('PASS', [tilePlacement])).toThrow(
      'Placements cannot be specified for a non-placement turn action'
    );
    expect(() => new BaseTurnAction('EXCHANGE', [tilePlacement])).toThrow(
      'Placements cannot be specified for a non-placement turn action'
    );
  });

  it('should not throw an error if placements are undefined for a non-PLACE action', () => {
    // arrange, act, assert
    expect(() => new BaseTurnAction('PASS')).not.toThrow();
    expect(() => new BaseTurnAction('EXCHANGE')).not.toThrow();
  });

  it('should return true for ofType when the type matches', () => {
    // arrange
    const action1 = new BaseTurnAction('PLACE', [tilePlacement]);
    const action2 = new BaseTurnAction('EXCHANGE');

    // act, assert
    expect(action1.ofType('PLACE')).toBe(true);
    expect(action2.ofType('EXCHANGE')).toBe(true);
  });

  it('should return false for ofType when the type does not match', () => {
    // arrange
    const action = new BaseTurnAction('PLACE', [tilePlacement]);

    // act, assert
    expect(action.ofType('PASS')).toBe(false);
  });

  it('should return placements for a PLACE action', () => {
    // arrange
    const action = new BaseTurnAction('PLACE', [tilePlacement]);

    // act, assert
    expect(action.getPlacements()).toEqual([tilePlacement]);
  });

  it('should throw an error when getting placements for a non-PLACE action', () => {
    // arrange
    const action1 = new BaseTurnAction('EXCHANGE');
    const action2 = new BaseTurnAction('PASS');

    // act, assert
    expect(() => action1.getPlacements()).toThrow(
      'Placements cannot be returned for non-place actions'
    );
    expect(() => action2.getPlacements()).toThrow(
      'Placements cannot be returned for non-place actions'
    );
  });
});

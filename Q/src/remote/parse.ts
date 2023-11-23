import Coordinate from '../game/map/coordinate';
import { BaseTile } from '../game/map/tile';
import { TilePlacement } from '../game/types/gameState.types';
import { BaseTurnAction, TurnAction } from '../player/turnAction';
import {
  ParsedCoordinate,
  ParsedTile,
  ParsedTilePlacement,
  ParsedTurnAction
} from './types';

/**
 * Converts a parsed tile placement into a TilePlacement instance.
 * @param tilePlacement an object containing the tile and coordinate of a tile placement
 * @returns an instance of TilePlacement with the same tile and coordinate
 */
export function buildTilePlacement(
  tilePlacement: ParsedTilePlacement
): TilePlacement<BaseTile> {
  return {
    tile: buildTile(tilePlacement.tile),
    coordinate: buildCoordinate(tilePlacement.coordinate)
  };
}

/**
 * Converts a parsed tile into a BaseTile instance.
 * @param tile an object containing the shape and color of a tile
 * @returns an instance of BaseTile with the same shape and color
 */
export function buildTile(tile: ParsedTile): BaseTile {
  return new BaseTile(tile.shape, tile.color);
}

/**
 * Converts a parsed coordinate into a Coordinate instance.
 * @param coord an object containing the x and y coordinates of a tile placement
 * @returns an instance of Coordinate with the same x and y coordinates
 */
function buildCoordinate(coord: ParsedCoordinate): Coordinate {
  return new Coordinate(coord.x, coord.y);
}

/**
 * Converts a parsed turn action into a TurnAction instance.
 * @param turnAction an object containing the type and placements of a turn action
 * @returns an instance of TurnAction with the same type and placements
 */
export function buildTurnAction(
  turnAction: ParsedTurnAction
): TurnAction<BaseTile> {
  return new BaseTurnAction(
    turnAction.type,
    turnAction.placements?.map(buildTilePlacement)
  );
}

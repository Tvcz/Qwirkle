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

export function buildTilePlacement(
  tilePlacement: ParsedTilePlacement
): TilePlacement<BaseTile> {
  return {
    tile: buildTile(tilePlacement.tile),
    coordinate: buildCoordinate(tilePlacement.coordinate)
  };
}

export function buildTile(tile: ParsedTile): BaseTile {
  return new BaseTile(tile.shape, tile.color);
}

function buildCoordinate(coord: ParsedCoordinate): Coordinate {
  return new Coordinate(coord.x, coord.y);
}

export function buildTurnAction(
  turnAction: ParsedTurnAction
): TurnAction<BaseTile> {
  return new BaseTurnAction(
    turnAction.type,
    turnAction.placements?.map(buildTilePlacement)
  );
}

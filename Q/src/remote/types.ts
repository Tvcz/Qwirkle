import { Scoreboard } from '../game/types/gameState.types';
import { Color, Shape } from '../game/types/map.types';
import { TurnActionDescription } from '../player/strategy.types';

/**
 * These types are used to represent the JSON messages that are sent between the referee and the player.
 *
 * A `MethodCall` is a JSON object with a method and args field. This is sent from the referee to the player.
 * Each method has a method call format which corresponds to its signature.
 *
 * A `MethodResponse` is a JSON object with a method and result field. This is sent from the player to the referee.
 * Each method has a method response format which corresponds to its return type.
 */

export type Json =
  | string
  | number
  | { [x: string]: Json }
  | Array<Json>
  | boolean
  | null;

export type ParsedTile = {
  shape: Shape;
  color: Color;
};

export type ParsedCoordinate = {
  x: number;
  y: number;
};

export type ParsedTilePlacement = {
  tile: ParsedTile;
  coordinate: ParsedCoordinate;
};

export type ParsedRelevantPlayerInfo = {
  playerTiles: ParsedTile[];
  mapState: ParsedTilePlacement[];
  scoreboard: Scoreboard;
  remainingTilesCount: number;
  playersQueue: string[];
};

export type ParsedTurnAction = {
  type: TurnActionDescription;
  placements?: ParsedTilePlacement[];
};

import { Scoreboard } from '../game/types/gameState.types';
import { Color, Shape } from '../game/types/map.types';
import { TurnActionDescription } from '../player/strategy.types';

export type Json =
  | string
  | number
  | { [x: string]: Json }
  | Array<Json>
  | boolean
  | null;

export type MethodResponse = {
  method: string;
  result: Json;
};

export type MethodCall = {
  method: string;
  args: Json[];
};

export type NameCall = {
  method: 'name';
  args: [];
};

export type NameResponse = {
  method: 'name';
  result: string;
};

export type SetUpCall = {
  method: 'setUp';
  args: {
    mapState: ParsedTilePlacement[];
    startingTiles: ParsedTile[];
  };
};

export type SetUpResponse = {
  method: 'setUp';
  result: 0;
};

export type TakeTurnCall = {
  method: 'takeTurn';
  args: {
    publicState: ParsedRelevantPlayerInfo;
  };
};

export type TakeTurnResponse = {
  method: 'takeTurn';
  result: ParsedTurnAction;
};

export type NewTilesCall = {
  method: 'newTiles';
  args: {
    newTiles: ParsedTile[];
  };
};

export type NewTilesResponse = {
  method: 'newTiles';
  result: 0;
};

export type WinCall = {
  method: 'win';
  args: {
    win: boolean;
  };
};

export type WinResponse = {
  method: 'win';
  result: 0;
};

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

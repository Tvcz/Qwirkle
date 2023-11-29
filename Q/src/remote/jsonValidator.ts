import { QTile } from '../game/map/tile';
import { colorList, shapeList } from '../game/types/map.types';
import {
  NameCall,
  NameResponse,
  NewTilesCall,
  NewTilesResponse,
  ParsedCoordinate,
  ParsedRelevantPlayerInfo,
  ParsedTile,
  ParsedTilePlacement,
  SetUpCall,
  SetUpResponse,
  TakeTurnCall,
  TakeTurnResponse,
  WinCall,
  WinResponse
} from './types';
import { Scoreboard } from '../game/types/gameState.types';
import { TurnAction } from '../player/turnAction';

/*
 * This file consists of type guards which ensure that the parsed JSON values in
 * messages match the corresponding types.
 *
 * These types are laid out in the `types.ts` file.
 *
 * Certain objects which are represented by classes rather than objects appear
 * as `Parsed[ClassName]` in the type definitions. These can be converted to the
 * corresponding class instances by the utilities in the `parse.ts` file.
 */

export function isNameCall(obj: unknown): obj is NameCall {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'method' in obj &&
    obj.method === 'name' &&
    'args' in obj &&
    typeof obj.args === 'object' &&
    !Array.isArray(obj.args) &&
    obj.args !== null &&
    Object.keys(obj.args).length === 0
  );
}

export function isNameResponse(obj: unknown): obj is NameResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'method' in obj &&
    obj.method === 'name' &&
    'result' in obj &&
    typeof obj.result === 'string'
  );
}

export function isSetUpCall(obj: unknown): obj is SetUpCall {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'method' in obj &&
    obj.method === 'setUp' &&
    'args' in obj &&
    typeof obj.args === 'object' &&
    obj.args !== null &&
    'mapState' in obj.args &&
    Array.isArray(obj.args.mapState) &&
    obj.args.mapState.every(isTilePlacement) &&
    'startingTiles' in obj.args &&
    Array.isArray(obj.args.startingTiles) &&
    obj.args.startingTiles.every(isTile)
  );
}

export function isSetUpResponse(obj: unknown): obj is SetUpResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'method' in obj &&
    obj.method === 'setUp' &&
    'result' in obj &&
    obj.result === 0
  );
}

export function isTakeTurnCall(obj: unknown): obj is TakeTurnCall {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'method' in obj &&
    obj.method === 'takeTurn' &&
    'args' in obj &&
    typeof obj.args === 'object' &&
    obj.args !== null &&
    'publicState' in obj.args &&
    typeof obj.args.publicState === 'object' &&
    isRelevantPlayerInfo(obj.args.publicState)
  );
}

export function isTakeTurnResponse(obj: unknown): obj is TakeTurnResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'method' in obj &&
    obj.method === 'takeTurn' &&
    'result' in obj &&
    isTurnAction(obj.result)
  );
}

export function isNewTilesCall(obj: unknown): obj is NewTilesCall {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'method' in obj &&
    obj.method === 'newTiles' &&
    'args' in obj &&
    typeof obj.args === 'object' &&
    obj.args !== null &&
    'newTiles' in obj.args &&
    Array.isArray(obj.args.newTiles) &&
    obj.args.newTiles.every(isTile)
  );
}

export function isNewTilesResponse(obj: unknown): obj is NewTilesResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'method' in obj &&
    obj.method === 'newTiles' &&
    'result' in obj &&
    obj.result === 0
  );
}

export function isWinCall(obj: unknown): obj is WinCall {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'method' in obj &&
    obj.method === 'win' &&
    'args' in obj &&
    typeof obj.args === 'object' &&
    obj.args !== null &&
    'win' in obj.args &&
    typeof obj.args.win === 'boolean'
  );
}

export function isWinResponse(obj: unknown): obj is WinResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'method' in obj &&
    obj.method === 'win' &&
    'result' in obj &&
    obj.result === 0
  );
}

function isRelevantPlayerInfo(obj: unknown): obj is ParsedRelevantPlayerInfo {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'playerTiles' in obj &&
    Array.isArray(obj.playerTiles) &&
    obj.playerTiles.every(isTile) &&
    'mapState' in obj &&
    Array.isArray(obj.mapState) &&
    obj.mapState.every(isTilePlacement) &&
    'scoreboard' in obj &&
    isScoreboard(obj.scoreboard) &&
    'remainingTilesCount' in obj &&
    typeof obj.remainingTilesCount === 'number' &&
    'playersQueue' in obj &&
    Array.isArray(obj.playersQueue) &&
    obj.playersQueue.every((name) => typeof name === 'string')
  );
}

function isTurnAction<T extends QTile>(obj: unknown): obj is TurnAction<T> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'type' in obj &&
    typeof obj.type === 'string' &&
    (obj.type === 'PASS' ||
      obj.type === 'EXCHANGE' ||
      (obj.type === 'PLACE' &&
        'placements' in obj &&
        Array.isArray(obj.placements) &&
        obj.placements.every(isTilePlacement)))
  );
}

function isTilePlacement(obj: unknown): obj is ParsedTilePlacement {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'tile' in obj &&
    isTile(obj.tile) &&
    'coordinate' in obj &&
    isCoordinate(obj.coordinate)
  );
}

function isTile(obj: unknown): obj is ParsedTile {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'shape' in obj &&
    typeof obj.shape === 'string' &&
    shapeList.some((shape) => shape === obj.shape) &&
    'color' in obj &&
    typeof obj.color === 'string' &&
    colorList.some((color) => color === obj.color)
  );
}

function isCoordinate(obj: unknown): obj is ParsedCoordinate {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'x' in obj &&
    typeof obj.x === 'number' &&
    'y' in obj &&
    typeof obj.y === 'number'
  );
}

function isScoreboard(obj: unknown): obj is Scoreboard {
  return Array.isArray(obj) && obj.every(isScoreboardEntry);
}

function isScoreboardEntry(obj: unknown): obj is [string, number] {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'name' in obj &&
    typeof obj.name === 'string' &&
    'score' in obj &&
    typeof obj.score === 'number'
  );
}

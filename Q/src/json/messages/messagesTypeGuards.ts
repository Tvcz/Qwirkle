import { isJChoice, isJPub, isJTile } from '../data/dataTypeGuards';
import {
  MethodCall,
  NameCall,
  NameResponse,
  NewTilesCall,
  NewTilesResponse,
  SetUpCall,
  SetUpResponse,
  TakeTurnCall,
  TakeTurnResponse,
  WinCall,
  WinResponse
} from './messages.types';

function isMethodCall(obj: unknown): obj is MethodCall {
  return (
    typeof obj === 'object' &&
    Array.isArray(obj) &&
    obj.length === 2 &&
    typeof obj[0] === 'string' &&
    Array.isArray(obj[1])
  );
}

export function isNameCall(obj: unknown): obj is NameCall {
  return isMethodCall(obj) && obj[0] === 'name' && obj[1].length === 0;
}

export function isNameResponse(obj: unknown): obj is NameResponse {
  return typeof obj === 'string';
}

export function isSetUpCall(obj: unknown): obj is SetUpCall {
  return (
    isMethodCall(obj) &&
    obj[0] === 'setup' &&
    obj[1].length === 2 &&
    isJPub(obj[1][0]) &&
    Array.isArray(obj[1][1]) &&
    obj[1][1].every(isJTile)
  );
}

export function isSetUpResponse(obj: unknown): obj is SetUpResponse {
  return typeof obj === 'string' && obj === 'void';
}

export function isTakeTurnCall(obj: unknown): obj is TakeTurnCall {
  return (
    isMethodCall(obj) &&
    obj[0] === 'take-turn' &&
    obj[1].length === 1 &&
    isJPub(obj[1][0])
  );
}

export function isTakeTurnResponse(obj: unknown): obj is TakeTurnResponse {
  return typeof obj === 'string' && isJChoice(obj);
}

export function isNewTilesCall(obj: unknown): obj is NewTilesCall {
  return (
    isMethodCall(obj) &&
    obj[0] === 'new-tiles' &&
    obj[1].length === 1 &&
    Array.isArray(obj[1][0]) &&
    obj[1][0].every(isJTile)
  );
}

export function isNewTilesResponse(obj: unknown): obj is NewTilesResponse {
  return typeof obj === 'string' && obj === 'void';
}

export function isWinCall(obj: unknown): obj is WinCall {
  return (
    isMethodCall(obj) &&
    obj[0] === 'win' &&
    obj[1].length === 1 &&
    typeof obj[1][0] === 'boolean'
  );
}

export function isWinResponse(obj: unknown): obj is WinResponse {
  return typeof obj === 'string' && obj === 'void';
}

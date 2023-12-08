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

/**
 * Checks if the given object is a method call.
 *
 * @param obj the object to check
 * @returns true if the object is a method call, false otherwise
 */
function isMethodCall(obj: unknown): obj is MethodCall {
  return (
    typeof obj === 'object' &&
    Array.isArray(obj) &&
    obj.length === 2 &&
    typeof obj[0] === 'string' &&
    Array.isArray(obj[1])
  );
}

/**
 * Checks if the given object is a name call.
 * @param obj the object to check
 * @returns true if the object is a name call, false otherwise
 */
export function isNameCall(obj: unknown): obj is NameCall {
  return isMethodCall(obj) && obj[0] === 'name' && obj[1].length === 0;
}

/**
 * Checks if the given object is a name response.
 * @param obj the object to check
 * @returns true if the object is a name response, false otherwise
 */
export function isNameResponse(obj: unknown): obj is NameResponse {
  return typeof obj === 'string';
}

/**
 * Checks if the given object is a set up call.
 * @param obj the object to check
 * @returns true if the object is a set up call, false otherwise
 */
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

/**
 * Checks if the given object is a set up response.
 * @param obj the object to check
 * @returns true if the object is a set up response, false otherwise
 */
export function isSetUpResponse(obj: unknown): obj is SetUpResponse {
  return typeof obj === 'string' && obj === 'void';
}

/**
 * Checks if the given object is a take turn call.
 * @param obj the object to check
 * @returns true if the object is a take turn call, false otherwise
 */
export function isTakeTurnCall(obj: unknown): obj is TakeTurnCall {
  return (
    isMethodCall(obj) &&
    obj[0] === 'take-turn' &&
    obj[1].length === 1 &&
    isJPub(obj[1][0])
  );
}

/**
 * Checks if the given object is a take turn response.
 * @param obj the object to check
 * @returns true if the object is a take turn response, false otherwise
 */
export function isTakeTurnResponse(obj: unknown): obj is TakeTurnResponse {
  return isJChoice(obj);
}

/**
 * Checks if the given object is a new tiles call.
 * @param obj the object to check
 * @returns true if the object is a new tiles call, false otherwise
 */
export function isNewTilesCall(obj: unknown): obj is NewTilesCall {
  return (
    isMethodCall(obj) &&
    obj[0] === 'new-tiles' &&
    obj[1].length === 1 &&
    Array.isArray(obj[1][0]) &&
    obj[1][0].every(isJTile)
  );
}

/**
 * Checks if the given object is a new tiles response.
 * @param obj the object to check
 * @returns true if the object is a new tiles response, false otherwise
 */
export function isNewTilesResponse(obj: unknown): obj is NewTilesResponse {
  return typeof obj === 'string' && obj === 'void';
}

/**
 * Checks if the given object is a win call.
 * @param obj the object to check
 * @returns true if the object is a win call, false otherwise
 */
export function isWinCall(obj: unknown): obj is WinCall {
  return (
    isMethodCall(obj) &&
    obj[0] === 'win' &&
    obj[1].length === 1 &&
    typeof obj[1][0] === 'boolean'
  );
}

/**
 * Checks if the given object is a win response.
 * @param obj the object to check
 * @returns true if the object is a win response, false otherwise
 */
export function isWinResponse(obj: unknown): obj is WinResponse {
  return typeof obj === 'string' && obj === 'void';
}

import { colorList, shapeList } from '../../game/types/map.types';
import {
  CheatJActor,
  ExceptionJActor,
  JActorSpecB,
  JActorsB,
  JCell,
  JCheat,
  JChoice,
  JCoordinate,
  JExn,
  JMap,
  JName,
  JPlacements,
  JPlayer,
  JPub,
  JRow,
  JState,
  JStrategy,
  JTile,
  LoopJActor,
  OnePlacement,
  SimpleJActor
} from './data.types';

export function isJState(obj: unknown): obj is JState {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'map' in obj &&
    isJMap(obj.map) &&
    'tile*' in obj &&
    Array.isArray(obj['tile*']) &&
    obj['tile*'].every(isJTile) &&
    'players' in obj &&
    Array.isArray(obj.players) &&
    obj.players.length >= 1 &&
    obj.players.every(isJPlayer)
  );
}

export function isJPub(obj: unknown): obj is JPub {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'map' in obj &&
    isJMap(obj.map) &&
    'tile*' in obj &&
    typeof obj['tile*'] === 'number' &&
    'players' in obj &&
    Array.isArray(obj.players) &&
    obj.players.length >= 1 &&
    isJPlayer(obj.players[0]) &&
    obj.players.slice(1).every(isNumber)
  );
}

function isJPlayer(obj: unknown): obj is JPlayer {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'score' in obj &&
    typeof obj.score === 'number' &&
    'name' in obj &&
    typeof obj.name === 'string' &&
    'tile*' in obj &&
    Array.isArray(obj['tile*']) &&
    obj['tile*'].every(isJTile)
  );
}

export function isJMap(obj: unknown): obj is JMap {
  return (
    Array.isArray(obj) &&
    obj.every(isJRow) &&
    noGapsOrOverlap(obj.map((row) => row[0]))
  );
}

function isJRow(obj: unknown): obj is JRow {
  return (
    Array.isArray(obj) &&
    obj.length >= 2 &&
    typeof obj[0] == 'number' &&
    obj.slice(1).every(isJCell) &&
    noDuplicates(obj.map((cell) => cell[0]))
  );
}

function isJCell(obj: unknown): obj is JCell {
  return (
    Array.isArray(obj) &&
    obj.length === 2 &&
    typeof obj[0] === 'number' &&
    isJTile(obj[1])
  );
}

export function isJChoice(obj: unknown): obj is JChoice {
  return obj === 'pass' || obj === 'replace' || isJPlacements(obj);
}

export function isJPlacements(obj: unknown): obj is JPlacements {
  return Array.isArray(obj) && obj.every(isOnePlacement);
}

function isOnePlacement(obj: unknown): obj is OnePlacement {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'coordinate' in obj &&
    isJCoordinate(obj.coordinate) &&
    '1tile' in obj &&
    isJTile(obj['1tile'])
  );
}

function isJCoordinate(obj: unknown): obj is JCoordinate {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'row' in obj &&
    typeof obj.row === 'number' &&
    'column' in obj &&
    typeof obj.column === 'number'
  );
}

export function isJTile(obj: unknown): obj is JTile {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'color' in obj &&
    typeof obj.color === 'string' &&
    colorList.find((color) => color === obj.color) !== undefined &&
    'shape' in obj &&
    typeof obj.shape === 'string' &&
    shapeList.find((shape) => shape === obj.shape) !== undefined
  );
}

export function isJActorsB(obj: unknown): obj is JActorsB {
  return (
    Array.isArray(obj) &&
    obj.length >= 2 &&
    obj.length <= 4 &&
    obj.every(isJActorSpecB)
  );
}

function isJActorSpecB(obj: unknown): obj is JActorSpecB {
  return (
    isSimpleJActor(obj) ||
    isExceptionJActor(obj) ||
    isCheatJActor(obj) ||
    isLoopJActor(obj)
  );
}

export function isSimpleJActor(obj: unknown): obj is SimpleJActor {
  return (
    Array.isArray(obj) &&
    obj.length == 2 &&
    isJName(obj[0]) &&
    isJStrategy(obj[1])
  );
}

export function isExceptionJActor(obj: unknown): obj is ExceptionJActor {
  return (
    Array.isArray(obj) &&
    obj.length == 3 &&
    isJName(obj[0]) &&
    isJStrategy(obj[1]) &&
    isJExn(obj[2])
  );
}

export function isCheatJActor(obj: unknown): obj is CheatJActor {
  return (
    Array.isArray(obj) &&
    obj.length == 4 &&
    isJName(obj[0]) &&
    isJStrategy(obj[1]) &&
    obj[2] === 'a cheat' &&
    isJCheat(obj[3])
  );
}

export function isLoopJActor(obj: unknown): obj is LoopJActor {
  return (
    Array.isArray(obj) &&
    obj.length == 4 &&
    isJName(obj[0]) &&
    isJStrategy(obj[1]) &&
    isJExn(obj[2]) &&
    isCount(obj[3])
  );
}

function isJCheat(obj: unknown): obj is JCheat {
  return (
    obj === 'non-adjacent-coordinate' ||
    obj === 'tile-not-owned' ||
    obj === 'not-a-line' ||
    obj === 'bad-ask-for-tiles' ||
    obj === 'no-fit'
  );
}

function isCount(obj: unknown): obj is number {
  return typeof obj === 'number' && obj >= 1 && obj <= 7;
}

function isJExn(obj: unknown): obj is JExn {
  return (
    obj === 'setup' ||
    obj === 'take-turn' ||
    obj === 'new-tiles' ||
    obj === 'win'
  );
}

function isJName(obj: unknown): obj is JName {
  const regex = /^[a-zA-Z0-9]+$/;
  return (
    typeof obj === 'string' &&
    obj.length >= 1 &&
    obj.length <= 20 &&
    regex.test(obj)
  );
}

function isJStrategy(obj: unknown): obj is JStrategy {
  return obj === 'dag' || obj === 'ldasg';
}

function isNumber(obj: unknown): obj is number {
  return typeof obj === 'number';
}

/**
 * Determines whether the array of numbers has no gaps (sequential) and no
 * overlap (no duplicates).
 * @param arr the array of numbers
 * @returns true if the array has no gaps or overlap, false otherwise
 */
function noGapsOrOverlap(arr: number[]): boolean {
  const arrCopy = [...arr];
  arrCopy.sort((a, b) => a - b);
  for (let i = 0; i < arrCopy.length - 1; i++) {
    if (arrCopy[i] + 1 !== arrCopy[i + 1]) {
      return false;
    }
  }
  return true;
}

/**
 * Determines whether the array has duplicates.
 * @param arr the array of numbers
 * @returns true if the array has no duplicates, false otherwise
 */
function noDuplicates(arr: number[]): boolean {
  return new Set(arr).size === arr.length;
}

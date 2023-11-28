import { Color, Shape } from '../../game/types/map.types';

export type Json =
  | string
  | number
  | { [x: string]: Json }
  | Json[]
  | boolean
  | null;

export type JPub = {
  map: JMap;
  'tile*': number;
  players: [JPlayer, ...number[]];
};

// row index integers form a set without gaps and overlap
export type JMap = JRow[];

// cell sequence must be non-empty
export type JRow = [number, ...JCell[]];

// column index integers form a set
export type JCell = [number, JTile];

export type JTile = { color: Color; shape: Shape };

export type JCoordinate = { row: number; column: number };

export type JState = {
  map: JMap;
  'tile*': JTile[];
  players: JPlayer[];
};

export type JPlayer = {
  score: number;
  name: string;
  'tile*': JTile[];
};

export type JChoice = 'pass' | 'replace' | JPlacements;

export type JPlacements = OnePlacement[];

export type OnePlacement = {
  coordinate: JCoordinate;
  '1tile': JTile;
};

export type JStrategy = 'dag' | 'ldasg';

export type JAction = 'pass' | 'replace' | OnePlacement;

export type JExn = 'setup' | 'take-turn' | 'new-tiles' | 'win';

export type JActorsB =
  | [JActorSpecB, JActorSpecB]
  | [JActorSpecB, JActorSpecB, JActorSpecB]
  | [JActorSpecB, JActorSpecB, JActorSpecB, JActorSpecB];

export type SimpleJActor = [JName, JStrategy];
export type ExceptionJActor = [JName, JStrategy, JExn];
export type CheatJActor = [JName, JStrategy, 'a cheat', JCheat];
export type LoopJActor = [JName, JStrategy, JExn, Count];

export type JActorSpecB =
  | SimpleJActor
  | ExceptionJActor
  | CheatJActor
  | LoopJActor;

export type JName = string;

type Count = number;

export type JCheat =
  | 'non-adjacent-coordinate'
  | 'tile-not-owned'
  | 'not-a-line'
  | 'bad-ask-for-tiles'
  | 'no-fit';

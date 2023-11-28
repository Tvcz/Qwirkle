import { JChoice, JPub, JTile } from './data.types';

export type MethodCall = [string, unknown[]];

export type NameCall = ['name', []];

export type NameResponse = string;

export type SetUpCall = ['setup', [JPub, JTile[]]];

export type SetUpResponse = 'void';

export type TakeTurnCall = ['take-turn', [JPub]];

export type TakeTurnResponse = JChoice;

export type NewTilesCall = ['new-tiles', [JTile[]]];

export type NewTilesResponse = 'void';

export type WinCall = ['win', [boolean]];

export type WinResponse = 'void';

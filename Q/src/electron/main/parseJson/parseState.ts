import { Json, JState, JPlayer, JTile } from '../types';
import { mustParseAsJMap, mustParseAsJTile } from './parseMap';

export function mustParseAsJState(json: Json): JState {
  if (
    typeof json !== 'object' ||
    Array.isArray(json) ||
    json === null ||
    typeof json['map'] !== 'object' ||
    typeof json['tile*'] !== 'object' ||
    typeof json['players'] !== 'object'
  ) {
    throw new Error('invalid 1Placement');
  }
  return {
    map: mustParseAsJMap(json['map']),
    'tile*': mustParseAsTiles(json['tile*']),
    players: mustParseAsPlayers(json['players'])
  };
}

export function mustParseAsPlayers(json: Json): JPlayer[] {
  if (
    typeof json !== 'object' ||
    !Array.isArray(json) ||
    json === null ||
    json.length < 1 ||
    typeof json[0] !== 'object'
  ) {
    throw new Error('invalid [JPlayer, ...number] array');
  }
  return json.map((jsonPlayer) => mustParseAsJPlayer(jsonPlayer));
}

export function mustParseAsJPlayer(json: Json): JPlayer {
  if (
    typeof json !== 'object' ||
    Array.isArray(json) ||
    json === null ||
    typeof json['score'] !== 'number' ||
    typeof json['tile*'] !== 'object'
  ) {
    throw new Error('invalid JPlayer');
  }
  return {
    score: json['score'],
    'tile*': mustParseAsTiles(json['tile*'])
  };
}

export function mustParseAsTiles(json: Json): JTile[] {
  if (typeof json !== 'object' || !Array.isArray(json) || json === null) {
    throw new Error('invalid [...JTile] array');
  }
  return json.map((tile) => mustParseAsJTile(tile));
}

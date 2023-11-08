import {
  JCell,
  JMap,
  JPlayer,
  JRow,
  JState,
  JTile
} from '../game/types/json.types';
import {
  RenderableGameState,
  RenderableMapState,
  RenderablePlayer,
  TilePlacement
} from '../game/types/gameState.types';
import { ShapeColorTile } from '../game/map/tile';

export function toJState(
  gameState: RenderableGameState<ShapeColorTile>
): JState {
  const map = toJMap(gameState.mapState);
  const refsTiles = gameState.remainingTiles.map(toJTile);

  if (gameState.players.length === 0) {
    throw new Error('A player');
  }
  const jPlayers = gameState.players.map(toJPlayer);
  const players: [JPlayer, ...JPlayer[]] = [jPlayers[0], ...jPlayers.slice(1)];
  return {
    map,
    'tile*': refsTiles,
    players
  };
}

export function toJPlayer(player: RenderablePlayer<ShapeColorTile>) {
  const jPlayer: JPlayer = {
    name: player.name,
    score: player.score,
    'tile*': player.tiles.map(toJTile)
  };
  return jPlayer;
}

export function toJMap(mapState: RenderableMapState<ShapeColorTile>): JMap {
  const mapData = mapState.tilePlacements;
  const rowBuckets = new Map<number, TilePlacement<ShapeColorTile>[]>();
  mapData.forEach((element) => {
    const y = element.coordinate.getCoordinate().y;
    if (rowBuckets.has(y)) {
      rowBuckets.get(y)?.push(element);
    } else {
      rowBuckets.set(y, [element]);
    }
  });
  const jMap: JMap = [];
  rowBuckets;
  rowBuckets.forEach((tileRow, rowIndex) =>
    jMap.push(toJRow(tileRow, rowIndex))
  );
  jMap.sort((a, b) => a[0] - b[0]);
  return jMap;
}

export function toJTile(tile: ShapeColorTile): JTile {
  return {
    color: tile.getColor(),
    shape: tile.getShape()
  };
}

function toJRow(
  tileRow: TilePlacement<ShapeColorTile>[],
  rowIndex: number
): JRow {
  const jCells = tileRow.map(toJCell);
  jCells.sort((a, b) => a[0] - b[0]);
  return [rowIndex, ...jCells];
}

function toJCell(tilePlacement: TilePlacement<ShapeColorTile>): JCell {
  return [
    tilePlacement.coordinate.getCoordinate().x,
    toJTile(tilePlacement.tile)
  ];
}

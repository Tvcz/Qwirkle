import { ShapeColorTile } from '../../game/map/tile';
import { TilePlacement } from '../../game/types/gameState.types';
import { JCell, JMap, JRow, JTile } from '../data/data.types';

export function toJMap(mapState: TilePlacement<ShapeColorTile>[]): JMap {
  const rowBuckets = new Map<number, TilePlacement<ShapeColorTile>[]>();
  mapState.forEach((element) => {
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

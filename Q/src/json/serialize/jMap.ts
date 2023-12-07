import { ShapeColorTile } from '../../game/map/tile';
import { TilePlacement } from '../../game/types/gameState.types';
import { JCell, JMap, JRow, JTile } from '../data/data.types';

/**
 * Converts an internal representation of a map to a JMap.
 * @param mapState a internal representation of a map, which is a list of tile placements
 * @returns a JMap
 */
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

/**
 * Converts an internal representation of a tile to a JTile.
 * @param tile an internal representation of a tile
 * @returns a JTile
 */
export function toJTile(tile: ShapeColorTile): JTile {
  return {
    color: tile.getColor(),
    shape: tile.getShape()
  };
}

/**
 * Converts an internal representation of a tile placement to a JCell.
 * @param tileRow an internal representation of a tile placement row
 * @param rowIndex the row index of the tile placement row
 * @returns
 */
function toJRow(
  tileRow: TilePlacement<ShapeColorTile>[],
  rowIndex: number
): JRow {
  const jCells = tileRow.map(toJCell);
  jCells.sort((a, b) => a[0] - b[0]);
  return [rowIndex, ...jCells];
}

/**
 * Converts an internal representation of a tile placement to a JCell.
 * @param tilePlacement an internal representation of a tile placement
 * @returns a JCell
 */
function toJCell(tilePlacement: TilePlacement<ShapeColorTile>): JCell {
  return [
    tilePlacement.coordinate.getCoordinate().x,
    toJTile(tilePlacement.tile)
  ];
}

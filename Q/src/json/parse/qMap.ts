import Coordinate from '../../game/map/coordinate';
import BaseMap, { QMap } from '../../game/map/map';
import { BaseTile, ShapeColorTile } from '../../game/map/tile';
import { TilePlacement } from '../../game/types/gameState.types';
import { JCell, JMap, JTile } from '../data/data.types';

export function toQMap(jMap: JMap): QMap<ShapeColorTile> {
  const tilePlacements: TilePlacement<ShapeColorTile>[] = [];
  jMap.forEach((row) => {
    (row.slice(1) as JCell[]).forEach((cell) =>
      tilePlacements.push(toTilePlacement(cell))
    );
  });
  return new BaseMap(tilePlacements);
}

function toTilePlacement(jCell: JCell): TilePlacement<ShapeColorTile> {
  return {
    tile: toQTile(jCell[1]),
    coordinate: new Coordinate(jCell[0], jCell[0])
  };
}

export function toQTile(jTile: JTile): BaseTile {
  return new BaseTile(jTile.shape, jTile.color);
}

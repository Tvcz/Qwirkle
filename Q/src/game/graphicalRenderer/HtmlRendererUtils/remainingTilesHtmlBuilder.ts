import { ShapeColorTile } from '../../map/tile';
import { renderTilesVerticallyScrolling } from './tileHtmlBuilder';

/**
 * Build an html string to display the remaining tiles
 * @param remainingTiles the number of remaining tiles that the referee has
 * @returns An HTML string visualizing the number of remaining tiles
 */
export const remainingTilesHtmlBuilder = (remainingTiles: ShapeColorTile[]) => {
  const remainingTilesHeader = '<h3>Remaining Tiles: </h3>';
  return `
        <div>
            ${remainingTilesHeader}
            ${renderTilesVerticallyScrolling(remainingTiles)}
        </div>
    `;
};

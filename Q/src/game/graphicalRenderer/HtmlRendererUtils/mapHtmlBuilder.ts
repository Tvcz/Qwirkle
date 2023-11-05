import { QTile } from '../../map/tile';
import { RenderableMapState, TilePlacement } from '../../types/gameState.types';
import { Dimensions } from '../../types/map.types';
import { tileHtmlBuilder } from './tileHtmlBuilder';

//
/**
 * Build the map as an html string.
 * Uses dimensions to determine the number of rows and columns in the CSS grid
 * @param dimensions the positions of the leftmost, rightmost, topmost, and bottommost tiles on the map
 * @param tilePlacements the tiles and their coordinates on the map
 * @returns An HTML string visualizing the map
 */
export const mapHtmlBuilder = ({
  dimensions,
  tilePlacements
}: RenderableMapState<QTile>) => {
  const width = dimensions.rightmost + 1 - dimensions.leftmost;
  const height = dimensions.topmost + 1 - dimensions.bottommost;

  const mapContainerStyle = [
    'display: grid;',
    `grid-template-rows: repeat(${height}, 50px);`,
    `grid-template-columns: repeat(${width}, 50px);`,
    'column-gap: 10px;',
    'row-gap: 10px;',
    'width: max-content;',
    'border: 1px solid black;'
  ].join('');

  return `
      <div style="${mapContainerStyle}">
          ${tilePlacementsHtmlBuilder(tilePlacements, dimensions)}
      </div>
      `;
};

/**
 * Build a tile placement as an html string.
 * Tile is placed at the given x and y coordinate.
 * Since the CSS grid uses a coordinate system starting at (0,0), and expanding in the positive x and y directions, the dimensions object needs to be used to adjust the tile's coordinate system to match that
 * @param tilePlacements the tiles and their coordinates on the map
 * @param dimensions the positions of the leftmost, rightmost, topmost, and bottommost tiles on the map
 * @returns An HTML string visualizing the tiles on the map
 */
const tilePlacementsHtmlBuilder = (
  tilePlacments: TilePlacement<QTile>[],
  dimensions: Dimensions
) => {
  return tilePlacments
    .map(({ tile, coordinate }) => {
      const { x, y } = coordinate.getCoordinate();
      const xAdjusted = x + 1 - dimensions.leftmost;
      const yAdjusted = y + 1 - dimensions.bottommost;

      return tileHtmlBuilder(xAdjusted, yAdjusted, tile);
    })
    .join('');
};

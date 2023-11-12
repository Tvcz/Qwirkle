import { TILE_SCALE } from '../../../constants';
import { BaseTile, QTile, ShapeColorTile } from '../../map/tile';
import { Color, Shape } from '../../types/map.types';

// TODO: Use constant for tile size and scale according to that constant for sub-elements

export const renderTilesInline = (tiles: ShapeColorTile[]): string => {
  const htmlTiles = tiles.map((tile) => baseTileHtmlBuilder(tile)).join('');
  const style = `
    display: flex;
  `;
  return `<span style="${style}">
            ${htmlTiles}
          </span>`;
};

export const renderTilesVerticallyScrolling = (tiles: ShapeColorTile[]) => {
  const htmlTiles = tiles.map((tile) => baseTileHtmlBuilder(tile)).join('');
  const MAX_TILES_DISPLAYED_BEFORE_SCROLLING = 8;
  const style = `
    display: flex;
    flex-direction: column;
    gap: ${TILE_SCALE / 5}px;
    overflow-y: scroll;
    max-height: ${MAX_TILES_DISPLAYED_BEFORE_SCROLLING * TILE_SCALE}px;
  `;
  return `<div style="${style}">
          <div></div>
            ${htmlTiles}
          </div>`;
};

/**
 * Build a tile as an html string.
 * Only BaseTiles can be displayed
 * @param x x-coordinate
 * @param y y-coordinate
 * @param tile A QTile
 * @returns If tile is a BaseTile, an HTML string visualizing a tile at a coordinate, otherwise an empty string
 */
export const tileHtmlBuilder = (x: number, y: number, tile: QTile) => {
  if (tile instanceof BaseTile) {
    return baseTileHtmlBuilder(tile, x, y);
  }
  return '';
};

/**
 * Buld a BaseTile as an html string
 * @param x x-coordinate
 * @param y y-coordinate
 * @param tile A QTile
 * @returns an HTML string visualizing a ShapeColorTile
 */
const baseTileHtmlBuilder = (
  tile: ShapeColorTile,
  x?: number,
  y?: number,
  inGrid: boolean = true
) => {
  const shape = tile.getShape();
  const color = tile.getColor();

  const containerStyleItems = [
    `width: ${TILE_SCALE}px;`,
    `min-height: ${TILE_SCALE}px;`,
    'position: relative;',
    'display: flex;',
    'justify-content: center;',
    'align-items: center;'
  ];

  if (inGrid) {
    containerStyleItems.push(
      `grid-column-start: ${x};`,
      `grid-row-start: ${y};`
    );
  }

  const containerStyle = containerStyleItems.join('');

  return `
      <div style="${containerStyle}">
          ${shapeColorTileHtmlBuilder(shape, color)}
      </div>
      `;
};

/**
 * Build the correct type of ShapeColor tile, based on the shape and color, as an html string
 * @param shape shape of the tile
 * @param color color of the tile
 * @returns An HTML string visualizing a shape color tile
 */
export const shapeColorTileHtmlBuilder = (shape: Shape, color: Color) => {
  switch (shape) {
    case '8star':
      return eightStarTileHtmlBuilder(color);
    case 'star':
      return starTileHtmlBuilder(color);
    case 'square':
      return squareTileHtmlBuilder(color);
    case 'circle':
      return circleTileHtmlBuilder(color);
    case 'clover':
      return cloverTileHtmlBuilder(color);
    case 'diamond':
      return diamondTileHtmlBuilder(color);
    default:
      return '';
  }
};

/**
 * Build an 8Star tile as an HTML string
 * @param color color of the tile
 * @returns An HTML string visualizing an 8Star tile of the given color
 */
const eightStarTileHtmlBuilder = (color: Color) => {
  const containerStyle = [
    'width: 35px;',
    'height: 35px;',
    'transform: rotate(0deg);',
    `background-color: ${color};`
  ].join('');

  const innerStyle = [
    'position: absolute;',
    'top: 0;',
    'left: 0;',
    'height: 35px;',
    'width: 35px;',
    `background: ${color};`,
    'transform: rotate(135deg);'
  ].join('');

  return `
        <div style="${containerStyle}">
            <div style="${innerStyle}"></div>
        </div>
    `;
};

/**
 * Build an star tile as an HTML string
 * @param color color of the tile
 * @returns An HTML string visualizing an star tile of the given color
 */
const starTileHtmlBuilder = (color: Color) => {
  const containerStyle = [
    'background-color: transparent;',
    'width: 50px;',
    'height: 50px;'
  ].join('');

  const inner1Style = [
    'position: absolute;',
    'display: block;',
    'top: 0;',
    'left: 12px;',
    `background: ${color};`,
    'width: 25px;',
    'height: 25px;',
    'transform: translateY(50%) rotate(180deg) skewX(22.5deg) skewY(22.5deg);'
  ].join('');

  const inner2Style = [
    ...inner1Style,
    'transform: translateY(50%) rotate(90deg) skewX(22.5deg) skewY(22.5deg);'
  ].join('');

  return `
        <div style="${containerStyle}">
            <div style="${inner1Style}"></div>
            <div style="${inner2Style}"></div>
        </div>
    `;
};

/**
 * Build an square tile as an HTML string
 * @param color color of the tile
 * @returns An HTML string visualizing an square tile of the given color
 */
const squareTileHtmlBuilder = (color: Color) => {
  const containerStyle = [
    `background-color: ${color};`,
    'width: 45px;',
    'height: 45px;'
  ].join('');

  return `<div style="${containerStyle}"></div>`;
};

/**
 * Build an circle tile as an HTML string
 * @param color color of the tile
 * @returns An HTML string visualizing an circle tile of the given color
 */
const circleTileHtmlBuilder = (color: Color) => {
  const containerStyle = [
    `background-color: ${color};`,
    'width: 45px;',
    'height: 45px;',
    'border-radius: 50%;'
  ].join('');

  return `<div style="${containerStyle}"></div>`;
};

/**
 * Build an clover tile as an HTML string
 * @param color color of the tile
 * @returns An HTML string visualizing an clover tile of the given color
 */
const cloverTileHtmlBuilder = (color: Color) => {
  const containerStyle = [
    'background-color: transparent;',
    'width: 50px;',
    'height: 50px;'
  ].join('');

  const inner1Style = [
    'border-radius: 20px;',
    'position: absolute;',
    'display: block;',
    `background: ${color};`,
    'width: 50px;',
    'height: 25px;',
    'transform: translateY(50%);'
  ].join('');

  const inner2Style = [
    ...inner1Style,
    'transform: translateY(50%) rotate(90deg);'
  ].join('');

  return `
        <div style="${containerStyle}">
            <div style="${inner1Style}"></div>
            <div style="${inner2Style}"></div>
        </div>
    `;
};

/**
 * Build an diamond tile as an HTML string
 * @param color color of the tile
 * @returns An HTML string visualizing an diamond tile of the given color
 */
const diamondTileHtmlBuilder = (color: Color) => {
  const containerStyle = [
    'width: 35px;',
    'height: 35px;',
    'transform: rotate(45deg);',
    `background-color: ${color};`
  ].join('');

  return `<div style="${containerStyle}"></div>`;
};

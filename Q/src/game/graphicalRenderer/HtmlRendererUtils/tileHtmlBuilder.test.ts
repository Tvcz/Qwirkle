import { BaseTile } from '../../map/tile';
import { Color, Shape } from '../../types/map.types';
import { tileHtmlBuilder } from './tileHtmlBuilder';

const buildTileContainerHtml = (shape: Shape, color: Color) => {
  // Arrange
  const x = 0;
  const y = 0;
  const tile = new BaseTile(shape, color);
  const containerStyle = [
    'width: 50px;',
    'height: 50px;',
    'position: relative;',
    'display: flex;',
    'justify-content: center;',
    'align-items: center;',
    `grid-column-start: ${x};`,
    `grid-row-start: ${y};`
  ].join('');

  return { x, y, tile, containerStyle };
};

describe('tests for tileHtmlBuilder', () => {
  test('red star html', () => {
    // Arrange
    const { x, y, tile, containerStyle } = buildTileContainerHtml(
      'star',
      'red'
    );

    const containerStyleStar = [
      'background-color: transparent;',
      'width: 50px;',
      'height: 50px;'
    ].join('');
    const inner1Style = [
      'position: absolute;',
      'display: block;',
      'top: 0;',
      'left: 12px;',
      `background: red;`,
      'width: 25px;',
      'height: 25px;',
      'transform: translateY(50%) rotate(180deg) skewX(22.5deg) skewY(22.5deg);'
    ].join('');
    const inner2Style = [
      ...inner1Style,
      'transform: translateY(50%) rotate(90deg) skewX(22.5deg) skewY(22.5deg);'
    ].join('');

    const expectedHtml = `
    <div style="${containerStyle}">
        <div style="${containerStyleStar}">
            <div style="${inner1Style}"></div>
            <div style="${inner2Style}"></div>
        </div>
    </div>
    `;

    // Act
    const html = tileHtmlBuilder(tile, x, y);

    // Assert
    expect(html.replace(/\s/g, '')).toBe(expectedHtml.replace(/\s/g, ''));
  });
  test('green 8star html', () => {
    // Arrange
    const { x, y, tile, containerStyle } = buildTileContainerHtml(
      '8star',
      'green'
    );

    const containerStyle8Star = [
      'width: 35px;',
      'height: 35px;',
      'transform: rotate(0deg);',
      `background-color: green;`
    ].join('');

    const innerStyle = [
      'position: absolute;',
      'top: 0;',
      'left: 0;',
      'height: 35px;',
      'width: 35px;',
      `background: green;`,
      'transform: rotate(135deg);'
    ].join('');
    const expectedHtml = `
    <div style="${containerStyle}">
        <div style="${containerStyle8Star}">
            <div style="${innerStyle}"></div>
        </div>
    </div>
    `;

    // Act
    const html = tileHtmlBuilder(tile, x, y);

    expect(html.replace(/\s/g, '')).toBe(expectedHtml.replace(/\s/g, ''));
  });
  test('blue square html', () => {
    // Arrange
    const { x, y, tile, containerStyle } = buildTileContainerHtml(
      'square',
      'blue'
    );

    const containerStyleSquare = [
      `background-color: blue;`,
      'width: 45px;',
      'height: 45px;'
    ].join('');

    const expectedHtml = `
      <div style="${containerStyle}">
        <div style="${containerStyleSquare}"></div>
      </div>
      `;

    // Act
    const html = tileHtmlBuilder(tile, x, y);

    expect(html.replace(/\s/g, '')).toBe(expectedHtml.replace(/\s/g, ''));
  });
  test('circle yellow html', () => {
    // Arrange
    const { x, y, tile, containerStyle } = buildTileContainerHtml(
      'circle',
      'yellow'
    );

    const containerStyleCircle = [
      `background-color: yellow;`,
      'width: 45px;',
      'height: 45px;',
      'border-radius: 50%;'
    ].join('');

    const expectedHtml = `
        <div style="${containerStyle}">
            <div style="${containerStyleCircle}"></div>
        </div>
        `;

    // Act
    const html = tileHtmlBuilder(tile, x, y);

    expect(html.replace(/\s/g, '')).toBe(expectedHtml.replace(/\s/g, ''));
  });
  test('clover orange html', () => {
    // Arrange
    const { x, y, tile, containerStyle } = buildTileContainerHtml(
      'clover',
      'orange'
    );

    const containerStyleClover = [
      'background-color: transparent;',
      'width: 50px;',
      'height: 50px;'
    ].join('');
    const inner1Style = [
      'border-radius: 20px;',
      'position: absolute;',
      'display: block;',
      `background: orange;`,
      'width: 50px;',
      'height: 25px;',
      'transform: translateY(50%);'
    ].join('');
    const inner2Style = [
      ...inner1Style,
      'transform: translateY(50%) rotate(90deg);'
    ].join('');

    const expectedHtml = `
      <div style="${containerStyle}">
          <div style="${containerStyleClover}">
              <div style="${inner1Style}"></div>
              <div style="${inner2Style}"></div>
          </div>
      </div>
      `;

    // Act
    const html = tileHtmlBuilder(tile, x, y);

    // Assert
    expect(html.replace(/\s/g, '')).toBe(expectedHtml.replace(/\s/g, ''));
  });
  test('diamond purple html', () => {
    // Arrange
    const { x, y, tile, containerStyle } = buildTileContainerHtml(
      'diamond',
      'purple'
    );

    const containerStyleDiamond = [
      'width: 35px;',
      'height: 35px;',
      'transform: rotate(45deg);',
      `background-color: purple;`
    ].join('');

    const expectedHtml = `
        <div style="${containerStyle}">
          <div style="${containerStyleDiamond}"></div>
        </div>
        `;

    // Act
    const html = tileHtmlBuilder(tile, x, y);

    expect(html.replace(/\s/g, '')).toBe(expectedHtml.replace(/\s/g, ''));
  });
});

import Coordinate from '../../map/coordinate';
import { BaseTile } from '../../map/tile';
import { mapHtmlBuilder } from './mapHtmlBuilder';
import { tileHtmlBuilder } from './tileHtmlBuilder';

jest.mock('./tileHtmlBuilder');

describe('tests for mapHtmlBuilder', () => {
  test('mapHtmlBuilder returns a string with the html info for tile placements', () => {
    // Arrange
    jest
      .mocked(tileHtmlBuilder)
      .mockImplementation((x, y) => `<x : ${x}, y : ${y}>`);

    const mapState = {
      tilePlacements: [
        {
          tile: new BaseTile('square', 'red'),
          coordinate: new Coordinate(4, -3)
        },
        {
          tile: new BaseTile('square', 'blue'),
          coordinate: new Coordinate(6, -10)
        },
        {
          tile: new BaseTile('square', 'green'),
          coordinate: new Coordinate(5, -6)
        }
      ],
      dimensions: { topmost: -3, bottommost: -10, leftmost: 4, rightmost: 6 }
    };

    const mapContainerStyleExpected = [
      'display: grid;',
      `grid-template-rows: repeat(${8}, 50px);`,
      `grid-template-columns: repeat(${3}, 50px);`,
      'column-gap: 10px;',
      'row-gap: 10px;',
      'width: max-content;',
      'border: 1px solid black;'
    ].join('');

    const htmlExpected = `
        <div style="${mapContainerStyleExpected}">
            <x : ${1}, y : ${8}>
            <x : ${3}, y : ${1}>
            <x : ${2}, y : ${5}>
        </div>
    `;

    // Act
    const html = mapHtmlBuilder(mapState);

    // Assert
    expect(html.replace(/\s/g, '')).toBe(htmlExpected.replace(/\s/g, ''));
  });
});

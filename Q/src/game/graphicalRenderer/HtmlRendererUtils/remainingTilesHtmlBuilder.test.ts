import { remainingTilesHtmlBuilder } from './remainingTilesHtmlBuilder';

describe('tests for remainingTilesHtmlBuilder', () => {
  test('remainingTilesHtmlBuilder returns a string with the html for the remaining tiles count', () => {
    // Arrange
    const remainingTiles = 5;
    const htmlExpected = `
        <div>
        <h3>Remaining Tiles: </h3>
        <p style="font-size: 30px;">
            5
        </p>
    </div>
        `;

    // Act
    const html = remainingTilesHtmlBuilder(remainingTiles);

    // Assert
    expect(html.replace(/\s/g, '')).toBe(htmlExpected.replace(/\s/g, ''));
  });
});

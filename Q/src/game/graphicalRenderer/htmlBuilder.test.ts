import { gameStateHtmlBuilder } from './htmlBuilder';
import { mapHtmlBuilder } from './mapHtmlBuilder';
import { remainingTilesHtmlBuilder } from './remainingTilesHtmlBuilder';
import { scoreboardHtmlBuilder } from './scoreboardHtmlBuilder';
import { turnOrderHtmlBuilder } from './turnOrderHtmlBuilder';

jest.mock('./mapHtmlBuilder');
jest.mock('./remainingTilesHtmlBuilder');
jest.mock('./scoreboardHtmlBuilder');
jest.mock('./turnOrderHtmlBuilder');

describe('tests for htmlBuilder functions', () => {
  test('htmlBuilder returns an string with the html info for the header, the map, the scoreboard, and the turn order', () => {
    // Arrange
    jest.mocked(mapHtmlBuilder).mockReturnValue('<map html />');
    jest.mocked(scoreboardHtmlBuilder).mockReturnValue('<scoreboard html />');
    jest.mocked(turnOrderHtmlBuilder).mockReturnValue('<turn order html />');
    jest
      .mocked(remainingTilesHtmlBuilder)
      .mockReturnValue('<remaining tiles html />');

    const renderableData = {
      mapState: {
        tilePlacements: [],
        dimensions: { topmost: 0, bottommost: 0, leftmost: 0, rightmost: 0 }
      },
      scoreboard: [],
      turnQueue: [],
      remainingTilesCount: 10
    };
    const htmlExpected = `
    <!doctype html>
    <html style="height: 100vh;">
        <head>
            <title>Q</title>
        </head>
        <body>
            <h1>Q Game</h1>
            <map html />
            <div style="display: flex;column-gap: 50px;">
                <scoreboard html />
                <turn order html />
                <remaining tiles html />
            </div>
        </body>
    </html>
`;

    // Act
    const html = gameStateHtmlBuilder(renderableData);

    // Assert
    expect(html.replace(/\s/g, '')).toBe(htmlExpected.replace(/\s/g, ''));
  });
});

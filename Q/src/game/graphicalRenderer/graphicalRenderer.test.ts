import { htmlBuilder } from './HtmlRendererUtils/htmlBuilder';
import HtmlRenderer from './graphicalRenderer';

jest.mock('./HtmlRendererUtils/htmlBuilder');

describe('tests for HtmlGraphicalRenderer', () => {
  test('getRenderableString passes the game state to the htmlBuilder function', () => {
    // Arrange
    const gameStateData = {
      mapState: {
        tilePlacements: [],
        dimensions: { topmost: 0, bottommost: 0, leftmost: 0, rightmost: 0 }
      },
      scoreboard: [],
      turnQueue: [],
      remainingTilesCount: 10
    };
    const htmlRenderer = new HtmlRenderer();
    const mockHtmlBuilder = jest.fn();
    jest.mocked(htmlBuilder).mockImplementation(mockHtmlBuilder);

    // Act
    htmlRenderer.getRenderableString(gameStateData);

    // Assert
    expect(mockHtmlBuilder).toBeCalledWith(gameStateData);
  });
});

import { turnOrderHtmlBuilder } from './turnOrderHtmlBuilder';

describe('tests for turnOrderHtmlBuilder', () => {
  test('turnOrderHtmlBuilder returns a string with html data for the turn order', () => {
    // Arrange
    const turnOrder = ['joe', 'bob', 'john'];
    const expectedHtml = `
    <div>
        <h3>Turn Order: </h3>
        [ <span style="margin: 0 10px;">joe</span> <span style="margin: 0 10px;">bob</span> <span style="margin: 0 10px;">john</span> ]
    </div>
    `;

    // Act
    const html = turnOrderHtmlBuilder(turnOrder);

    // Assert
    expect(html.replace(/\s/g, '')).toBe(expectedHtml.replace(/\s/g, ''));
  });
});

import { scoreboardHtmlBuilder } from './scoreboardHtmlBuilder';

describe('tests for scoreboardHtmlBuilder', () => {
  test('scoreboardHtmlBuilder returns a string with the html for the remaining tiles count', () => {
    // Arrange
    const scoreboard = [
      { name: 'joe', score: 10 },
      { name: 'bob', score: 20 },
      { name: 'john', score: 25 }
    ];
    const scoreboardContainerStyle = [
      'display: flex;',
      'flex-direction: column;'
    ].join('');

    const scoreboardHeaderRowStyle = [
      'display: flex;',
      'flex-direction: row;',
      'justifycontent: space-between;',
      'column-gap: 20px;',
      'font-size: 24px;'
    ].join('');

    const scoreStyle = [
      'display: flex;',
      'flex-direction: row;',
      'justify-dontent: space-between;',
      'column-gap: 20px;'
    ].join('');

    const htmlExpected = `
    <div style="${scoreboardContainerStyle}">
        <h3>Scoreboard: </h3>
        <div style="${scoreboardHeaderRowStyle}">
            <p>Name</p>
            <p>Score</p>
        </div>
        <div style="${scoreStyle}">
            <p>joe</p>
            <p>10</p>
        </div>
        <div style="${scoreStyle}">
            <p>bob</p>
            <p>20</p>
        </div>
        <div style="${scoreStyle}">
            <p>john</p>
            <p>25</p>
        </div>
    </div>
        `;

    // Act
    const html = scoreboardHtmlBuilder(scoreboard);

    // Assert
    expect(html.replace(/\s/g, '')).toBe(htmlExpected.replace(/\s/g, ''));
  });
});

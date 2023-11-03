import { Scoreboard } from '../../types/gameState.types';

/**
 * Build an html string to display the scoreboard and header
 * @param scoreboard a list of player names and their scores
 * @returns An HTML string visualizing the scoreboard and header
 */
export const scoreboardHtmlBuilder = (scoreboard: Scoreboard) => {
  const scoreboardHeader = '<h3>Scoreboard: </h3>';

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

  const headerRowId = '<p>Name</p>';
  const headerRowScore = '<p>Score</p>';

  return `
        <div style="${scoreboardContainerStyle}">
            ${scoreboardHeader}
            <div style="${scoreboardHeaderRowStyle}">
                ${headerRowId}
                ${headerRowScore}
            </div>
            ${scoreHtmlBuilder(scoreboard).join('')}
        </div>
    `;
};

/**
 * Build an html string to display the scoreboard
 * @param scoreboard a list of player names and their scores
 * @returns An HTML string visualizing the scoreboard
 */
const scoreHtmlBuilder = (scoreboard: Scoreboard) => {
  const scoreStyle = [
    'display: flex;',
    'flex-direction: row;',
    'justify-dontent: space-between;',
    'column-gap: 20px;'
  ].join('');

  return scoreboard.map(({ name, score }) => {
    return `
            <div style="${scoreStyle}">
                <p>${name}</p>
                <p>${score}</p>
            </div>
        `;
  });
};

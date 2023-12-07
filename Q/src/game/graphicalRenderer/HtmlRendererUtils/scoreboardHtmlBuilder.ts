import { RenderablePlayer } from '../../types/gameState.types';
import { renderTilesInline } from './tileHtmlBuilder';

/**
 * Build an html string to display the scoreboard and header
 * @param scoreboard a list of player names and their scores
 * @returns An HTML string visualizing the scoreboard and header
 */
export const scoreboardHtmlBuilder = (players: RenderablePlayer[]) => {
  const scoreboardHeader = '<h3>Scoreboard: </h3>';

  const scoreboardContainerStyle = [
    'display: flex;',
    'flex-direction: column;'
  ].join('');

  const scoreboardStyle = [
    'display: grid;',
    'grid-template-columns: 1fr 1fr 3fr;',
    'justify-items: center;',
    'align-items: center;',
    'column-gap: 20px;',
    'font-size: 20px;'
  ].join('');

  const nameStyle = ['width: 100px;', 'text-align: left;'].join('');
  const scoreStyleFixed = ['width: 100px;', 'text-align: center;'].join('');

  const headerRowName = `<p style="${nameStyle}">Name</p>`;
  const headerRowScore = `<p style="${scoreStyleFixed}">Score</p>`;
  const headerRowTiles = '<p>Tiles</p>';

  return `
        <div style="${scoreboardContainerStyle}">
            ${scoreboardHeader}
            <div style="${scoreboardStyle}">
              ${headerRowName}
              ${headerRowScore}
              ${headerRowTiles}
            </div>
            ${scoreHtmlBuilder(
              players,
              scoreboardStyle,
              nameStyle,
              scoreStyleFixed
            ).join('')}
        </div>
    `;
};

/**
 * Build an html string to display the scoreboard
 * @param scoreboard a list of player names and their scores
 * @returns An HTML string visualizing the scoreboard
 */
const scoreHtmlBuilder = (
  players: RenderablePlayer[],
  scoreboardStyle: string,
  nameStyle: string,
  scoreStyleFixed: string
) => {
  return players.map(({ name, score, tiles }) => {
    return `
            <div style="${scoreboardStyle}">
                <p style="${nameStyle}">${name}</p>
                <p style="${scoreStyleFixed}">${score}</p>
                ${renderTilesInline(tiles)}
            </div>
        `;
  });
};

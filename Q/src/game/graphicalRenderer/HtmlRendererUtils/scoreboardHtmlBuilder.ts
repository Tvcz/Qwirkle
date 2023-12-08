import { RenderablePlayer } from '../../types/gameState.types';
import { renderTilesInline } from './tileHtmlBuilder';

/**
 * Build an html string to display the scoreboard and header
 * @param players a list of player names, their scores, and their tiles
 * @returns An HTML string visualizing the scoreboard and header
 */
const scoreboardHeader = '<h3>Scoreboard: </h3>';
export const scoreboardHtmlBuilder = (players: RenderablePlayer[]) => {
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
  const scoreStyle = ['width: 100px;', 'text-align: center;'].join('');

  const headerRowName = `<p style="${nameStyle}">Name</p>`;
  const headerRowScore = `<p style="${scoreStyle}">Score</p>`;
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
              scoreStyle
            ).join('')}
        </div>
    `;
};

/**
 * Build an html string to display the scoreboard
 * @param players a list of player names, their scores, and their tiles
 * @param scoreboardStyle the css style for the entire scoreboard
 * @param nameStyle the css style for the player names
 * @param scoreStyle the css style for the player scores
 * @returns An HTML string visualizing the scoreboard
 */
const scoreHtmlBuilder = (
  players: RenderablePlayer[],
  scoreboardStyle: string,
  nameStyle: string,
  scoreStyle: string
) => {
  return players.map(({ name, score, tiles }) => {
    return `
            <div style="${scoreboardStyle}">
                <p style="${nameStyle}">${name}</p>
                <p style="${scoreStyle}">${score}</p>
                ${renderTilesInline(tiles)}
            </div>
        `;
  });
};

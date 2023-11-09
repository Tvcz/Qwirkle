import { QTile } from '../../map/tile';
import { RenderablePlayer } from '../../types/gameState.types';

/**
 * Build an html string to display the turn order.
 * Displayed as a list of player ids, where the first id is the active player
 * @param turnOrder A list of the player names in order
 * @returns An HTML string visualizing the turn order
 */
export const turnOrderHtmlBuilder = (players: RenderablePlayer<QTile>[]) => {
  const turnOrderHeader = '<h3>Turn Order: </h3>';
  return `
        <div>
            ${turnOrderHeader}
            [ ${playerIdsHtmlBuilder(players).join('')} ]
        </div>
    `;
};

/**
 * Build an HTML string to display the players names
 * @param playerIds The names of the players
 * @returns An HTML string visualizing the players names
 */
const playerIdsHtmlBuilder = (players: RenderablePlayer<QTile>[]) => {
  const playerIdStyle = ['margin: 0 10px;'].join('');

  return players.map(({ name }) => {
    return `<span style="${playerIdStyle}">${name}</span>`;
  });
};

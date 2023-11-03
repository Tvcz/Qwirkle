/**
 * Build an html string to display the turn order.
 * Displayed as a list of player ids, where the first id is the active player
 * @param turnOrder A list of the player names in order
 * @returns An HTML string visualizing the turn order
 */
export const turnOrderHtmlBuilder = (turnOrder: string[]) => {
  const turnOrderHeader = '<h3>Turn Order: </h3>';
  return `
        <div>
            ${turnOrderHeader}
            [ ${playerIdsHtmlBuilder(turnOrder).join('')} ]
        </div>
    `;
};

/**
 * Build an HTML string to display the players names
 * @param playerIds The names of the players
 * @returns An HTML string visualizing the players names
 */
const playerIdsHtmlBuilder = (playerNames: string[]) => {
  const playerIdStyle = ['margin: 0 10px;'].join('');

  return playerNames.map((name) => {
    return `<span style="${playerIdStyle}">${name}</span>`;
  });
};

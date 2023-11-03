/**
 * Build an html string to display the remaining tiles
 * @param remainingTiles the number of remaining tiles that the referee has
 * @returns An HTML string visualizing the number of remaining tiles
 */
export const remainingTilesHtmlBuilder = (remainingTiles: number) => {
  const remainingTilesHeader = '<h3>Remaining Tiles: </h3>';
  const remainingTilesStyle = ['font-size: 30px;'].join('');
  return `
        <div>
            ${remainingTilesHeader}
            <p style="${remainingTilesStyle}">
                ${remainingTiles}
            </p>
        </div>
    `;
};

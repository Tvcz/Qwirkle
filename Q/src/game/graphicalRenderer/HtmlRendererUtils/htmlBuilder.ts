import { VIEW_BODY_ID } from '../../../constants';
import { QTile } from '../../map/tile';
import { RenderableGameState } from '../../types/gameState.types';
import { mapHtmlBuilder } from './mapHtmlBuilder';
import { remainingTilesHtmlBuilder } from './remainingTilesHtmlBuilder';
import { scoreboardHtmlBuilder } from './scoreboardHtmlBuilder';
import { turnOrderHtmlBuilder } from './turnOrderHtmlBuilder';

/**
 * Create an HTML string that includes a title and body, which is rendered using the game state data
 * @param renderableData The game state data that is publically available to be rendered
 * @returns an HTML string visualizing the game state
 */
export const htmlBuilder = (
  renderableData: RenderableGameState<QTile>
): string => {
  const html = `
<!doctype html>
<html style="height: 100vh;">
    <head>
        <title>Q</title>
    </head>
    ${bodyHtmlBuilder(renderableData)}
</html>
    `;

  return html;
};

/**
 * Build the body with a header, the map state, the scoreboard, the player turn queue, and the number of remaining tiles
 * @param renderableData The game state data that is publically available to be rendered
 * @returns the body of an HTML string visualizing the game state data
 */
const bodyHtmlBuilder = (renderableData: RenderableGameState<QTile>) => {
  const gameHeader = '<h1>Q Game</h1>';
  const gameStateInfoStyle = ['display: flex;', 'column-gap: 50px;'].join('');

  return `
<body id=${VIEW_BODY_ID}>
    ${gameHeader}
    ${mapHtmlBuilder(renderableData.mapState)}
    <div style="${gameStateInfoStyle}">
        ${scoreboardHtmlBuilder(renderableData.scoreboard)}
        ${turnOrderHtmlBuilder(renderableData.turnQueue)}
        ${remainingTilesHtmlBuilder(renderableData.remainingTilesCount)}
    </div>
</body>
    `;
};

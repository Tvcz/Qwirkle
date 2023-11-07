import { QTile, ShapeColorTile } from '../../map/tile';
import { RenderableGameState } from '../../types/gameState.types';
import { mapHtmlBuilder } from './mapHtmlBuilder';
import { remainingTilesHtmlBuilder } from './remainingTilesHtmlBuilder';
import { scoreboardHtmlBuilder } from './scoreboardHtmlBuilder';
import { turnOrderHtmlBuilder } from './turnOrderHtmlBuilder';

/**
 * Build the body with a header, the map state, the scoreboard, the player turn queue, and the number of remaining tiles
 * @param renderableData The game state data that is publically available to be rendered
 * @returns the body of an HTML string visualizing the game state data
 */
export const gameStateHtmlBuilder = (
  renderableData: RenderableGameState<ShapeColorTile>
) => {
  const gameHeader = '<h1>Q Game</h1>';
  const gameStateInfoStyle = ['display: flex;', 'column-gap: 50px;'].join('');

  return `
    ${gameHeader}
    ${mapHtmlBuilder(renderableData.mapState)}
    <div style="${gameStateInfoStyle}">
        ${scoreboardHtmlBuilder(renderableData.players)}
        ${turnOrderHtmlBuilder(renderableData.players)}
        ${remainingTilesHtmlBuilder(renderableData.remainingTiles)}
    </div>
    `;
};

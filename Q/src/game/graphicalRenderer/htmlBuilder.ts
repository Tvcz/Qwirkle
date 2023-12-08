import { RenderableGameState } from '../types/gameState.types';
import { mapHtmlBuilder } from './HtmlRendererUtils/mapHtmlBuilder';
import { remainingTilesHtmlBuilder } from './HtmlRendererUtils/remainingTilesHtmlBuilder';
import { scoreboardHtmlBuilder } from './HtmlRendererUtils/scoreboardHtmlBuilder';

/**
 * Build the game state view view with a header, the map, the players, including
 * their names, scores, and order, and the remaining tiles
 * @param renderableData All the data which represents the current game state
 * @returns the body of an HTML string visualizing the game state data
 */
export const gameStateHtmlBuilder = (renderableData: RenderableGameState) => {
  const gameHeader = '<h1>Q Game</h1>';
  const gameStateInfoStyle = ['display: flex;', 'column-gap: 50px;'].join('');

  return `
    ${gameHeader}
    <span style="${gameStateInfoStyle}">
      <div>
        ${scoreboardHtmlBuilder(renderableData.players)}
        ${remainingTilesHtmlBuilder(renderableData.remainingTiles)}
      </div>
      ${mapHtmlBuilder(renderableData.mapState)}
    </span>
    `;
};

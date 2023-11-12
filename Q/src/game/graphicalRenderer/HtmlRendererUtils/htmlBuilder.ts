import { ShapeColorTile } from '../../map/tile';
import { RenderableGameState } from '../../types/gameState.types';
import { mapHtmlBuilder } from './mapHtmlBuilder';
import { remainingTilesHtmlBuilder } from './remainingTilesHtmlBuilder';
import { scoreboardHtmlBuilder } from './scoreboardHtmlBuilder';

/**
 * Build the game state view view with a header, the map, the players, including
 * their names, scores, and order, and the remaining tiles
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
    <span style="${gameStateInfoStyle}">
      <div>
        ${scoreboardHtmlBuilder(renderableData.players)}
        ${remainingTilesHtmlBuilder(renderableData.remainingTiles)}
      </div>
      ${mapHtmlBuilder(renderableData.mapState)}
    </span>
    `;
};

import { QTile, ShapeColorTile } from '../map/tile';
import { RenderableGameState } from '../types/gameState.types';
import { gameStateHtmlBuilder } from './HtmlRendererUtils/htmlBuilder';

/**
 * Interface for converting a game state into an graphical representation.
 * Provides functionality for taking in the publicly available game state data
 * and converting it into some graphical representation.
 */
export interface GraphicalRenderer {
  /**
   * Converts the publicly available game state data into a string of data that
   * can be rendered by some graphical context. An example is html data that can
   * be rendered by a browser.
   * @param renderableGameState renderable data includes the map (both tile
   * placements and dimensions), the scoreboard, player's turn order, and
   * remaining tiles count
   * @returns a string of some data used for displaying the game state data
   */
  getRenderableString: (
    renderableGameState: RenderableGameState<QTile>
  ) => string;
}

/**
 * An implementation of the QHtmlRenderer that provides a graphical
 * representation of the game state data. getRenderableString method returns an
 * HTML string that displays the given game state data
 */
class HtmlRenderer implements GraphicalRenderer {
  constructor() {}

  public getRenderableString(
    renderableGameState: RenderableGameState<ShapeColorTile>
  ) {
    return gameStateHtmlBuilder(renderableGameState);
  }
}

export default HtmlRenderer;

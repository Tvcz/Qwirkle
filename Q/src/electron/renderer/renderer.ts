import { VIEW_ID } from '../../constants';

/**
 * Sets a handler to take the html from the main process for the game state and
 * update the view.
 */
window.electronAPI.updateViewHandler(
  (_event: Electron.IpcRendererEvent, html: string) => {
    const gameStateView = document.getElementById(VIEW_ID);
    if (gameStateView) {
      gameStateView.innerHTML = html;
    }
  }
);

/**
 * Sets a handler to take the html from the main process for the game state and
 * end game card and update the view.
 */
window.electronAPI.endGameHandler(
  (
    _event: Electron.IpcRendererEvent,
    gameStateHtml: string,
    endGameCardHtml: string
  ) => {
    const gameStateView = document.getElementById(VIEW_ID);
    if (gameStateView) {
      gameStateView.innerHTML = buildEndGameHtml(
        gameStateHtml,
        endGameCardHtml
      );
    }
  }
);

/**
 * Displays the end game card above the current game state.
 */
const buildEndGameHtml = (
  gameStateHtml: string,
  endGameCardHtml: string
): string => {
  return `
    <div id="end-game-card">
      ${endGameCardHtml}
    </div>
    ${gameStateHtml}
  `;
};

/**
 * Sets an event listener for the previous state button to send a message to the
 * main process to go to the previous state.
 */
const previousButton = document.getElementById('previous-state-button');
previousButton?.addEventListener('click', () => {
  window.electronAPI.previousState();
});

/**
 * Sets an event listener for the next state button to send a message to the
 * main process to go to the next state.
 */
const nextButton = document.getElementById('next-state-button');
nextButton?.addEventListener('click', () => {
  window.electronAPI.nextState();
});

/**
 * Sets an event listener for the save state button to send a message to the
 * main process to save the current state.
 */
const saveButton = document.getElementById('save-state-button');
saveButton?.addEventListener('click', () => {
  window.electronAPI.saveState();
});

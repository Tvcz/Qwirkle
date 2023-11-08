import { VIEW_ID } from '../../constants';

window.electronAPI.updateViewHandler(
  (_event: Electron.IpcRendererEvent, html: string) => {
    const gameStateView = document.getElementById(VIEW_ID);
    if (gameStateView) {
      gameStateView.innerHTML = html;
    }
  }
);

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

// display the end game card overlayed on the game state
// TODO: make it actually display in a card overlayed on the game state
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

const previousButton = document.getElementById('previous-state-button');
previousButton?.addEventListener('click', () => {
  window.electronAPI.previousState();
});

const nextButton = document.getElementById('next-state-button');
nextButton?.addEventListener('click', () => {
  window.electronAPI.nextState();
});

const saveButton = document.getElementById('save-state-button');
saveButton?.addEventListener('click', () => {
  // TODO file path dialog
  window.electronAPI.saveState('test.json');
});

import { VIEW_BODY_ID } from '../../constants';

window.electronAPI.updateViewHandler(
  (_event: Electron.IpcRendererEvent, html: string) => {
    const viewBody = document.getElementById(VIEW_BODY_ID);
    if (viewBody) {
      viewBody.innerHTML = html;
    }
  }
);

window.electronAPI.endGameHandler(
  (
    _event: Electron.IpcRendererEvent,
    gameStateHtml: string,
    endGameCardHtml: string
  ) => {
    const viewBody = document.getElementById(VIEW_BODY_ID);
    if (viewBody) {
      viewBody.innerHTML = buildEndGameHtml(gameStateHtml, endGameCardHtml);
    }
  }
);

// display the end game card overlayed on the game state
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

const previousButton = document.getElementById('previous-turn-button');
previousButton?.addEventListener('click', () => {
  window.electronAPI.previousState();
});

const nextButton = document.getElementById('next-turn-button');
nextButton?.addEventListener('click', () => {
  window.electronAPI.nextState();
});

const saveButton = document.getElementById('save-state-button');
saveButton?.addEventListener('click', () => {
  // TODO file path dialog
  window.electronAPI.saveState('test.json');
});

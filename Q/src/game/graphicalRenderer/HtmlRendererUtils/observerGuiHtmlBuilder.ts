export const observerGuiHtmlBuilder = (gameStateHtml: string) => {
  return `
        <div>
            ${gameStateHtml}
            <span>
                <button id="previous-state-button">Previous State</button>
                <button id="next-state-button">Next State</button>
                <button id="save-state-button">Save State</button>
            </span>
        </div>
    `;
};

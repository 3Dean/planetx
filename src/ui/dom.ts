export type AppDom = {
  viewport: HTMLDivElement;
  introFade: HTMLDivElement;
  loadingLabel: HTMLParagraphElement;
  loadingBar: HTMLDivElement;
  errorLabel: HTMLParagraphElement;
  caption: HTMLParagraphElement;
  audioButton: HTMLButtonElement;
  audioElement: HTMLAudioElement;
};

export function createAppDom(root: HTMLElement): AppDom {
  root.innerHTML = `
    <div class="app-shell">
      <div id="viewport" class="viewport"></div>

      <div id="intro-fade" class="intro-fade"></div>

      <div class="loading-panel" aria-live="polite">
        <p id="loading-label" class="loading-label">Loading scene...</p>
        <div class="loading-track"><div id="loading-bar" class="loading-bar"></div></div>
      </div>

      <p id="error-label" class="error-label" role="alert" hidden></p>
      <p id="caption" class="caption" aria-live="polite"></p>

      <button id="audio-button" class="audio-btn" type="button" aria-pressed="false" data-playing="false">
        <svg class="icon icon-play" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M8 5v14l11-7z"></path>
        </svg>
        <svg class="icon icon-pause" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M6 5h4v14H6zM14 5h4v14h-4z"></path>
        </svg>
      </button>

      <audio id="audio-element" preload="none"></audio>
    </div>
  `;

  return {
    viewport: elementById<HTMLDivElement>('viewport'),
    introFade: elementById<HTMLDivElement>('intro-fade'),
    loadingLabel: elementById<HTMLParagraphElement>('loading-label'),
    loadingBar: elementById<HTMLDivElement>('loading-bar'),
    errorLabel: elementById<HTMLParagraphElement>('error-label'),
    caption: elementById<HTMLParagraphElement>('caption'),
    audioButton: elementById<HTMLButtonElement>('audio-button'),
    audioElement: elementById<HTMLAudioElement>('audio-element')
  };
}

function elementById<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Missing required element: #${id}`);
  }

  return element as T;
}

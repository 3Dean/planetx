import {
  AUDIO_STATIONS,
  NARRATIVE_FADE_MS,
  NARRATIVE_HOLD_MS,
  NARRATIVE_LINES,
  NARRATIVE_SCHEDULE_MS
} from './config/constants';
import { PlanetXScene } from './scene/planetxScene';
import { StreamingAudioController } from './systems/audioPlayer';
import { NarrativeTimeline } from './systems/timeline';
import { createAppDom } from './ui/dom';
import './styles.css';

const appRoot = document.getElementById('app');
if (!appRoot) {
  throw new Error('Missing #app root element.');
}

const dom = createAppDom(appRoot);

const scene = new PlanetXScene(dom.viewport, {
  onProgress(loaded, total) {
    const pct = total > 0 ? Math.round((loaded / total) * 100) : 0;
    dom.loadingLabel.textContent = `Loading scene... ${pct}%`;
    dom.loadingBar.style.width = `${pct}%`;
  },
  onReady() {
    dom.loadingLabel.textContent = 'Scene ready';
    dom.loadingBar.style.width = '100%';
    dom.introFade.classList.add('fade-out');

    window.setTimeout(() => {
      dom.introFade.remove();
      dom.loadingLabel.parentElement?.remove();
    }, 2100);

    timeline.start();
  },
  onError(message) {
    dom.errorLabel.hidden = false;
    dom.errorLabel.textContent = message;
  }
});

const timeline = new NarrativeTimeline(
  dom.caption,
  NARRATIVE_LINES,
  NARRATIVE_SCHEDULE_MS,
  NARRATIVE_HOLD_MS,
  NARRATIVE_FADE_MS
);

const audioController = new StreamingAudioController(dom.audioButton, dom.audioElement, AUDIO_STATIONS);
audioController.init();

void scene.start();

window.addEventListener('beforeunload', () => {
  timeline.stop();
  scene.dispose();
});

type Station = {
  name: string;
  url: string;
};

export class StreamingAudioController {
  private currentIndex = 0;
  private triedFallback = false;

  constructor(
    private readonly button: HTMLButtonElement,
    private readonly audio: HTMLAudioElement,
    private readonly stations: Station[]
  ) {}

  init(): void {
    this.audio.crossOrigin = 'anonymous';
    this.audio.loop = false;

    this.setStation(0);
    this.updateUi();

    this.button.addEventListener('click', () => {
      void this.toggle();
    });

    this.audio.addEventListener('playing', () => this.updateUi());
    this.audio.addEventListener('pause', () => this.updateUi());
    this.audio.addEventListener('ended', () => {
      this.updateUi();
      void this.audio.play().catch(() => undefined);
    });

    this.audio.addEventListener('error', () => {
      if (!this.triedFallback) {
        this.triedFallback = true;
        const fallbackIndex = (this.currentIndex + 1) % this.stations.length;
        this.setStation(fallbackIndex);
        void this.audio.play().catch(() => undefined);
      }
    });
  }

  private async toggle(): Promise<void> {
    if (this.audio.paused) {
      await this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  private setStation(index: number): void {
    this.currentIndex = index;
    this.audio.src = this.stations[index].url;
    this.updateUi();
  }

  private updateUi(): void {
    const playing = !this.audio.paused && !this.audio.ended && this.audio.currentTime > 0;

    this.button.dataset.playing = playing ? 'true' : 'false';
    this.button.setAttribute('aria-pressed', playing ? 'true' : 'false');

    const action = playing ? 'Pause' : 'Play';
    const label = `${action} ${this.stations[this.currentIndex].name}`;
    this.button.setAttribute('aria-label', label);
    this.button.setAttribute('title', label);
  }
}

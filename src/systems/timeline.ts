export class NarrativeTimeline {
  private readonly timeoutIds: number[] = [];

  constructor(
    private readonly captionEl: HTMLElement,
    private readonly lines: string[],
    private readonly schedule: number[],
    private readonly holdMs: number,
    private readonly fadeMs: number
  ) {}

  start(): void {
    this.stop();

    this.lines.forEach((line, index) => {
      const atMs = this.schedule[index] ?? 0;
      this.timeoutIds.push(
        window.setTimeout(() => {
          this.showLine(line);
          this.timeoutIds.push(window.setTimeout(() => this.hideLine(), this.holdMs));
          this.timeoutIds.push(
            window.setTimeout(() => this.captionEl.classList.add('is-hidden'), this.holdMs + this.fadeMs)
          );
        }, atMs)
      );
    });
  }

  stop(): void {
    while (this.timeoutIds.length > 0) {
      const id = this.timeoutIds.pop();
      if (id !== undefined) {
        window.clearTimeout(id);
      }
    }

    this.hideLine();
  }

  private showLine(line: string): void {
    this.captionEl.textContent = line;
    this.captionEl.classList.remove('is-hidden');
  }

  private hideLine(): void {
    this.captionEl.classList.add('is-hidden');
  }
}

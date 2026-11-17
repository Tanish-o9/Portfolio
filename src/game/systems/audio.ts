import { Howl } from 'howler';

export class AudioManager {
  private isMuted: boolean = true;
  private sounds: Map<string, Howl> = new Map();

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public play(name: string): void {
    if (this.isMuted) return;
    const sound = this.sounds.get(name);
    sound?.play();
  }
}

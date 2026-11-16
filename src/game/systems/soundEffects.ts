import { useGameStore } from '../../state/gameStore';

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  private isMusicPlaying = false;
  private musicInterval: number | null = null;
  private masterGain: GainNode | null = null;

  private getContext(): AudioContext | null {
    if (useGameStore.getState().muted) return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play gentle UI click
  public playClick(): void {
    const ctx = this.getContext();
    if (!ctx || !this.masterGain) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(720, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }

  // Play building entrance / modal open chime
  public playEnter(): void {
    const ctx = this.getContext();
    const master = this.masterGain;
    if (!ctx || !master) return;
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.06, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.2);

      osc.connect(gain);
      gain.connect(master);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.2);
    });
  }

  // Play dialogue blip
  public playDialogueBlip(): void {
    const ctx = this.getContext();
    if (!ctx || !this.masterGain) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320 + Math.random() * 80, ctx.currentTime);

    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  }

  // Footstep sound throttled
  private lastFootstep = 0;
  public playFootstep(): void {
    const now = Date.now();
    if (now - this.lastFootstep < 260) return;
    this.lastFootstep = now;

    const ctx = this.getContext();
    if (!ctx || !this.masterGain) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110 + Math.random() * 20, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  }

  // Cozy Lo-Fi Ambient Music Loop
  public startMusic(): void {
    if (this.isMusicPlaying) return;
    const ctx = this.getContext();
    if (!ctx || !this.masterGain) return;

    this.isMusicPlaying = true;

    // Pentatonic cozy notes: C4, D4, E4, G4, A4, C5, D5, E5
    const scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];
    let step = 0;

    const chords = [
      [261.63, 329.63, 392.0], // C
      [220.0, 261.63, 329.63], // Am
      [174.61, 220.0, 261.63], // F
      [196.0, 246.94, 293.66], // G
    ];

    this.musicInterval = window.setInterval(() => {
      if (useGameStore.getState().muted) return;
      const c = this.getContext();
      const master = this.masterGain;
      if (!c || !master) return;

      const chordIdx = Math.floor(step / 4) % chords.length;
      const currentChord = chords[chordIdx];

      // Play soft bass pad
      if (step % 4 === 0) {
        const bassOsc = c.createOscillator();
        const bassGain = c.createGain();
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(currentChord[0] / 2, c.currentTime);
        bassGain.gain.setValueAtTime(0.03, c.currentTime);
        bassGain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 1.2);
        bassOsc.connect(bassGain);
        bassGain.connect(master);
        bassOsc.start();
        bassOsc.stop(c.currentTime + 1.2);
      }

      // Play melody note
      const note = scale[Math.floor(Math.random() * scale.length)];
      const melOsc = c.createOscillator();
      const melGain = c.createGain();
      melOsc.type = 'sine';
      melOsc.frequency.setValueAtTime(note, c.currentTime);
      melGain.gain.setValueAtTime(0.02, c.currentTime);
      melGain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.35);

      melOsc.connect(melGain);
      melGain.connect(master);
      melOsc.start();
      melOsc.stop(c.currentTime + 0.35);

      step++;
    }, 450);
  }

  public stopMusic(): void {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.isMusicPlaying = false;
  }
}

export const soundEffects = new SoundEffectsManager();

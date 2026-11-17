import { useGameStore } from '../../state/gameStore';

export const JUKEBOX_TRACKS = [
  { name: 'AKGEC Midnight Code', mood: 'Chill Lo-Fi' },
  { name: 'QUANTORA Tensor Chill', mood: 'Cyber Groove' },
  { name: 'Village Morning Coffee', mood: 'Acoustic Cozy' },
];

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

  // Magical fanfare for quest completion
  public playQuestSuccess(): void {
    const ctx = this.getContext();
    const master = this.masterGain;
    if (!ctx || !master) return;
    const now = ctx.currentTime;
    [440, 554.37, 659.25, 880].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.08, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(master);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.35);
    });
  }

  // Sparkling harp arpeggio for secret treasure chests
  public playChestChime(): void {
    const ctx = this.getContext();
    const master = this.masterGain;
    if (!ctx || !master) return;
    const now = ctx.currentTime;
    [440, 554.37, 659.25, 880, 1108.73, 1318.51].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.08, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.35);

      osc.connect(gain);
      gain.connect(master);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.35);
    });
  }

  // Cozy Lo-Fi Procedural Jukebox Tracks
  public static TRACKS = [
    { name: 'AKGEC Midnight Code', mood: 'Chill Lo-Fi' },
    { name: 'QUANTORA Tensor Chill', mood: 'Cyber Groove' },
    { name: 'Village Morning Coffee', mood: 'Acoustic Cozy' },
  ];

  public startMusic(trackIndex?: number): void {
    if (this.isMusicPlaying && trackIndex === undefined) return;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }

    const ctx = this.getContext();
    if (!ctx || !this.masterGain) return;

    this.isMusicPlaying = true;
    let step = 0;

    const track = trackIndex ?? useGameStore.getState().currentTrack;

    // Different scales and chords per track
    const trackConfigs = [
      {
        // AKGEC Midnight Code (A minor chill)
        scale: [220.0, 261.63, 293.66, 329.63, 392.0, 440.0, 523.25],
        chords: [
          [220.0, 261.63, 329.63], // Am
          [174.61, 220.0, 261.63], // F
          [261.63, 329.63, 392.0], // C
          [196.0, 246.94, 293.66], // G
        ],
        speed: 460,
      },
      {
        // QUANTORA Tensor Chill (D minor cyber groove)
        scale: [293.66, 349.23, 392.0, 440.0, 523.25, 587.33],
        chords: [
          [293.66, 349.23, 440.0], // Dm
          [233.08, 293.66, 349.23], // Bb
          [174.61, 220.0, 261.63], // F
          [261.63, 329.63, 392.0], // C
        ],
        speed: 400,
      },
      {
        // Village Morning Coffee (C major sunny)
        scale: [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 659.25],
        chords: [
          [261.63, 329.63, 392.0], // C
          [329.63, 392.0, 493.88], // Em
          [174.61, 220.0, 261.63], // F
          [196.0, 246.94, 293.66], // G
        ],
        speed: 500,
      },
    ];

    const currentConfig = trackConfigs[track % trackConfigs.length];

    this.musicInterval = window.setInterval(() => {
      if (useGameStore.getState().muted) return;
      const c = this.getContext();
      const master = this.masterGain;
      if (!c || !master) return;

      const chordIdx = Math.floor(step / 4) % currentConfig.chords.length;
      const currentChord = currentConfig.chords[chordIdx];

      // Bass note
      if (step % 4 === 0) {
        const bassOsc = c.createOscillator();
        const bassGain = c.createGain();
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(currentChord[0] / 2, c.currentTime);
        bassGain.gain.setValueAtTime(0.035, c.currentTime);
        bassGain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 1.2);
        bassOsc.connect(bassGain);
        bassGain.connect(master);
        bassOsc.start();
        bassOsc.stop(c.currentTime + 1.2);
      }

      // Melody note
      const note = currentConfig.scale[Math.floor(Math.random() * currentConfig.scale.length)];
      const melOsc = c.createOscillator();
      const melGain = c.createGain();
      melOsc.type = 'sine';
      melOsc.frequency.setValueAtTime(note, c.currentTime);
      melGain.gain.setValueAtTime(0.025, c.currentTime);
      melGain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.35);

      melOsc.connect(melGain);
      melGain.connect(master);
      melOsc.start();
      melOsc.stop(c.currentTime + 0.35);

      step++;
    }, currentConfig.speed);
  }

  public changeTrack(trackIndex: number): void {
    this.startMusic(trackIndex);
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

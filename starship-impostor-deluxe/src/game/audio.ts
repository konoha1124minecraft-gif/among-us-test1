class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private bgmTimer: number | null = null;
  private bgmVolume = 0.25;
  private sfxVolume = 0.45;
  private bgmMuted = false;
  private sfxMuted = false;
  private bgmMode: "idle" | "playing" | "meeting" = "idle";
  private stepIdx = 0;

  private ensureContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
      this.bgmGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();
      this.bgmGain.gain.value = this.bgmMuted ? 0 : this.bgmVolume;
      this.sfxGain.gain.value = this.sfxMuted ? 0 : this.sfxVolume;
      this.bgmGain.connect(this.ctx.destination);
      this.sfxGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      void this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public unlock(): void {
    this.ensureContext();
  }

  public setVolumes(bgmVol: number, sfxVol: number, bgmMuted: boolean, sfxMuted: boolean): void {
    this.bgmVolume = Math.max(0, Math.min(1, bgmVol));
    this.sfxVolume = Math.max(0, Math.min(1, sfxVol));
    this.bgmMuted = bgmMuted;
    this.sfxMuted = sfxMuted;
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setTargetAtTime(bgmMuted ? 0 : this.bgmVolume, this.ctx.currentTime, 0.05);
    }
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setTargetAtTime(sfxMuted ? 0 : this.sfxVolume, this.ctx.currentTime, 0.05);
    }
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = "sine",
    gainLevel = 0.2,
    slideToFreq?: number,
    channel: "sfx" | "bgm" = "sfx"
  ): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const dest = channel === "bgm" ? this.bgmGain : this.sfxGain;
    if (!dest) return;
    if (channel === "sfx" && (this.sfxMuted || this.sfxVolume <= 0)) return;
    if (channel === "bgm" && (this.bgmMuted || this.bgmVolume <= 0)) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideToFreq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideToFreq), now + duration);
    }
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(Math.max(0.001, gainLevel), now + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(g);
    g.connect(dest);
    osc.start(now);
    osc.stop(now + duration + 0.03);
  }

  public startBgm(mode: "idle" | "playing" | "meeting"): void {
    this.bgmMode = mode;
    if (this.bgmTimer !== null) return;
    if (typeof window === "undefined") return;
    const notesPlaying = [110, 130.81, 146.83, 164.81, 146.83, 130.81, 98, 123.47];
    const notesMeeting = [146.83, 174.61, 196.0, 220.0, 196.0, 174.61];
    this.bgmTimer = window.setInterval(() => {
      if (this.bgmMuted || this.bgmVolume <= 0) return;
      if (this.bgmMode === "idle") {
        if (this.stepIdx % 4 === 0) {
          this.playTone(92.5, 0.85, "sine", 0.09, undefined, "bgm");
        }
      } else if (this.bgmMode === "playing") {
        const f = notesPlaying[this.stepIdx % notesPlaying.length];
        this.playTone(f, 0.36, "triangle", 0.11, undefined, "bgm");
      } else {
        const f = notesMeeting[this.stepIdx % notesMeeting.length];
        this.playTone(f, 0.24, "sawtooth", 0.07, undefined, "bgm");
      }
      this.stepIdx += 1;
    }, 480);
  }

  public stopBgm(): void {
    if (this.bgmTimer !== null && typeof window !== "undefined") {
      window.clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  public playStep(): void {
    this.playTone(135 + Math.random() * 25, 0.045, "triangle", 0.07, 85);
  }

  public playClick(): void {
    this.playTone(620, 0.06, "sine", 0.12, 860);
  }

  public playTaskOk(): void {
    this.playTone(523.25, 0.11, "triangle", 0.18);
    setTimeout(() => this.playTone(659.25, 0.12, "triangle", 0.18), 90);
    setTimeout(() => this.playTone(783.99, 0.2, "triangle", 0.2), 180);
  }

  public playError(): void {
    this.playTone(190, 0.18, "sawtooth", 0.18, 110);
  }

  public playKill(): void {
    this.playTone(220, 0.28, "sawtooth", 0.28, 55);
    setTimeout(() => this.playTone(95, 0.22, "square", 0.22, 42), 70);
  }

  public playReport(): void {
    this.playTone(580, 0.22, "sawtooth", 0.26, 440);
    setTimeout(() => this.playTone(740, 0.32, "sawtooth", 0.26, 520), 180);
  }

  public playSabotage(): void {
    this.playTone(340, 0.35, "square", 0.16, 220);
  }

  public playVent(): void {
    this.playTone(260, 0.15, "triangle", 0.16, 120);
  }

  public playVictory(): void {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      setTimeout(() => this.playTone(f, 0.22, "triangle", 0.2), i * 110);
    });
  }

  public playDefeat(): void {
    [330, 293.66, 246.94, 196].forEach((f, i) => {
      setTimeout(() => this.playTone(f, 0.26, "sawtooth", 0.18), i * 140);
    });
  }

  public playPurchase(): void {
    this.playTone(880, 0.08, "sine", 0.2);
    setTimeout(() => this.playTone(1318.5, 0.16, "triangle", 0.22), 75);
  }

  public playUnlock(): void {
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => {
      setTimeout(() => this.playTone(f, 0.16, "triangle", 0.2), i * 70);
    });
  }

  public playCutIn(): void {
    this.playTone(110, 0.45, "sawtooth", 0.34, 42);
    setTimeout(() => this.playTone(880, 0.14, "sawtooth", 0.25, 220), 60);
    setTimeout(() => this.playTone(145, 0.35, "square", 0.26, 48), 160);
  }
}

export const soundEngine = new SoundEngine();

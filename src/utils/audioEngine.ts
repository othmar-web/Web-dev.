// Web Audio API Synthesizer and Audio Engine for SoundWave Premium Hi-Fi

class SoundWaveAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private filterNode: BiquadFilterNode | null = null;
  private isPlaying: boolean = false;
  private volume: number = 0.8;
  private chordInterval: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.85;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(1400, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(2.5, this.ctx.currentTime);

      this.filterNode.connect(this.masterGain);
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playTrack(frequencies: number[] = [220, 261.63, 329.63, 392]) {
    try {
      this.initContext();
      this.stop();

      if (!this.ctx || !this.filterNode) return;

      this.isPlaying = true;
      const now = this.ctx.currentTime;

      // Start lush polyphonic synth chord
      frequencies.forEach((freq, idx) => {
        if (!this.ctx || !this.filterNode) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        osc.type = idx === 0 ? 'triangle' : idx % 2 === 0 ? 'sine' : 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);

        // Soft attack envelope
        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.linearRampToValueAtTime(0.12 / Math.sqrt(frequencies.length), now + 0.4);

        osc.connect(noteGain);
        noteGain.connect(this.filterNode);

        osc.start(now);
        this.oscillators.push(osc);
      });

      // Sub-bass rhythmic pulse
      const baseFreq = frequencies[0] / 2;
      let pulseCount = 0;
      this.chordInterval = window.setInterval(() => {
        if (!this.ctx || !this.isPlaying || !this.filterNode) return;
        try {
          const beatTime = this.ctx.currentTime;
          const bassOsc = this.ctx.createOscillator();
          const bassGain = this.ctx.createGain();

          bassOsc.type = 'triangle';
          // slight melodic variation
          const noteStep = (pulseCount % 4 === 3) ? 1.25 : (pulseCount % 4 === 2) ? 1.125 : 1;
          bassOsc.frequency.setValueAtTime(baseFreq * noteStep, beatTime);

          bassGain.gain.setValueAtTime(0.2, beatTime);
          bassGain.gain.exponentialRampToValueAtTime(0.001, beatTime + 0.55);

          bassOsc.connect(bassGain);
          bassGain.connect(this.filterNode);

          bassOsc.start(beatTime);
          bassOsc.stop(beatTime + 0.6);
          pulseCount++;
        } catch {
          // ignore context cleanup
        }
      }, 550);
    } catch {
      // AudioContext could be blocked until user gesture
    }
  }

  public pause() {
    this.stop();
  }

  public resume(frequencies?: number[]) {
    this.playTrack(frequencies);
  }

  public stop() {
    this.isPlaying = false;
    if (this.chordInterval !== null) {
      clearInterval(this.chordInterval);
      this.chordInterval = null;
    }
    this.oscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Already stopped
      }
    });
    this.oscillators = [];
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVisualizerData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array(16);
    }
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }
}

export const audioEngine = new SoundWaveAudioEngine();

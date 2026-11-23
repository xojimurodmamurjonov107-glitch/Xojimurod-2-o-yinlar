/**
 * Brain Arena - Web Audio API Sound Synthesizer
 * Generates all sound effects dynamically without external audio assets.
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.volume = 0.5;
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
                this.isInitialized = true;
            }
        } catch (e) {
            console.warn('Web Audio API not supported or blocked:', e);
        }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }

    setMuted(state) {
        this.muted = !!state;
    }

    setVolume(val) {
        this.volume = Math.max(0, Math.min(1, val));
    }

    play(name) {
        if (this.muted) return;
        this.init();
        this.resume();
        if (!this.ctx) return;

        try {
            switch (name) {
                case 'click':
                    this.playClick();
                    break;
                case 'correct':
                    this.playCorrect();
                    break;
                case 'wrong':
                    this.playWrong();
                    break;
                case 'win':
                    this.playWin();
                    break;
                case 'lose':
                    this.playLose();
                    break;
                case 'levelUp':
                    this.playLevelUp();
                    break;
                case 'cardFlip':
                    this.playCardFlip();
                    break;
                case 'match':
                    this.playMatch();
                    break;
                case 'move':
                    this.playMove();
                    break;
                case 'tick':
                    this.playTick();
                    break;
                case 'hint':
                    this.playHint();
                    break;
                case 'powerup':
                    this.playPowerup();
                    break;
                case 'pop':
                    this.playPop();
                    break;
                case 'laser':
                    this.playLaser();
                    break;
                default:
                    this.playClick();
            }
        } catch (e) {
            console.error('Audio playback error:', e);
        }
    }

    playClick() {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

        gain.gain.setValueAtTime(0.15 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
    }

    playPop() {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

        gain.gain.setValueAtTime(0.3 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.08);
    }

    playCorrect() {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const startTime = this.ctx.currentTime + idx * 0.08;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0.2 * this.volume, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.25);
        });
    }

    playWrong() {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now); // A3
        osc.frequency.linearRampToValueAtTime(140, now + 0.25);

        gain.gain.setValueAtTime(0.25 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
    }

    playMatch() {
        const notes = [659.25, 880, 1318.51]; // E5, A5, E6
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const startTime = this.ctx.currentTime + idx * 0.07;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0.25 * this.volume, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.3);
        });
    }

    playCardFlip() {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(700, now + 0.06);

        gain.gain.setValueAtTime(0.15 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.06);
    }

    playMove() {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.05);

        gain.gain.setValueAtTime(0.2 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
    }

    playTick() {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, now);

        gain.gain.setValueAtTime(0.1 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.02);
    }

    playHint() {
        const notes = [880, 1174.66, 1760]; // A5, D6, A6
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const startTime = this.ctx.currentTime + idx * 0.1;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0.15 * this.volume, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.35);
        });
    }

    playPowerup() {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.3);

        gain.gain.setValueAtTime(0.2 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.35);
    }

    playWin() {
        const notes = [
            { f: 523.25, d: 0.15 }, // C5
            { f: 659.25, d: 0.15 }, // E5
            { f: 783.99, d: 0.15 }, // G5
            { f: 1046.50, d: 0.45 } // C6
        ];
        let delay = 0;
        notes.forEach((note) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const startTime = this.ctx.currentTime + delay;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(note.f, startTime);

            gain.gain.setValueAtTime(0.3 * this.volume, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + note.d);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + note.d);
            delay += 0.14;
        });
    }

    playLose() {
        const notes = [
            { f: 587.33, d: 0.2 }, // D5
            { f: 523.25, d: 0.2 }, // C5
            { f: 466.16, d: 0.2 }, // Bb4
            { f: 415.30, d: 0.4 }  // Ab4
        ];
        let delay = 0;
        notes.forEach((note) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const startTime = this.ctx.currentTime + delay;

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(note.f, startTime);

            gain.gain.setValueAtTime(0.2 * this.volume, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + note.d);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + note.d);
            delay += 0.18;
        });
    }

    playLevelUp() {
        const freqs = [440, 554.37, 659.25, 880, 1108.73, 1318.51, 1760];
        freqs.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const startTime = this.ctx.currentTime + idx * 0.08;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0.25 * this.volume, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.3);
        });
    }

    playLaser() {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1500, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.15);

        gain.gain.setValueAtTime(0.2 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.15);
    }

    /**
     * Synthesizes audio mimicking animal sounds for the Animal Sounds game!
     */
    playAnimal(type) {
        if (this.muted) return;
        this.init();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        try {
            switch (type) {
                case 'cow': { // Low 'Moooo'
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(130, now);
                    osc.frequency.linearRampToValueAtTime(120, now + 0.8);
                    gain.gain.setValueAtTime(0.3 * this.volume, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(now);
                    osc.stop(now + 0.8);
                    break;
                }
                case 'dog': { // Bark 'Woof woof'
                    [0, 0.2].forEach(offset => {
                        const osc = this.ctx.createOscillator();
                        const gain = this.ctx.createGain();
                        const t = now + offset;
                        osc.type = 'triangle';
                        osc.frequency.setValueAtTime(350, t);
                        osc.frequency.exponentialRampToValueAtTime(180, t + 0.12);
                        gain.gain.setValueAtTime(0.4 * this.volume, t);
                        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
                        osc.connect(gain);
                        gain.connect(this.ctx.destination);
                        osc.start(t);
                        osc.stop(t + 0.12);
                    });
                    break;
                }
                case 'cat': { // Meow
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(500, now);
                    osc.frequency.linearRampToValueAtTime(750, now + 0.3);
                    osc.frequency.linearRampToValueAtTime(450, now + 0.7);
                    gain.gain.setValueAtTime(0.25 * this.volume, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(now);
                    osc.stop(now + 0.7);
                    break;
                }
                case 'duck': { // Quack
                    [0, 0.22].forEach(offset => {
                        const osc = this.ctx.createOscillator();
                        const gain = this.ctx.createGain();
                        const t = now + offset;
                        osc.type = 'sawtooth';
                        osc.frequency.setValueAtTime(320, t);
                        osc.frequency.linearRampToValueAtTime(260, t + 0.15);
                        gain.gain.setValueAtTime(0.3 * this.volume, t);
                        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
                        osc.connect(gain);
                        gain.connect(this.ctx.destination);
                        osc.start(t);
                        osc.stop(t + 0.15);
                    });
                    break;
                }
                case 'bird': { // Chirp
                    [0, 0.1, 0.2].forEach(offset => {
                        const osc = this.ctx.createOscillator();
                        const gain = this.ctx.createGain();
                        const t = now + offset;
                        osc.type = 'sine';
                        osc.frequency.setValueAtTime(1800, t);
                        osc.frequency.exponentialRampToValueAtTime(2600, t + 0.06);
                        gain.gain.setValueAtTime(0.25 * this.volume, t);
                        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.06);
                        osc.connect(gain);
                        gain.connect(this.ctx.destination);
                        osc.start(t);
                        osc.stop(t + 0.06);
                    });
                    break;
                }
                case 'frog': { // Ribbit
                    [0, 0.18].forEach(offset => {
                        const osc = this.ctx.createOscillator();
                        const gain = this.ctx.createGain();
                        const t = now + offset;
                        osc.type = 'sawtooth';
                        osc.frequency.setValueAtTime(140, t);
                        osc.frequency.linearRampToValueAtTime(100, t + 0.12);
                        gain.gain.setValueAtTime(0.35 * this.volume, t);
                        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
                        osc.connect(gain);
                        gain.connect(this.ctx.destination);
                        osc.start(t);
                        osc.stop(t + 0.12);
                    });
                    break;
                }
                case 'lion': { // Roar
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(120, now);
                    osc.frequency.linearRampToValueAtTime(70, now + 0.6);
                    gain.gain.setValueAtTime(0.4 * this.volume, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(now);
                    osc.stop(now + 0.6);
                    break;
                }
                default:
                    this.playCorrect();
            }
        } catch (e) {
            console.error('Animal sound error:', e);
        }
    }
}

// Global singleton instance
window.soundEngine = new SoundEngine();

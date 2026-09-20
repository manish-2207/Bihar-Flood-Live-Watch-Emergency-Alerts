/**
 * Web Audio API based emergency siren and chime generator
 * Works without relying on external mp3 files that might fail to load.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playUrgentAlertSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Dual-tone disaster warning beep (800Hz / 1000Hz)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sine';

    // Frequency sweep
    osc1.frequency.setValueAtTime(750, now);
    osc1.frequency.exponentialRampToValueAtTime(1050, now + 0.25);
    osc1.frequency.exponentialRampToValueAtTime(750, now + 0.5);
    osc1.frequency.exponentialRampToValueAtTime(1050, now + 0.75);

    osc2.frequency.setValueAtTime(850, now);
    osc2.frequency.exponentialRampToValueAtTime(1150, now + 0.25);
    osc2.frequency.exponentialRampToValueAtTime(850, now + 0.5);
    osc2.frequency.exponentialRampToValueAtTime(1150, now + 0.75);

    // Volume envelope
    gainNode.gain.setValueAtTime(0.01, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.85);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.85);
    osc2.stop(now + 0.85);
  } catch (e) {
    console.warn('Audio alert could not be played:', e);
  }
}

export function playGentlePing(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  } catch (e) {
    console.warn('Audio ping could not be played:', e);
  }
}

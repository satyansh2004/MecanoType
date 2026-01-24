/**
 * @fileoverview Audio module for MecanoType
 * Generates realistic typewriter sounds using Web Audio API
 */

// ===================================
// Audio State
// ===================================

/**
 * Audio state and context
 * @type {Object}
 */
export const audio = {
    soundEnabled: true,
    audioCtx: null,
    noiseBuffer: null,
};

// ===================================
// Initialization
// ===================================

/**
 * Initialize the Web Audio API context and noise buffer
 * Must be called after a user interaction (click/keypress)
 */
export function initAudio() {
    if (audio.audioCtx) return;
    
    try {
        audio.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create noise buffer for mechanical sounds
        const bufferSize = audio.audioCtx.sampleRate * 2;
        audio.noiseBuffer = audio.audioCtx.createBuffer(1, bufferSize, audio.audioCtx.sampleRate);
        const data = audio.noiseBuffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
    } catch (error) {
        console.warn('Failed to initialize audio:', error);
        audio.soundEnabled = false;
    }
}

// ===================================
// Sound Effects
// ===================================

/**
 * Play a typewriter sound effect
 * @param {string} type - Sound type: 'click', 'error', or 'tear'
 */
export function playSound(type) {
    if (!audio.soundEnabled || !audio.audioCtx) return;
    
    // Resume audio context if suspended (browser autoplay policy)
    if (audio.audioCtx.state === 'suspended') {
        audio.audioCtx.resume().catch(() => {});
    }

    const t = audio.audioCtx.currentTime;

    switch (type) {
        case 'click':
            playClickSound(t);
            break;
        case 'error':
            playErrorSound(t);
            break;
        case 'tear':
            playTearSound(t);
            break;
    }
}

/**
 * Play typewriter key click sound
 * @param {number} t - Audio context current time
 */
function playClickSound(t) {
    const ctx = audio.audioCtx;
    
    // Impact component
    const impact = ctx.createBufferSource();
    impact.buffer = audio.noiseBuffer;
    const impactFilter = ctx.createBiquadFilter();
    impactFilter.type = 'lowpass';
    impactFilter.frequency.value = 800;
    const impactGain = ctx.createGain();
    
    impact.connect(impactFilter);
    impactFilter.connect(impactGain);
    impactGain.connect(ctx.destination);
    
    impact.start(t, Math.random() * 1.0);
    impactGain.gain.setValueAtTime(0.8, t);
    impactGain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
    impact.stop(t + 0.06);

    // Body/resonance component
    const body = ctx.createOscillator();
    body.type = 'triangle';
    body.frequency.setValueAtTime(150 + Math.random() * 30, t); 
    body.frequency.exponentialRampToValueAtTime(40, t + 0.08);
    const bodyGain = ctx.createGain();
    
    body.connect(bodyGain);
    bodyGain.connect(ctx.destination);
    
    bodyGain.gain.setValueAtTime(0.5, t);
    bodyGain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
    
    body.start(t);
    body.stop(t + 0.1);

    // Texture/mechanical component
    const texture = ctx.createBufferSource();
    texture.buffer = audio.noiseBuffer;
    const textureFilter = ctx.createBiquadFilter();
    textureFilter.type = 'bandpass';
    textureFilter.frequency.value = 400;
    textureFilter.Q.value = 1;
    const textureGain = ctx.createGain();
    
    texture.connect(textureFilter);
    textureFilter.connect(textureGain);
    textureGain.connect(ctx.destination);
    
    texture.start(t, Math.random() * 1.0);
    textureGain.gain.setValueAtTime(0.4, t);
    textureGain.gain.exponentialRampToValueAtTime(0.01, t + 0.04);
    texture.stop(t + 0.05);
}

/**
 * Play error/wrong key sound
 * @param {number} t - Audio context current time
 */
function playErrorSound(t) {
    const ctx = audio.audioCtx;
    
    // Low thud
    const thud = ctx.createOscillator();
    thud.type = 'sine';
    thud.frequency.setValueAtTime(150, t);
    thud.frequency.exponentialRampToValueAtTime(50, t + 0.2);
    
    const thudGain = ctx.createGain();
    thudGain.gain.setValueAtTime(2.0, t);
    thudGain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
    
    thud.connect(thudGain);
    thudGain.connect(ctx.destination);
    
    thud.start(t);
    thud.stop(t + 0.2);
    
    // Noise component
    const noise = ctx.createBufferSource();
    noise.buffer = audio.noiseBuffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 300;
    const noiseGain = ctx.createGain();
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    
    noise.start(t, Math.random());
    noiseGain.gain.setValueAtTime(2.5, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
    noise.stop(t + 0.2);
}

/**
 * Play paper tear/slide sound
 * @param {number} t - Audio context current time
 */
function playTearSound(t) {
    const ctx = audio.audioCtx;
    const duration = 0.55;
    
    const slide = ctx.createBufferSource();
    slide.buffer = audio.noiseBuffer;
    
    const slideFilter = ctx.createBiquadFilter();
    slideFilter.type = 'lowpass';
    slideFilter.Q.value = 0.6; 
    
    slideFilter.frequency.setValueAtTime(150, t);
    slideFilter.frequency.exponentialRampToValueAtTime(500, t + duration);
    
    const slideGain = ctx.createGain();
    slideGain.gain.setValueAtTime(0, t);
    slideGain.gain.linearRampToValueAtTime(0.35, t + 0.08);
    slideGain.gain.linearRampToValueAtTime(0.25, t + duration - 0.15);
    slideGain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    
    slide.connect(slideFilter);
    slideFilter.connect(slideGain);
    slideGain.connect(ctx.destination);
    
    slide.start(t);
    slide.stop(t + duration);
}

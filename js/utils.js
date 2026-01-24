/**
 * @fileoverview Utility functions for MecanoType
 * Contains helper functions used across modules
 */

import { config } from './config.js';
import { i18n } from './data.js';
import { game, finishGame } from './game.js';
import { timerContainer, updateTimerDisplay } from './ui.js';

// ===================================
// Internationalization
// ===================================

/**
 * Get a translated string by key
 * Falls back to English if translation not found
 * @param {string} key - The translation key (e.g., "settings.language")
 * @returns {string} The translated string or the key if not found
 */
export function t(key) {
    const lang = config.currentLanguage;
    return i18n[lang]?.[key] || i18n.en?.[key] || key;
}

// ===================================
// Timer Functions
// ===================================

/**
 * Start the countdown timer for timed mode
 * Updates display every second and ends game when time runs out
 */
export function startTimer() {
    // Clear any existing timer
    stopTimer();
    
    // Reset time
    game.timeLeft = config.timeLimit;
    updateTimerDisplay();
    timerContainer.classList.remove('hidden', 'danger');

    // Start countdown
    config.timerInterval = setInterval(() => {
        game.timeLeft--;
        updateTimerDisplay();

        // End game when time runs out
        if (game.timeLeft <= 0) {
            stopTimer();
            finishGame();
        } 
        // Add danger styling when time is low
        else if (game.timeLeft <= 5) {
            timerContainer.classList.add('danger');
        }
    }, 1000);
}

/**
 * Stop the countdown timer
 * Clears the interval and removes danger styling
 */
export function stopTimer() {
    if (config.timerInterval) {
        clearInterval(config.timerInterval);
        config.timerInterval = null;
    }
    timerContainer?.classList.remove('danger');
}

// ===================================
// Formatting Functions
// ===================================

/**
 * Format seconds into HH:MM:SS format
 * @param {number} seconds - Total seconds to format
 * @returns {string} Formatted time string
 */
export function formatTime(seconds) {
    if (typeof seconds !== 'number' || isNaN(seconds)) {
        return '00:00:00';
    }
    
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    return [h, m, s]
        .map(v => v.toString().padStart(2, '0'))
        .join(':');
}

/**
 * Debounce a function call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle a function call
 * @param {Function} func - Function to throttle
 * @param {number} limit - Minimum milliseconds between calls
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
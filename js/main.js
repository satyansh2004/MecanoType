/**
 * @fileoverview Main entry point for MecanoType
 * Initializes all modules and sets up event listeners
 */

import { applyTranslations, loadWords } from './data.js';
import { initGame, updateCursor, restartGame } from './game.js';
import { 
    toggleZenMode, 
    toggleDarkMode, 
    updateThemeToggleIcon, 
    changeAudioIcon, 
    initializeSettingsEventListeners, 
    toggleMobile, 
    initButtons, 
    scrollPaper,
    hideLoading,
    showToast
} from './ui.js';

// ===================================
// Application Initialization
// ===================================

/**
 * Initialize the application
 * Sets up all modules and event listeners
 */
async function initApp() {
    try {
        // Apply theme immediately to prevent flash
        toggleDarkMode();
        updateThemeToggleIcon();
        
        // Apply translations
        applyTranslations();
        
        // Initialize UI components
        scrollPaper();
        toggleZenMode();
        changeAudioIcon();
        initButtons();
        initializeSettingsEventListeners();
        toggleMobile();
        
        // Load word lists
        await loadWords();
        
        // Initialize game
        initGame();
        restartGame();
        
        // Set up global event listeners
        setupGlobalListeners();
        
        // Hide loading overlay
        hideLoading();
        
        console.log('MecanoType initialized successfully');
        
    } catch (error) {
        console.error('Failed to initialize application:', error);
        showToast('Failed to load. Please refresh the page.', 'error');
        hideLoading();
    }
}

/**
 * Set up global event listeners
 */
function setupGlobalListeners() {
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateCursor();
        }, 100);
    });
    
    // Handle visibility change (pause/resume)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Page is hidden - could pause timer here if needed
        }
    });
    
    // Prevent context menu on game area
    const gameArea = document.getElementById('game-area');
    if (gameArea) {
        gameArea.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    // Handle escape key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('confirm-modal');
            if (modal && !modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
            }
        }
    });
}

// ===================================
// Start Application
// ===================================

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
} 
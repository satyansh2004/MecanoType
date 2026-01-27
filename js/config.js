/**
 * @fileoverview Configuration module for MecanoType
 * Handles all application settings and localStorage persistence
 */

// ===================================
// Constants
// ===================================

/** Available languages */
export const LANGUAGES = ["en", "es", "de", "fr", "pt"];

/** Available themes */
export const THEMES = ["light", "dark"];

/** Available game modes */
export const GAME_MODES = ["words", "time"];

/** Available word counts */
export const WORD_COUNTS = [10, 25, 50, 100, "infinite"];

/** Available time limits (in seconds) */
export const TIME_LIMITS = [15, 30, 60, 120];

/** Available generation modes */
export const GENERATION_MODES = ["random", "learning"];

/** localStorage keys prefix */
const STORAGE_PREFIX = "mecano_";

// ===================================
// Storage Helpers
// ===================================

/**
 * Safely get a value from localStorage
 * @param {string} key - The storage key (without prefix)
 * @param {*} defaultValue - Default value if not found
 * @returns {*} The stored value or default
 */
function getStorageItem(key, defaultValue) {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    if (item === null) return defaultValue;

    // Try to parse as JSON, fallback to raw string
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  } catch (error) {
    console.warn(`Failed to read ${key} from localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Safely set a value in localStorage
 * @param {string} key - The storage key (without prefix)
 * @param {*} value - The value to store
 */
export function setStorageItem(key, value) {
  try {
    const stringValue =
      typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(STORAGE_PREFIX + key, stringValue);
  } catch (error) {
    console.warn(`Failed to write ${key} to localStorage:`, error);
  }
}

// ===================================
// Configuration Object
// ===================================

/**
 * Application configuration with reactive persistence
 * @type {Object}
 */
export const config = {
  // Language settings
  currentLanguage: getStorageItem("language", "en"),

  // Generation settings
  generationMode: getStorageItem("generation_mode", "random"),

  // Mode settings
  zenModeEnabled: getStorageItem("zen_mode", false),
  suddenDeathEnabled: false,
  numbersEnabled: false,
  uppercaseEnabled: false,
  symbolsEnabled: false,

  // Theme settings
  currentTheme: getStorageItem("theme", "light"),

  // Game mode settings
  gameMode: getStorageItem("game_mode", "words"),
  timeLimit: getStorageItem("time_limit", 30),

  // Timer state (not persisted)
  timerInterval: null,
};

// ===================================
// Validation Helpers
// ===================================

/**
 * Validate and sanitize configuration values
 */
export function validateConfig() {
  // Validate language
  if (!LANGUAGES.includes(config.currentLanguage)) {
    config.currentLanguage = "en";
    setStorageItem("language", "en");
  }

  // Validate theme
  if (!THEMES.includes(config.currentTheme)) {
    config.currentTheme = "light";
    setStorageItem("theme", "light");
  }

  // Validate game mode
  if (!GAME_MODES.includes(config.gameMode)) {
    config.gameMode = "words";
    setStorageItem("game_mode", "words");
  }

  // Validate time limit
  if (!TIME_LIMITS.includes(config.timeLimit)) {
    config.timeLimit = 30;
    setStorageItem("time_limit", 30);
  }

  // Validate generation mode
  if (!GENERATION_MODES.includes(config.generationMode)) {
    config.generationMode = "random";
    setStorageItem("generation_mode", "random");
  }
}

// Run validation on load
validateConfig();

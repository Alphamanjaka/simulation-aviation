/**
 * config.js
 *
 * Contient les variables de configuration globales, les constantes physiques
 * et l'état initial des objets du jeu.
 */

// --- Paramètres du jeu (variables globales) ---
export let GAME_WIDTH;
export let GAME_HEIGHT;
export let GROUND_LEVEL;
export let RUNWAY_START_X;
export let RUNWAY_END_X;
export let RUNWAY_WIDTH;

export function setGameDimensions(width, height) {
  GAME_WIDTH = width;
  GAME_HEIGHT = height;
  GROUND_LEVEL = GAME_HEIGHT - 50;

  // Configuration de la piste basée sur le preset choisi
  let startPct = 0.3;
  let endPct = 1.5;

  if (CURRENT_RUNWAY === "short") {
    startPct = 0.3;
    endPct = 0.9; // Piste très courte
  } else if (CURRENT_RUNWAY === "long") {
    startPct = 0.1;
    endPct = 2.5; // Piste immense
  }

  RUNWAY_START_X = GAME_WIDTH * startPct;
  RUNWAY_END_X = GAME_WIDTH * endPct;
  RUNWAY_WIDTH = RUNWAY_END_X - RUNWAY_START_X;
}

// Variables de configuration physique (LET pour être modifiables)
export let MAX_ALTITUDE_FT = 1200;
export let MAX_SPEED = 6;

export let LANDING_START_ALTITUDE_FT = 600;
export let AUTOPILOT_DURATION_SECONDS = 4;

export let GRAVITY = 0.04;
export let AIR_RESISTANCE = 0.005;
export let INDUCED_DRAG_FACTOR = 0.02;
export let THRUST_CHANGE_RATE = 0.01;
export let PITCH_CHANGE_RATE = 0.01;
export let LIFT_FACTOR = 0.01;
export let PITCH_LIFT_FACTOR = 0.08;
export let THRUST_POWER = 0.06;
export let BRAKING_FORCE = 0.01;
export let FLAPS_LIFT = 0.004;
export let FLAPS_DRAG = 0.001;
export let GEAR_DRAG = 0.002;
export let INITIAL_FUEL = 100;
export let FUEL_CONSUMPTION_RATE = 0.05;

// Nouvelles variables pour l'environnement
export let WIND_X = 0; // Vent horizontal
export let WIND_Y = 0; // Vent vertical (turbulences)
export let IS_RAINING = false; // Indicateur de pluie
let CURRENT_RUNWAY = "standard";

// --- CHARGEMENT DES PARAMÈTRES ---
try {
  const savedSettings = sessionStorage.getItem("flightSim_settings");
  if (savedSettings) {
    const settings = JSON.parse(savedSettings);

    // 1. Appliquer l'Avion
    if (settings.aircraft === "jet") {
      GRAVITY = 0.05;
      THRUST_POWER = 0.12; // Très puissant
      MAX_SPEED = 10;
      LIFT_FACTOR = 0.008; // Petites ailes
      FUEL_CONSUMPTION_RATE = 0.15; // Gourmand
      INITIAL_FUEL = 200;
    } else if (settings.aircraft === "jumbo") {
      GRAVITY = 0.08; // Très lourd
      THRUST_POWER = 0.15;
      LIFT_FACTOR = 0.02; // Grandes ailes
      AIR_RESISTANCE = 0.01; // Beaucoup de traînée
      PITCH_CHANGE_RATE = 0.005; // Lent à manœuvrer
      INITIAL_FUEL = 500;
    }

    // 2. Appliquer la Piste
    CURRENT_RUNWAY = settings.runway || "standard";

    // 3. Appliquer la Météo
    if (settings.weather === "windy") {
      WIND_X = -0.02; // Vent de face fort
    } else if (settings.weather === "storm") {
      WIND_X = -0.03;
      WIND_Y = 0.01; // Légères turbulences
      AIR_RESISTANCE = 0.008; // Air dense/pluie
      IS_RAINING = true;
    }
  }
} catch (e) {
  console.warn("Impossible de charger les paramètres", e);
}

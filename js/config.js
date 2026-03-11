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
  RUNWAY_START_X = GAME_WIDTH * 0.3; // Commence à 30% de la largeur
  RUNWAY_END_X = GAME_WIDTH * 1.5; // Finit bien plus loin que l'écran initial (nécessite de voler pour l'atteindre)
  RUNWAY_WIDTH = RUNWAY_END_X - RUNWAY_START_X;
}

export const MAX_ALTITUDE_FT = 1200; // Altitude maximale adaptée à la hauteur de l'écran
export const MAX_SPEED = 6; // Vitesse horizontale maximale

export const LANDING_START_ALTITUDE_FT = 600; // Altitude de départ visible (approx 400px de haut)
export const AUTOPILOT_DURATION_SECONDS = 4; // Durée du pilote automatique en secondes

export const GRAVITY = 0.04; // Un avion plus léger, plus facile à faire voler
export const AIR_RESISTANCE = 0.005; // Frottement de base de l'air
export const INDUCED_DRAG_FACTOR = 0.02; // Résistance supplémentaire créée en cabrant l'avion
export const THRUST_CHANGE_RATE = 0.01; // Changement de puissance beaucoup plus progressif
export const PITCH_CHANGE_RATE = 0.01; // Rotation plus lourde pour plus de précision
export const LIFT_FACTOR = 0.01; // Portance de base générée par la vitesse
export const PITCH_LIFT_FACTOR = 0.08; // Autorité du pitch sur la portance, plus efficace
export const THRUST_POWER = 0.06; // Puissance du moteur pour contrer la résistance
export const BRAKING_FORCE = 0.01; // Freinage efficace au sol
export const FLAPS_LIFT = 0.004; // Portance ajoutée par niveau de volet
export const FLAPS_DRAG = 0.001; // Traînée ajoutée par niveau de volet (réduit)
export const GEAR_DRAG = 0.002; // Traînée ajoutée par le train d'atterrissage sorti (réduit)
export const INITIAL_FUEL = 100; // Quantité de carburant au départ
export const FUEL_CONSUMPTION_RATE = 0.05; // Consommation par frame à pleine puissance

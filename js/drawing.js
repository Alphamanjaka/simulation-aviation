/**
 * drawing.js
 *
 * Contient toutes les fonctions responsables du dessin sur le canvas.
 */

import { ctx } from "./context.js";
import {
  RUNWAY_START_X,
  GROUND_LEVEL,
  RUNWAY_WIDTH,
  RUNWAY_END_X,
  GAME_WIDTH,
  GAME_HEIGHT,
} from "./config.js";

/**
 * Dessine l'avion sur le canvas en fonction de son état actuel.
 */
export function drawPlane(plane, screenX, screenY) {
  plane.draw(screenX, screenY);
}

/**
 * Dessine la piste d'atterrissage.
 */
export function drawRunway(cameraX) {
  ctx.fillStyle = "#4A4A4A";
  ctx.fillRect(RUNWAY_START_X - cameraX, GROUND_LEVEL - 5, RUNWAY_WIDTH, 5);

  ctx.fillStyle = "white";
  ctx.fillRect(RUNWAY_START_X - cameraX, GROUND_LEVEL - 5, RUNWAY_WIDTH, 1);
  ctx.fillRect(RUNWAY_START_X - cameraX, GROUND_LEVEL - 1, RUNWAY_WIDTH, 1);

  const dashLength = 30;
  const dashGap = 20;
  for (let x = RUNWAY_START_X; x < RUNWAY_END_X; x += dashLength + dashGap) {
    ctx.fillRect(x - cameraX, GROUND_LEVEL - 3, dashLength, 2);
  }
}

/**
 * Dessine le ciel et le sol en fond.
 */
export function drawSkyAndGround() {
  ctx.fillStyle = "#3498db";
  ctx.fillRect(0, 0, GAME_WIDTH, GROUND_LEVEL);

  ctx.fillStyle = "#27ae60";
  ctx.fillRect(0, GROUND_LEVEL, GAME_WIDTH, GAME_HEIGHT - GROUND_LEVEL);
}

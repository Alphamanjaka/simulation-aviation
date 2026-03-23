/**
 * rain.js
 *
 * Gère l'effet visuel de la pluie.
 */

import { ctx } from "./context.js";
import { GAME_WIDTH, GAME_HEIGHT, IS_RAINING } from "./config.js";

class RainDrop {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * GAME_WIDTH;
    this.y = Math.random() * -GAME_HEIGHT; // Commence au-dessus de l'écran
    this.length = Math.random() * 20 + 10;
    this.speedY = Math.random() * 10 + 15;
    this.speedX = -2; // Légère inclinaison due au vent
  }

  update(planeSpeed) {
    this.y += this.speedY;
    // La pluie semble aller plus vite vers la gauche quand l'avion avance
    this.x += this.speedX - planeSpeed * 2;

    if (this.y > GAME_HEIGHT) {
      this.reset();
      this.y = -20; // Réapparaît juste au-dessus
    }
    if (this.x < 0) {
      this.x = GAME_WIDTH; // Réapparaît à droite si elle sort à gauche
    }
  }

  draw() {
    ctx.strokeStyle = "rgba(174, 194, 224, 0.6)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.speedX, this.y + this.length);
    ctx.stroke();
  }
}

let rainDrops = [];

export function initRain(dropCount = 100) {
  if (!IS_RAINING) return;
  rainDrops = Array.from({ length: dropCount }, () => new RainDrop());
}

export function updateRain(planeSpeed) {
  if (!IS_RAINING) return;
  rainDrops.forEach((drop) => drop.update(planeSpeed));
}

export function drawRain() {
  if (!IS_RAINING) return;
  rainDrops.forEach((drop) => drop.draw());
}

/**
 * background.js
 *
 * Gère les éléments de l'arrière-plan, comme les nuages avec un effet de parallaxe.
 */

import { ctx } from "./context.js";
import { GAME_WIDTH, GROUND_LEVEL } from "./config.js";

class Cloud {
  constructor() {
    this.reset();
    // Position X initiale aléatoire pour un démarrage varié
    this.x = Math.random() * GAME_WIDTH;
  }

  reset() {
    this.x = GAME_WIDTH + Math.random() * 200; // Commence hors de l'écran à droite
    this.y = Math.random() * (GROUND_LEVEL - 150) + 30; // Évite le sol et le haut de l'écran
    this.size = Math.random() * 40 + 30; // Taille aléatoire
    // Effet de parallaxe : les petits nuages (plus loin) bougent plus lentement
    this.speedFactor = 0.1 + (this.size / 70) * 0.4; // Facteur de vitesse entre 0.1 et ~0.6
  }

  update(planeSpeed) {
    // Déplace le nuage vers la gauche en fonction de la vitesse de l'avion
    this.x -= planeSpeed * this.speedFactor;
    // Si le nuage sort de l'écran par la gauche, on le réinitialise à droite
    if (this.x + this.size * 2 < 0) {
      this.reset();
    }
  }

  draw(cameraX) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.beginPath();
    // Forme de nuage simple avec plusieurs cercles
    ctx.arc(this.x - cameraX, this.y, this.size * 0.6, 0, Math.PI * 2);
    ctx.arc(
      this.x - cameraX + this.size * 0.5,
      this.y - this.size * 0.1,
      this.size * 0.7,
      0,
      Math.PI * 2,
    );
    ctx.arc(
      this.x - cameraX + this.size,
      this.y,
      this.size * 0.5,
      0,
      Math.PI * 2,
    );
    ctx.closePath();
    ctx.fill();
  }
}

let clouds = [];

export function initBackground(cloudCount = 10) {
  clouds = Array.from({ length: cloudCount }, () => new Cloud());
}

export function updateBackground(planeSpeed) {
  // Met à jour la position des nuages en fonction de la vitesse de l'avion
  clouds.forEach((cloud) => cloud.update(planeSpeed));
}

export function drawBackground(cameraX) {
  clouds.forEach((cloud) => cloud.draw(cameraX));
}

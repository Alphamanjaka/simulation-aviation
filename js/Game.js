/**
 * Game.js
 *
 * La classe principale qui orchestre l'ensemble du jeu.
 * Elle gère la boucle de jeu, l'état, et les objets principaux.
 */

import { Plane } from "./Plane.js";
import { canvas, ctx, restartButton } from "./context.js";
import { setGameDimensions, GAME_WIDTH, GAME_HEIGHT } from "./config.js";
import { handleControls } from "./controls.js";
import { updatePlane } from "./update.js";
import { drawSkyAndGround, drawRunway, drawPlane } from "./drawing.js";
import {
  initBackground,
  updateBackground,
  drawBackground,
} from "./background.js";
import { audioManager } from "./audio.js";
import * as ui from "./ui.js";

export class Game {
  constructor() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setGameDimensions(canvas.width, canvas.height);

    this.plane = new Plane();
    this.cameraX = 0;
    this.gameState = "PLAYING";

    // Gestionnaire de redémarrage simple pour l'instance active
    // On utilise .onclick pour écraser les handlers précédents si on change de jeu
    document.getElementById("restartButton").onclick = () => this.reset();

    audioManager.init();
    initBackground();
  }

  // Méthode à surcharger par les enfants
  reset() {
    ui.resetUI();
    this.gameState = "PLAYING";
  }

  // Méthode à surcharger pour la logique spécifique (autopilote, etc.)
  updateLogic() {
    handleControls(this.plane);
    updatePlane(this.plane);
    audioManager.updateEngine(this.plane.thrust);
    updateBackground(this.plane.velX);

    if (this.plane.justLanded || this.plane.justCrashed) {
      this.gameState = "GAME_OVER";
      audioManager.stopEngine();
      if (this.plane.justLanded) {
        audioManager.playOnce("landing");
      } else {
        audioManager.playOnce("crash");
      }
    }
  }

  run() {
    // Démarre la boucle de jeu si elle n'est pas déjà en cours
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    // Le contexte audio doit être repris après une interaction utilisateur.
    // Le navigateur peut bloquer la lecture automatique.
    audioManager.resumeContext();
    audioManager.startEngine();
    this.gameLoop();
  }

  gameLoop() {
    // 1. Gérer les mises à jour logiques
    if (this.gameState === "PLAYING") {
      this.updateLogic();
    }

    // Mettre à jour la caméra pour suivre l'avion
    this.cameraX = this.plane.worldX - GAME_WIDTH * 0.25;

    // 2. Gérer le dessin
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    drawSkyAndGround();
    drawBackground(this.cameraX);
    drawRunway(this.cameraX);
    drawPlane(this.plane, GAME_WIDTH * 0.25, this.plane.y);

    // 3. Mettre à jour l'interface utilisateur
    ui.updateInstruments(this.plane);
    this.updateUI();

    // 4. Demander la prochaine frame
    this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
  }

  // Méthode à surcharger pour l'UI spécifique (messages)
  updateUI() {
    if (this.gameState === "GAME_OVER") {
      // Message générique si non géré par l'enfant
      ui.showGameMessage(this.plane.justLanded ? "Terminé" : "Crash");
    } else {
      ui.hideMessages();
    }
  }

  stop() {
    audioManager.stopEngine();
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;
  }
}

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
import { initRain, updateRain, drawRain } from "./rain.js";
import { audioManager } from "./audio.js";
import * as ui from "./ui.js";

export class Game {
  constructor() {
    console.log("Initializing game...");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    // Mettre à jour les dimensions du jeu après avoir défini la taille du canvas
    setGameDimensions(canvas.width, canvas.height);
    console.log(`Game dimensions set to ${GAME_WIDTH}x${GAME_HEIGHT}`);
    this.plane = new Plane();
    this.cameraX = 0;
    this.gameState = "PLAYING";

    // Gestionnaire de redémarrage simple pour l'instance active
    // On utilise .onclick pour écraser les handlers précédents si on change de jeu
    document.getElementById("restartButton").onclick = () => this.reset();

    audioManager.init();
    initBackground();
    initRain(400); // 400 gouttes pour une bonne averse
  }

  // Méthode à surcharger par les enfants
  reset() {
    ui.resetUI();
    this.gameState = "PLAYING";
  }

  // Méthode à surcharger pour la logique spécifique (autopilote, etc.)
  updateLogic() {
    this.handleScenarioControls();
    updatePlane(this.plane);
    audioManager.updateEngine(this.plane.thrust);
    updateBackground(this.plane.velX);
    updateRain(this.plane.velX);

    this.checkGameRules();

    // Si l'avion vient de toucher le sol, on joue le son mais on continue la simulation pour le freinage.
    if (this.plane.justLanded) {
      audioManager.playOnce("landing");
    }

    // La partie se termine si l'avion s'est crashé, OU s'il a atterri ET que sa vitesse est nulle.
    if (
      this.plane.justCrashed ||
      (this.plane.landed && this.plane.velX === 0)
    ) {
      this.gameState = "GAME_OVER";
      audioManager.stopEngine();
      // Si c'est un crash, on joue le son correspondant.
      if (this.plane.justCrashed) {
        audioManager.playOnce("crash");
      }
    }
  }

  handleScenarioControls() {
    handleControls(this.plane);
  }

  checkGameRules() {
    // This method is intended to be overridden by subclasses.
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
    drawRain(); // La pluie est dessinée par-dessus tout le reste

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

import { Game } from "./Game.js";
import { RUNWAY_START_X, RUNWAY_END_X, GROUND_LEVEL } from "./config.js";
import * as ui from "./ui.js";
import { audioManager } from "./audio.js";

const takeoffMessages = {
  SUCCESS: "Décollage Réussi !",
  CRASH: "Crash au décollage !",
};

const TAKEOFF_SUCCESS_ALTITUDE_FT = 500;

export class TakeoffGame extends Game {
  constructor() {
    super();
    this.reset();
  }

  reset() {
    super.reset();
    this.plane.resetForTakeoff(
      RUNWAY_START_X + 100,
      GROUND_LEVEL - this.plane.height / 2,
    );
  }

  checkGameRules() {
    if (this.gameState === "GAME_OVER") return;

    // Règle d'échec : crash si l'avion sort de la piste sans avoir décollé.
    if (
      !this.plane.crashed &&
      this.plane.worldX > RUNWAY_END_X &&
      this.plane.y >= GROUND_LEVEL - this.plane.height / 2
    ) {
      this.plane.crashed = true;
      this.plane.justCrashed = true;
      this.plane.landingQuality = "CRASH";
      this.plane.stop();
    }

    // Règle de succès : atteindre une altitude de sécurité.
    const altitude = (GROUND_LEVEL - this.plane.y) * 1.5;
    if (altitude >= TAKEOFF_SUCCESS_ALTITUDE_FT) {
      this.plane.landed = true; // On utilise ce drapeau pour signifier un succès
      this.plane.justLanded = true; // Pour déclencher le son de succès
      this.plane.landingQuality = "SUCCESS";
      this.gameState = "GAME_OVER"; // Termine la partie
      audioManager.stopEngine(); // Arrête le son du moteur
    }
  }

  updateUI() {
    if (this.gameState === "GAME_OVER") {
      ui.showGameMessage(
        takeoffMessages[this.plane.landingQuality] || "Fin du scénario",
      );
    } else {
      ui.hideMessages();
    }
  }
}

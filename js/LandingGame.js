import { Game } from "./Game.js";
import {
  RUNWAY_START_X,
  RUNWAY_END_X,
  GROUND_LEVEL,
  LANDING_START_ALTITUDE_FT,
  AUTOPILOT_DURATION_SECONDS,
} from "./config.js";
import { handleControls } from "./controls.js";
import * as ui from "./ui.js";

const landingMessages = {
  PERFECT: "Atterrissage Parfait !",
  GOOD: "Bon atterrissage.",
  HARD: "Atterrissage brutal !",
  CRASH: "Crash !",
  MISSED: "Atterrissage manqué !",
};

export class LandingGame extends Game {
  constructor() {
    super();
    this.autopilotTimer = 0;
    this.reset();
  }

  reset() {
    super.reset();
    const landingAltitude = GROUND_LEVEL - LANDING_START_ALTITUDE_FT / 1.5;
    this.plane.resetForLanding(RUNWAY_START_X - 1200, landingAltitude);
    this.autopilotTimer = AUTOPILOT_DURATION_SECONDS * 60; // ~60fps
  }

  handleScenarioControls() {
    // Gestion spécifique du pilote automatique
    if (this.autopilotTimer > 0) {
      this.autopilotTimer--;

      // --- Logique du pilote automatique ---
      // Maintient une descente contrôlée et stable.
      // Modifiez cette valeur pour ajuster la pente de descente (ex: 0.1 pour descendre moins vite)
      const targetVerticalSpeed = 0.1;
      const correctionFactor = 0.005; // Force de la correction pour le pitch.

      // Si on descend trop vite, on cabre (pitch < 0) pour augmenter la portance.
      if (this.plane.velY > targetVerticalSpeed) {
        this.plane.pitch -= correctionFactor;
      }
      // Si on ne descend pas assez vite (ou si on monte), on pique (pitch > 0) pour réduire la portance.
      else if (this.plane.velY < targetVerticalSpeed) {
        this.plane.pitch += correctionFactor;
      }
      // Limite les actions du pilote auto pour éviter les manoeuvres extrêmes.
      this.plane.pitch = Math.max(-0.1, Math.min(this.plane.pitch, 0.1));
    } else {
      handleControls(this.plane);
    }
  }

  checkGameRules() {
    // Rule 1: Missed approach (flying past the runway)
    if (
      !this.plane.landed &&
      !this.plane.crashed &&
      this.plane.worldX > RUNWAY_END_X
    ) {
      this.plane.crashed = true;
      this.plane.justCrashed = true;
      this.plane.landingQuality = "MISSED";
    }

    // Rule 2: Runway overrun (not stopping in time after landing)
    if (this.plane.landed && this.plane.worldX > RUNWAY_END_X) {
      this.plane.crashed = true;
      this.plane.justCrashed = true;
      this.plane.landed = false; // It's now a crash, not a landing
      this.plane.landingQuality = "CRASH";
      this.plane.stop();
    }
  }

  updateUI() {
    if (this.gameState === "GAME_OVER") {
      ui.showGameMessage(landingMessages[this.plane.landingQuality]);
    } else if (this.autopilotTimer > 0) {
      ui.showAutopilotMessage(
        `Pilote Auto: ${Math.ceil(this.autopilotTimer / 60)}s`,
      );
    } else {
      ui.hideMessages();
    }
  }
}

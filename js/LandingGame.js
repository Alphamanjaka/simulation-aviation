import { Game } from "./Game.js";
import {
  RUNWAY_START_X,
  GROUND_LEVEL,
  LANDING_START_ALTITUDE_FT,
  AUTOPILOT_DURATION_SECONDS,
} from "./config.js";
import { handleControls } from "./controls.js";
import { updatePlane } from "./update.js";
import { updateBackground } from "./background.js";
import * as ui from "./ui.js";

const landingMessages = {
  PERFECT: "Atterrissage Parfait !",
  GOOD: "Bon atterrissage.",
  HARD: "Atterrissage brutal !",
  CRASH: "Crash !",
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

  updateLogic() {
    // Gestion spécifique du pilote automatique
    if (this.autopilotTimer > 0) {
      this.autopilotTimer--;
    } else {
      handleControls(this.plane);
    }

    // Logique standard
    updatePlane(this.plane);
    updateBackground(this.plane.velX);

    if (this.plane.justLanded || this.plane.justCrashed) {
      this.gameState = "GAME_OVER";
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

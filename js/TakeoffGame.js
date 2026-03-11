import { Game } from "./Game.js";
import { RUNWAY_START_X, GROUND_LEVEL } from "./config.js";
import * as ui from "./ui.js";

const takeoffMessages = {
  PERFECT: "Décollage Réussi !",
  GOOD: "Décollage Réussi !",
  HARD: "Attention aux dégâts...",
  CRASH: "Crash au décollage !",
};

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

  updateUI() {
    if (this.gameState === "GAME_OVER") {
      ui.showGameMessage(takeoffMessages[this.plane.landingQuality] || "Fin");
    } else {
      ui.hideMessages();
    }
  }
}

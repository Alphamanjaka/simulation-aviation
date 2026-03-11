/**
 * ui.js
 *
 * Gère toutes les mises à jour de l'interface utilisateur (DOM),
 * comme les instruments et les messages.
 */

import {
  altitudeValueElem,
  altitudeArrowElem,
  speedValueElem,
  vSpeedValueElem,
  vSpeedArrowElem,
  horizonElem,
  gameMessageElem,
  thrustLevelElem,
  flapsValueElem,
  gearValueElem,
  fuelLevelElem,
} from "./context.js";
import { GROUND_LEVEL, INITIAL_FUEL } from "./config.js";

export function showGameMessage(message) {
  gameMessageElem.textContent = message;
  gameMessageElem.style.display = "block";
}

export function showAutopilotMessage(message) {
  gameMessageElem.textContent = message;
  gameMessageElem.style.display = "block";
}

export function hideMessages() {
  if (gameMessageElem.style.display !== "none") {
    gameMessageElem.style.display = "none";
  }
}

export function updateInstruments(plane) {
  const altitude = Math.round(
    (GROUND_LEVEL - plane.y - plane.height / 2) * 1.5,
  );
  const speed = Math.round(plane.velX * 10);
  const vSpeed = Math.round(plane.velY * -50);

  altitudeValueElem.textContent = `${altitude} ft`;
  altitudeArrowElem.style.transform = `rotate(${plane.velY < 0 ? "-90deg" : plane.velY > 0 ? "90deg" : "0deg"})`;
  altitudeArrowElem.style.display = plane.velY === 0 ? "none" : "inline";

  speedValueElem.textContent = `${speed} kts`;

  vSpeedValueElem.textContent = `${vSpeed} ft/min`;
  vSpeedArrowElem.style.transform = `rotate(${vSpeed < 0 ? "90deg" : vSpeed > 0 ? "-90deg" : "0deg"})`;
  vSpeedArrowElem.style.display = vSpeed === 0 ? "none" : "inline";

  const pitchDegrees = (plane.pitch * 180) / Math.PI;
  horizonElem.style.transform = `translateY(${pitchDegrees * -1}%)`;

  // Update thrust gauge
  if (thrustLevelElem) {
    thrustLevelElem.style.height = `${plane.thrust * 100}%`;
  }

  // Update flaps display
  flapsValueElem.textContent = `${plane.flaps * 15}°`;

  // Update gear display
  if (gearValueElem) {
    if (plane.gearDown) {
      gearValueElem.textContent = "SORTI";
      gearValueElem.style.color = "#2ECC71"; // Green
    } else {
      gearValueElem.textContent = "RENTRÉ";
      gearValueElem.style.color = "#E74C3C"; // Red
    }
  }

  // Update fuel gauge
  if (fuelLevelElem) {
    fuelLevelElem.style.height = `${(plane.fuel / INITIAL_FUEL) * 100}%`;
  }
}

export function resetUI() {
  altitudeArrowElem.style.display = "none";
  vSpeedArrowElem.style.display = "none";
  hideMessages();
  horizonElem.style.transform = `translateY(0%)`;
  if (thrustLevelElem) {
    thrustLevelElem.style.height = "0%";
  }
  if (fuelLevelElem) {
    fuelLevelElem.style.height = "100%";
  }
}

/**
 * controls.js
 *
 * Gère les entrées utilisateur (clavier) pour contrôler le jeu.
 */

let keys = {};
let fPressed = false;
let gPressed = false;

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

/**
 * Met à jour l'état de l'avion en fonction des touches actuellement pressées.
 */
export function handleControls(plane) {
  if (plane.landed || plane.crashed) return;

  if (keys["ArrowUp"]) {
    plane.applyPitch("up");
  }
  if (keys["ArrowDown"]) {
    plane.applyPitch("down");
  }

  if (keys["ArrowRight"]) {
    plane.applyThrust("increase");
  }
  if (keys["ArrowLeft"]) {
    plane.applyThrust("decrease");
  }

  // Gestion des volets (Touche F)
  if (keys["f"] || keys["F"]) {
    if (!fPressed) {
      plane.cycleFlaps();
      fPressed = true;
    }
  } else {
    fPressed = false;
  }

  // Gestion du train d'atterrissage (Touche G)
  if (keys["g"] || keys["G"]) {
    if (!gPressed) {
      plane.toggleGear();
      gPressed = true;
    }
  } else {
    gPressed = false;
  }
}

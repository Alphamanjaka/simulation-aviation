/**
 * controls.js
 *
 * Gère les entrées utilisateur (clavier) pour contrôler le jeu.
 */

let keys = {};

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
}

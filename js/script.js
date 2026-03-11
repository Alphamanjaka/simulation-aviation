/**
 * script.js
 *
 * Gère la navigation du menu principal.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Gestionnaires d'événements pour le menu
  document.getElementById("start-takeoff").addEventListener("click", () => {
    window.location.href = "html/takingoff.html";
  });

  document.getElementById("start-landing").addEventListener("click", () => {
    window.location.href = "html/landing.html";
  });
});

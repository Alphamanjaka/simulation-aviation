/**
 * script.js
 *
 * Gère la navigation du menu principal.
 */

document.addEventListener("DOMContentLoaded", () => {
  const infoButton = document.getElementById("info-button");
  const infoModal = document.getElementById("info-modal");
  const closeButton = document.querySelector(".close-button");

  // Gestionnaires d'événements pour le menu
  document.getElementById("start-takeoff").addEventListener("click", () => {
    window.location.href = "html/takingoff.html";
  });

  document.getElementById("start-landing").addEventListener("click", () => {
    window.location.href = "html/landing.html";
  });

  // Gestionnaires pour la fenêtre d'information
  infoButton.addEventListener("click", () => {
    infoModal.classList.remove("hidden");
  });

  closeButton.addEventListener("click", () => {
    infoModal.classList.add("hidden");
  });

  window.addEventListener("click", (event) => {
    if (event.target == infoModal) {
      infoModal.classList.add("hidden");
    }
  });
});

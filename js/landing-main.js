import { LandingGame } from "./LandingGame.js";

document.addEventListener("DOMContentLoaded", () => {
  const game = new LandingGame();
  game.run();

  document.getElementById("menuButton").addEventListener("click", () => {
    // Redirige vers la page du menu principal
    window.location.href = "../index.html";
  });
});

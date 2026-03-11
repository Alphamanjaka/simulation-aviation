import { TakeoffGame } from "./TakeoffGame.js";

document.addEventListener("DOMContentLoaded", () => {
  const game = new TakeoffGame();
  game.run();

  document.getElementById("menuButton").addEventListener("click", () => {
    // Redirige vers la page du menu principal
    window.location.href = "../index.html";
  });
});

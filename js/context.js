/**
 * context.js
 *
 * Centralise l'accès aux éléments du DOM et au contexte du canvas
 * pour éviter les dépendances circulaires et faciliter la maintenance.
 */

export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");

export const altitudeValueElem = document.getElementById("altitudeValue");
export const altitudeArrowElem = document.getElementById("altitudeArrow");
export const speedValueElem = document.getElementById("speedValue");
export const vSpeedValueElem = document.getElementById("vSpeedValue");
export const vSpeedArrowElem = document.getElementById("vSpeedArrow");
export const horizonElem = document
  .getElementById("attitudeIndicator")
  .querySelector(".horizon");
export const gameMessageElem = document.getElementById("gameMessage");
export const restartButton = document.getElementById("restartButton");
export const thrustLevelElem = document.getElementById("thrustLevel");
export const flapsValueElem = document.getElementById("flapsValue");
export const gearValueElem = document.getElementById("gearValue");
export const fuelLevelElem = document.getElementById("fuelLevel");

/**
 * audio.js
 *
 * Gère le chargement et la lecture des sons du jeu via l'API Web Audio.
 */

let audioContext;
const sounds = {};
let engineSource;
let engineGain;

// Helper pour charger un fichier son
async function loadSound(url) {
  if (!audioContext) return null;
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
  } catch (error) {
    console.error(`Erreur lors du chargement du son: ${url}`, error);
    return null;
  }
}

export const audioManager = {
  // Initialise le contexte audio. Doit être appelé avant de jouer des sons.
  async init() {
    if (audioContext) return;
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      // Charger tous les sons nécessaires
      sounds.engine = await loadSound("../sounds/engine.wav");
      sounds.landing = await loadSound("../sounds/landing.wav");
      sounds.crash = await loadSound("../sounds/crash.wav");
    } catch (e) {
      console.error(
        "L'API Web Audio n'est pas supportée par ce navigateur.",
        e,
      );
    }
  },

  // Tente de réactiver le contexte audio si le navigateur l'a suspendu.
  resumeContext() {
    if (audioContext && audioContext.state === "suspended") {
      audioContext.resume();
    }
  },

  // Démarre le son du moteur en boucle
  startEngine() {
    if (!audioContext || !sounds.engine || engineSource) return;

    engineSource = audioContext.createBufferSource();
    engineSource.buffer = sounds.engine;
    engineSource.loop = true;

    engineGain = audioContext.createGain();
    engineGain.gain.value = 0; // Commence en silence

    engineSource.connect(engineGain).connect(audioContext.destination);
    engineSource.start();
  },

  // Met à jour le volume et la tonalité du moteur en fonction de la poussée
  updateEngine(thrust) {
    if (!engineGain || !engineSource) return;
    // Volume de 10% à 70%
    engineGain.gain.setValueAtTime(
      0.1 + thrust * 0.6,
      audioContext.currentTime,
    );
    // Tonalité (pitch) de 80% à 120%
    engineSource.playbackRate.setValueAtTime(
      0.8 + thrust * 0.4,
      audioContext.currentTime,
    );
  },

  // Arrête le son du moteur
  stopEngine() {
    if (engineSource) {
      engineSource.stop();
      engineSource.disconnect();
      engineSource = null;
    }
  },

  // Joue un son une seule fois
  playOnce(soundName) {
    if (!audioContext || !sounds[soundName]) return;

    const source = audioContext.createBufferSource();
    source.buffer = sounds[soundName];
    source.connect(audioContext.destination);
    source.start();
  },
};

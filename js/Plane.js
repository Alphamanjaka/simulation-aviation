/**
 * Plane.js
 *
 * Définit la classe Plane qui encapsule l'état et le comportement de l'avion.
 */

import { ctx } from "./context.js";
import {
  GRAVITY,
  BRAKING_FORCE,
  AIR_RESISTANCE,
  WIND_X,
  WIND_Y,
  INDUCED_DRAG_FACTOR,
  PITCH_CHANGE_RATE,
  THRUST_CHANGE_RATE,
  THRUST_POWER,
  MAX_ALTITUDE_FT,
  MAX_SPEED,
  LIFT_FACTOR,
  PITCH_LIFT_FACTOR,
  FLAPS_LIFT,
  FLAPS_DRAG,
  GEAR_DRAG,
  INITIAL_FUEL,
  FUEL_CONSUMPTION_RATE,
  GROUND_LEVEL,
  RUNWAY_START_X,
  RUNWAY_END_X,
} from "./config.js";

export class Plane {
  constructor() {
    this.width = 48;
    this.height = 16;
    // Les propriétés sont initialisées par les méthodes de reset spécifiques
  }

  resetForTakeoff(startX, startY) {
    this.worldX = startX;
    this.y = startY;
    this.velX = 0;
    this.velY = 0;
    this.pitch = 0;
    this.thrust = 0;
    this.flaps = 0; // 0 = rétractés
    this.gearDown = true;
    this.fuel = INITIAL_FUEL;
    this.landed = false;
    this.crashed = false;
    this.justLanded = false;
    this.justCrashed = false;
    this.landingQuality = null;
  }

  resetForLanding(startX, startY) {
    this.worldX = startX;
    this.y = startY;
    this.velX = 4.0; // Vitesse d'approche stable
    this.velY = 0;
    this.pitch = 0; // À plat
    this.thrust = 0.55; // Poussée nécessaire pour maintenir la vitesse d'approche avec la traînée
    this.flaps = 1; // Volets sortis au niveau 1 pour l'approche
    this.gearDown = true;
    this.fuel = INITIAL_FUEL;
    this.landed = false;
    this.crashed = false;

    // Drapeaux pour ne signaler l'événement qu'une seule fois
    this.justLanded = false;
    this.justCrashed = false;
    this.landingQuality = null;
  }

  stop() {
    this.velX = 0;
    this.velY = 0;
  }

  // Applique une rotation de pitch progressive pour éviter les changements brusques d'attitude.
  applyPitch(direction) {
    if (direction === "up") {
      this.pitch -= PITCH_CHANGE_RATE;
    } else if (direction === "down") {
      this.pitch += PITCH_CHANGE_RATE;
    }
    // Limiter le pitch
    this.pitch = Math.max(-Math.PI / 4, Math.min(this.pitch, Math.PI / 4));
  }

  // Applique une poussée progressive pour éviter les changements brusques de vitesse.
  applyThrust(direction) {
    if (this.fuel <= 0) {
      this.thrust = 0;
      return;
    }
    if (direction === "increase") {
      this.thrust = Math.min(1.0, this.thrust + THRUST_CHANGE_RATE);
    } else if (direction === "decrease") {
      this.thrust = Math.max(0.0, this.thrust - THRUST_CHANGE_RATE);
    }
  }

  cycleFlaps() {
    this.flaps = (this.flaps + 1) % 3; // Cycle : 0 -> 1 -> 2 -> 0
  }

  toggleGear() {
    // On ne peut pas rentrer le train au sol
    if (this.y < GROUND_LEVEL - this.height) {
      this.gearDown = !this.gearDown;
    }
  }

  update() {
    this.justLanded = false;
    this.justCrashed = false;

    if (this.crashed) return;

    // Gestion du carburant
    if (this.fuel > 0) {
      this.fuel -= this.thrust * FUEL_CONSUMPTION_RATE;
      if (this.fuel <= 0) {
        this.fuel = 0;
        this.thrust = 0; // Panne sèche !
      }
    }

    if (this.landed) {
      // Si l'avion a atterri, appliquer les freins jusqu'à l'arrêt.
      if (this.velX > 0) {
        this.velX -= BRAKING_FORCE;
        if (this.velX < 0) this.velX = 0;
      }
      this.worldX += this.velX;
      return;
    }

    // Physique
    // 1. Résistance de l'air (Drag) : Combinaison de la résistance de base et de la résistance induite par l'angle.
    const gearDrag = this.gearDown ? GEAR_DRAG : 0;
    const flapsDrag = this.flaps * FLAPS_DRAG;
    const inducedDrag = Math.abs(this.pitch) * INDUCED_DRAG_FACTOR;
    this.velX *= 1 - (AIR_RESISTANCE + inducedDrag + flapsDrag + gearDrag);
    this.velY *= 1 - AIR_RESISTANCE;

    // 2. Moteur (Thrust)
    this.velX += Math.cos(this.pitch) * this.thrust * THRUST_POWER;
    this.velY += Math.sin(this.pitch) * this.thrust * THRUST_POWER;

    // 3. Gravité : Tire l'avion vers le bas.
    this.velY += GRAVITY;
    
    // 4. Vent (Météo)
    this.velX += WIND_X;
    this.velY += WIND_Y;

    // 5. Portance (Lift) : Générée par la vitesse sur les ailes, et modifiée par l'angle de l'avion.
    // Un pitch négatif (nez en l'air) augmente la portance.
    const flapsLift = this.flaps * FLAPS_LIFT;
    const lift =
      this.velX * (LIFT_FACTOR - this.pitch * PITCH_LIFT_FACTOR + flapsLift);
    this.velY -= lift;

    this.worldX += this.velX;
    this.y += this.velY;

    // Limiter la vitesse horizontale maximale
    this.velX = Math.max(0, Math.min(this.velX, MAX_SPEED));

    // Plafond d'altitude maximale
    const minY = GROUND_LEVEL - MAX_ALTITUDE_FT / 1.5;
    if (this.y < minY) {
      this.y = minY;
      if (this.velY < 0) {
        this.velY = 0;
      }
    }

    // Collision avec le sol
    if (this.y + this.height / 2 >= GROUND_LEVEL) {
      this.y = GROUND_LEVEL - this.height / 2;
      const impactSpeedY = this.velY;
      this.velY = 0; // Annule la vitesse verticale pour éviter de s'enfoncer ou de rebondir

      // On ne traite la logique d'impact que si l'avion n'est pas déjà dans un état final
      // et s'il était bien en train de descendre (vitesse d'impact > seuil minimal).
      if (!this.landed && !this.crashed && impactSpeedY > 0.05) {
        const isOverRunway =
          this.worldX > RUNWAY_START_X && this.worldX < RUNWAY_END_X;
        const vSpeedAbs = Math.abs(impactSpeedY);
        const pitchAbs = Math.abs(this.pitch);

        // Crash si on atterrit sans le train sorti
        if (!this.gearDown) {
          this.crashed = true;
          this.justCrashed = true;
          this.landingQuality = "CRASH";
          this.stop();
          return;
        }

        // Conditions pour un atterrissage réussi
        if (
          isOverRunway &&
          vSpeedAbs < 2.2 &&
          this.velX > 0.5 &&
          pitchAbs < 0.7
        ) {
          this.landed = true;
          this.justLanded = true;
          if (vSpeedAbs < 0.5 && pitchAbs < 0.1)
            this.landingQuality = "PERFECT";
          else if (vSpeedAbs < 1.5 && pitchAbs < 0.3)
            this.landingQuality = "GOOD";
          else this.landingQuality = "HARD";
          // La logique de freinage dans update() prend le relais, on ne stoppe pas l'avion ici.
        } else {
          // Sinon, c'est un crash
          this.crashed = true;
          this.justCrashed = true;
          this.landingQuality = "CRASH";
          this.stop(); // Arrêt immédiat en cas de crash
        }
      }
    }
  }

  draw(screenX, screenY) {
    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.rotate(this.pitch);

    const w = this.width;
    const h = this.height;

    ctx.fillStyle = "#D5D8DC";
    ctx.strokeStyle = "#566573";
    ctx.lineWidth = 1.5;

    // Dessin du fuselage, des ailes et de l'empennage...
    // (Le code de dessin est identique à celui de drawPlane et est maintenant une méthode de la classe)
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.quadraticCurveTo(w / 4, -h / 2, 0, -h / 2);
    ctx.lineTo(-w / 2 + 10, -h / 2);
    ctx.quadraticCurveTo(-w / 2, -h / 4, -w / 2, 0);
    ctx.quadraticCurveTo(-w / 2, h / 4, -w / 2 + 10, h / 2);
    ctx.lineTo(0, h / 2);
    ctx.quadraticCurveTo(w / 4, h / 2, w / 2, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Train d'atterrissage
    if (this.gearDown) {
      ctx.fillStyle = "#566573";
      ctx.strokeStyle = "#2C3E50";
      ctx.lineWidth = 1;

      // Roue arrière
      ctx.fillRect(-w / 2 + 10, h / 2, 4, 8);
      ctx.strokeRect(-w / 2 + 10, h / 2, 4, 8);

      // Roue avant
      ctx.fillRect(w / 2 - 15, h / 2, 4, 8);
      ctx.strokeRect(w / 2 - 15, h / 2, 4, 8);
    }
    ctx.stroke();

    // Ailes
    ctx.fillStyle = "#AEB6BF";
    ctx.beginPath();
    ctx.moveTo(-5, -h / 2);
    ctx.lineTo(15, -h * 1.2);
    ctx.lineTo(20, -h * 1.1);
    ctx.lineTo(5, -h / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-5, h / 2);
    ctx.lineTo(15, h * 1.2);
    ctx.lineTo(20, h * 1.1);
    ctx.lineTo(5, h / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Empennage vertical
    ctx.beginPath();
    ctx.moveTo(-w / 2 + 8, 0);
    ctx.lineTo(-w / 2 - 2, -h);
    ctx.lineTo(-w / 2 + 2, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
}

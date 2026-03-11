# Flight Sim Pro

Flight Sim Pro est un simulateur de vol en 2D développé en JavaScript pur, HTML et CSS. Il propose deux scénarios distincts : le décollage et l'atterrissage, avec un modèle physique simplifié mais réaliste et un tableau de bord interactif.

## Fonctionnalités

- **Deux Scénarios de Jeu :**
  - **Décollage :** Mettez les gaz, atteignez la vitesse de rotation et décollez avant la fin de la piste. La mission est réussie en atteignant une altitude de sécurité.
  - **Atterrissage :** Prenez le contrôle d'un avion en approche après une phase de pilote automatique, et posez-le en toute sécurité sur la piste.
- **Modèle Physique Détaillé :**
  - **Portance (Lift) :** Générée par la vitesse et affectée par l'angle d'attaque (pitch) et la position des volets.
  - **Traînée (Drag) :** Composée de la résistance de l'air de base, de la traînée induite par l'angle, et de la traînée ajoutée par les volets et le train d'atterrissage.
  - **Poussée (Thrust) :** Contrôlée progressivement par le joueur.
  - **Gravité (Gravity) :** Force constante tirant l'avion vers le sol.
- **Systèmes de l'Avion :**
  - **Volets (Flaps) :** 3 positions (0°, 15°, 30°) pour augmenter la portance et la traînée à basse vitesse.
  - **Train d'atterrissage rétractable :** Doit être sorti pour atterrir. Le rentrer en vol réduit la traînée.
  - **Consommation de carburant :** Le carburant diminue en fonction de la poussée du moteur. Une panne sèche entraîne l'arrêt du moteur.
- **Tableau de Bord Complet :**
  - Altimètre, Anémomètre (vitesse), Variomètre (vitesse verticale).
  - Indicateur d'attitude (horizon artificiel).
  - Jauges visuelles pour la poussée et le carburant.
  - Indicateurs textuels pour l'état des volets et du train.
- **Analyse d'Atterrissage :**
  - Le jeu évalue la qualité de l'atterrissage (Parfait, Bon, Brutal) ou détecte les échecs (Crash, Atterrissage manqué, Sortie de piste).
- **Moteur Audio Immersif :**
  - Son du moteur dont le volume et la tonalité varient avec la poussée.
  - Sons distincts pour l'atterrissage et le crash.

## Comment Lancer le Projet

Ce projet utilise les modules ES6 (`import`/`export`), il ne peut donc pas être lancé en ouvrant directement le fichier `index.html` dans le navigateur (cela causerait des erreurs de type CORS).

La méthode recommandée est d'utiliser un serveur de développement local.

1.  **Avec Visual Studio Code :**
    - Installez l'extension Live Server.
    - Ouvrez le dossier du projet dans VS Code.
    - Faites un clic droit sur le fichier `index.html` et sélectionnez "Open with Live Server".

2.  **Avec Python :**
    - Ouvrez un terminal dans le dossier racine du projet.
    - Exécutez la commande : `python -m http.server`
    - Ouvrez votre navigateur et allez à l'adresse `http://localhost:8000`.

3.  **Avec Node.js :**
    - Installez `serve` globalement : `npm install -g serve`
    - Ouvrez un terminal dans le dossier racine du projet.
    - Exécutez la commande : `serve`
    - Ouvrez l'adresse indiquée dans le terminal.

## Structure du Projet

```
├── html/
│   ├── landing.html       # Page du scénario d'atterrissage
│   └── takingoff.html     # Page du scénario de décollage
├── js/
│   ├── Game.js            # Classe de base pour la simulation
│   ├── LandingGame.js     # Logique spécifique à l'atterrissage
│   ├── TakeoffGame.js     # Logique spécifique au décollage
│   ├── Plane.js           # Cœur de la simulation : physique et état de l'avion
│   ├── config.js          # Toutes les constantes physiques et de jeu
│   ├── controls.js        # Gestion des entrées clavier
│   ├── ui.js              # Mise à jour des éléments du tableau de bord (DOM)
│   ├── audio.js           # Gestion des sons (Web Audio API)
│   ├── drawing.js         # Fonctions de dessin sur le canvas
│   ├── background.js      # Gestion des nuages en parallaxe
│   ├── context.js         # Références centralisées aux éléments du DOM
│   ├── script.js          # Point d'entrée du menu principal (index.html)
│   ├── landing-main.js    # Point d'entrée pour landing.html
│   └── takeoff-main.js    # Point d'entrée pour takingoff.html
├── sounds/
│   ├── engine.wav         # (À ajouter) Son du moteur en boucle
│   ├── landing.wav        # (À ajouter) Son de l'atterrissage
│   └── crash.wav          # (À ajouter) Son du crash
├── index.html             # Menu principal de sélection du scénario
└── style.css              # Feuille de style globale
```

## Concepts Clés et Passages Complexes

### Moteur Physique (`Plane.js`)

Le cœur de la simulation réside dans la méthode `update()` de la classe `Plane`. À chaque frame, elle calcule les forces qui s'appliquent à l'avion pour déterminer sa nouvelle vitesse et sa position.

1.  **Traînée (Drag) :** La vitesse de l'avion est d'abord réduite par la résistance de l'air. Cette résistance est une combinaison de :
    - La traînée de base (`AIR_RESISTANCE`).
    - La traînée induite par l'angle de l'avion (`INDUCED_DRAG_FACTOR`).
    - La traînée ajoutée par les volets (`FLAPS_DRAG`) et le train (`GEAR_DRAG`).

2.  **Poussée (Thrust) :** La force du moteur est ensuite appliquée, augmentant la vitesse horizontale et légèrement la vitesse verticale en fonction de l'angle de l'avion.

3.  **Gravité :** Une force constante tire l'avion vers le bas, augmentant sa vitesse verticale (`velY`).

4.  **Portance (Lift) :** C'est la force qui s'oppose à la gravité. Elle est calculée en fonction de la vitesse horizontale (`velX`) et modifiée par l'angle de l'avion (`pitch`) et la position des volets (`flaps`). Un angle positif (nez vers le bas) réduit la portance, tandis qu'un angle négatif (nez vers le haut) l'augmente.

### Gestion des États de Jeu (Héritage)

Le projet utilise un modèle de classe simple pour gérer les différents scénarios :

- `Game.js` est la classe parente. Elle contient la boucle de jeu principale (`gameLoop`), la logique de rendu et les méthodes de base.
- `TakeoffGame.js` et `LandingGame.js` héritent de `Game`. Elles surchargent des méthodes clés pour implémenter leur propre logique :
  - `reset()`: Pour positionner l'avion au bon endroit au début.
  - `checkGameRules()`: Pour définir les conditions de victoire ou de défaite propres à chaque scénario (ex: atteindre 500ft au décollage, sortir de la piste à l'atterrissage).
  - `handleScenarioControls()`: Pour gérer des cas spécifiques comme le pilote automatique.

Cette approche permet de garder le code de la boucle de jeu générique et de confiner la logique de chaque scénario dans son propre fichier.

### Modularité (Modules ES6)

Le code est entièrement modulaire grâce à `import` et `export`. Chaque fichier a une responsabilité unique (physique, contrôles, UI, etc.), ce qui rend le code plus facile à lire, à déboguer et à faire évoluer. Les fichiers `*-main.js` agissent comme des points d'entrée qui assemblent les différents modules pour lancer une simulation.

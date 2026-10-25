# Shadow Protocol

A side-scrolling stealth-action game about elevators, inspired by classic arcade spy games. This is the first playable vertical slice: one tower, three floors, one mission.

The whole game is a single `index.html` file with no build step and no dependencies. Open it in a browser to play.

## The mission

You come in through the roof of Halvorsen Tower.

1. Take the dossier from behind the red door on 2F.
2. Hack the security terminal on 2F to unlock elevator access to 1F.
3. Leave through the 1F lobby exit.

Optional goals: trigger no alarms, kill no one, and recover both intel folders.

## Controls

| Action | Keyboard | Touch |
| --- | --- | --- |
| Move | A / D or ← / → | ◀ ▶ |
| Crouch | S or ↓ | ▼ |
| Ride elevator | W / S inside the car | ▲ ▼ |
| Act (hide, hack, takedown, call elevator) | E | ACT |
| Fire | Space | FIRE |
| Reload | R | RELOAD |
| Throw decoy | Q | DECOY |
| Pause | P or Esc | II |

## What's in the slice

- An elevator that physically carries you between floors, with call buttons, a restricted floor, and a shutdown during lockdown.
- Two guard types (patrol and heavy) that patrol, investigate noises, search, fight, and react to bodies.
- A noise system: footsteps, gunfire, fuse boxes, and throwable decoys.
- A sweeping security camera that triggers a building lockdown with reinforcements.
- A three-stage timing hack that keeps the world running while you work.
- Fuse boxes that cut a floor's lights: the camera goes blind, guards switch to flashlights, and someone comes to turn the lights back on.
- Silent takedowns, doorway hiding, and crouching under high shots.
- Alert levels (Normal → Suspicious → Alert → Lockdown) that cool down over time.
- A debrief screen with a stealth grade and best score (stored locally in the browser).

All art is drawn in code and all sound is synthesized, so there are no external assets.

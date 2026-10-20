# Factory Protocol — Project Bible

## Project purpose
Factory Protocol is a mobile-first educational RPG for English practice in technical/professional contexts. The current campaign focuses on Industrial Automation, but the architecture is intended to support future campaigns for Administration, Human Resources, Web/Internet Computing, Electronics/Electrotechnics, and a football RPG.

## Core design principle
English must affect gameplay directly. The game should never feel like “play for a while, then answer an English exercise.” English appears naturally through HMI messages, maintenance logs, NPC dialogue, manuals, warnings, datasheets, radio messages, emails, reports, and technical communication. Correct comprehension should improve the player's odds, options, safety, efficiency, or rewards.

## Gameplay loop
Briefing → investigation/evidence → decision → optional card/tool use → English interpretation → D20/check → consequence → world reaction → next decision → mission result.

## Resolution model
A typical check is based on:
- D20 roll
- relevant character attribute
- English comprehension bonus
- card/equipment bonus
- contextual modifiers
- target difficulty

Natural 20 produces Critical Success. Natural 1 produces a Complication rather than automatically invalidating a technically correct decision.

## Fail-forward and consequences
Failure should usually move the mission forward with a cost rather than immediately ending the run. However, unsafe or repeated bad decisions can cause severe consequences or Mission Failed / Emergency Shutdown.

Persistent mission-performance indicators:
- Efficiency
- Safety
- Production
- Downtime
- Mission XP potential

Career XP already earned is not removed. Bad decisions reduce mission reward and can damage reputation.

## Backtracking philosophy
Review is free and allows the player to inspect previous briefing, logs, events, and decisions.

Backtracking is not undo. Returning to a previous decision point keeps previous consequences, consumes time, and can reduce Efficiency and mission XP. The Mission Log records the diagnostic path.

## Player attributes
Current core attributes:
- TECH
- DIAGNOSTICS
- COMMUNICATION

English is not a permanent numerical attribute. English performance creates contextual gameplay bonuses.

## Persistent reputation
- Safety
- Reliability
- Teamwork

These persist between missions and allow players at the same level to develop different professional profiles.

## Career progression
- Levels 1–2: Trainee Technician
- Levels 3–4: Junior Technician
- Levels 5–7: Automation Technician
- Levels 8–10: Senior Technician
- Levels 11–14: Automation Specialist
- Level 15+: Lead Automation Specialist

XP, level, career title, mission unlocks, and card unlocks are separate systems.

## Character card system
The player has a Technician character card with a central portrait. The player may choose a masculine or feminine avatar. The portrait and equipment evolve gradually with career progression: uniform, tools, tablet, headset/AR equipment, confidence/posture, card frame, and visual prestige.

Character-card evolution should never be triggered merely by unlocking a mission or card.

## Card categories
- Equipment — blue
- Reference — cyan
- Safety — amber
- Skill — violet
- Support — green

Current/established card concepts include Multimeter, Wiring Diagram, Sensor Datasheet, Lockout Kit, Second Check, Ask the Senior Tech, Precision Alignment, Portable Pressure Gauge, and Leak Detection Spray.

Cards should increasingly create strategic tradeoffs rather than only flat +2 bonuses.

## Visual direction
Industrial Tactical Interface: industrial automation + plausible near-future sci-fi + tactical RPG.

Palette:
- Graphite Black #090E12
- Industrial Navy #101B24
- Diagnostic Cyan #37D9FF
- System Green #52E39D
- Warning Amber #FFB547
- Fault Red #FF4F58

The interface should feel like an advanced HMI/maintenance tablet rather than a fantasy UI. Red is reserved for faults and danger.

Desktop layout should keep the factory/world reaction visible while decisions/results occur alongside it. Mobile should keep the scene sticky or otherwise visible while action/result UI changes.

## Audio/game feel
Desired layers:
- low-intensity industrial/electronic music
- factory ambience
- UI/card/D20/success/failure/XP SFX
- optional subtle vibration on supported mobile devices

Animations should generally remain under ~1.5 seconds so feedback feels responsive rather than obstructive.

## Campaign structure
The current Industrial Automation campaign is intended to become a first chapter of approximately six missions before expansion to another course.

Current missions:
1. Mission 001 — No Signal — sensor S2 / alignment / maintenance-log English
2. Mission 002 — Overcurrent — motor M3 / load and current / safety
3. Mission 003 — False Trigger — optical sensor S4 / reflective interference / operator interview
4. Mission 004 — Pressure Drop — pneumatic actuator A4 / leak / isolation and depressurization

Planned:
5. Mission 005 — Sequence Error — PLC / sequencing and instructions
6. Mission 006 — Night Shift — combined incident / chapter “boss” mission

## Mission archetypes
Future content should vary among:
- Troubleshooting
- Emergency
- Maintenance
- Commissioning
- Communication
- Optimization

Avoid making every mission “machine breaks → find fault → repair.”

## NPC use
NPCs should provide evidence and professional English, not turn the game into a visual novel. Dialogue can influence Communication, Teamwork, Safety, or available clues.

## Technology architecture
Long-term architecture should separate:
1. core rules/engine
2. content/schema
3. presentation client

Current prototypes are standalone web builds for frictionless testing. The long-term plan remains compatible with a Phaser web client and, potentially, an Unreal Engine 3D client.

The content/rules should be portable even if the presentation layer is rewritten.

## 3D/Unreal compatibility principle
Do not put gameplay rules directly into presentation-specific code. Missions, cards, attributes, conditions, outcomes, and progression should be data-driven so a future Unreal implementation can re-create the rules in C++/Blueprints while reusing the content model.

## Success criterion
The most important playtest question is not “did the software work?” but: “Would the student voluntarily play another mission?”

If the player asks how many questions are left, the design has become an exercise disguised as a game and should be revised.

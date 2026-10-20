# v0.4 modular source

This folder is the maintainable source decomposition of the approved Factory Protocol v0.4 standalone build.

## Structure

- `index.html` — v0.4 entry point.
- `styles-core.css` — core shell, HUD, cards, profile and responsive layout.
- `styles-overlays.css` — results, D20, Mission Log, backtracking and consequence overlays.
- `styles-campaign.css` — campaign hub, reputation, deck builder and mission-specific scene states.
- `assets.js` — logical asset mapping.
- `01-base.js` — helpers and card catalog.
- `02-mission1.js` — Mission 001: No Signal.
- `03-mission2.js` — Mission 002: Overcurrent.
- `04-mission3.js` — Mission 003: False Trigger.
- `05-mission4.js` — Mission 004: Pressure Drop.
- `06-state-model.js` — campaign state, mission metadata and gradual career progression.
- `07-audio.js` — procedural audio/SFX.
- `08-ui-injection.js` — runtime UI overlays and campaign hub shell.
- `09-campaign-hub.js` — mission selection, deck builder and reputation display.
- `10-ambient.js` — ambient canvas effects.
- `11-state-runtime.js` — persistence, metrics and mission-state runtime.
- `12-scene-reactions.js` — factory/world visual reaction states.
- `13-rendering.js` — choices, contextual English, cards and D20 checks.
- `14-log-backtrack.js` — review, Mission Log and non-undo backtracking.
- `15-end-states.js` — ratings, rewards, unlocks, level-up and promotions.
- `16-boot.js` — boot sequence and event bindings.

## Binary assets

The GitHub connector used for the initial import supports UTF-8 source writes but does not expose a general binary-file upload action. For that reason, the exact approved standalone build and its binary visual assets are preserved in the persistent ChatGPT Library:

- `/Projetos/Factory Protocol/Releases/v0.4/factory-protocol-v0.4-standalone.html`
- `/Projetos/Factory Protocol/Art/`

`ASSET-MANIFEST.json` records the SHA-256 hashes of the exact standalone build and every extracted image asset. This allows the source and approved binary snapshot to be reconciled without ambiguity.

The approved standalone SHA-256 is:

`a9d310c0e011d01a6751d4f9298c569a57c1c71df4d107b6bd5cb89c1fc7d2d2`

## Continuity

Before modifying game architecture, read `/docs/PROJECT-BIBLE.md`, `/docs/DECISIONS-LOG.md`, `/docs/CONTINUITY.md`, and `/schema/mission-schema-v1.json`.

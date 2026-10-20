# Factory Protocol v0.4 — Campaign Foundation

This build expands the campaign from two to four missions and formalizes the reusable Mission Schema v1.

## Playable campaign

1. Mission 001 — **No Signal** — photoelectric sensor troubleshooting.
2. Mission 002 — **Overcurrent** — motor/VFD symptom vs mechanical load.
3. Mission 003 — **False Trigger** — optical interference, operator interview and calibration.
4. Mission 004 — **Pressure Drop** — pneumatic leak, energy isolation and safe repair.

Missions unlock sequentially. Existing v0.3.1 progression is migrated automatically when available.

## New systems

- Mission Schema v1 metadata (`schemaVersion`, archetype, objectives, English focus, NPC, prerequisites and unlocks).
- Basic NPC communication nodes.
- Persistent career reputation: **Safety**, **Reliability**, **Teamwork**.
- Two new unlockable cards: **Portable Pressure Gauge** and **Leak Detection Spray**.
- Mission cards in Shift Control now show archetype, English focus and NPC presence.
- Same fail-forward, backtracking, downtime and performance systems from v0.3.1.

## Repository structure

- `docs/` — project bible, continuity handoff, decision log and roadmap.
- `schema/mission-schema-v1.json` — reusable mission-data contract.
- `releases/v0.4/` — approved v0.4 campaign metadata and playable standalone build.
- `art/` — approved visual references when present.

## Validation

- 4 mission graphs.
- 42 mission states.
- 75 `next` transitions validated.
- 10 unique card IDs.
- All mission unlock cards exist.
- JavaScript syntax checked with Node.js.

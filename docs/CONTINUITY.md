# Factory Protocol — Continuity / Handoff Note

Use this file to resume the project in a new ChatGPT conversation if the current chat reaches its limit.

## Resume instruction
Continue development of Factory Protocol from the approved v0.4 baseline. Read PROJECT-BIBLE.md, DECISIONS-LOG.md, ROADMAP.md, the v0.4 README, mission-schema-v1.json, and campaign-metadata-v0.4.json before changing architecture or gameplay rules.

## Current status
The Industrial Automation campaign contains four playable missions and uses a shared mission engine. Mission 003 and Mission 004 were added specifically to validate engine reuse and introduce NPC/reputation mechanics.

The next planned work is v0.5: Mission 005 — Sequence Error and Mission 006 — Night Shift, then a six-mission classroom playtest package.

## Do not regress these approved behaviors
- Backtrack is not undo.
- Previously earned XP is not removed by mission mistakes.
- Unsafe choices can create secondary faults or Mission Failed.
- Factory/world visuals should react to player decisions.
- Desktop should avoid excessive scrolling and preserve world/action context.
- Career title is determined by level thresholds, not mission/card unlocks.
- Technician card supports masculine/feminine avatar paths and gradual career evolution.
- English should remain embedded in professional context rather than detached quiz screens.
- New missions should conform to Mission Schema rather than introducing one-off engine logic when avoidable.


## 2026-10-23 — v0.5.1 Tool Dependency Update

Current development release: v0.5.1, derived from the approved v0.5 standalone. The old v0.4 resume instruction above is historical. Preserve v0.5 and v0.5-beta1 intact. The approved cinematic image payloads and all six missions are preserved.

Decks accept 0–4 cards, with a maximum of four and a non-blocking LIMITED LOADOUT warning. Unlocks do not auto-fill intentionally small decks. A resource must be unlocked, carried, selected and actually used with a charge before its evidence is revealed. Card selection previews only the effect. D20/support cannot bypass the required resource.

Voltage/current/continuity require Multimeter; pressure requires Pressure Gauge; small leak localization requires Leak Detection Spray; exact alignment requires Precision Alignment; wiring routes/terminal traces require Wiring Diagram; sensor specifications require Sensor Datasheet; sequence/interlock semantics require PLC Sequence Reference; thermal/load trends require Thermal Trend. VISUAL INSPECTION ONLY, TOOL REQUIRED and MEASUREMENT AVAILABLE communicate access. Existing HMI/VFD/log values remain available with explicit provenance.

All six missions have empty-deck paths, with seven extra manual investigation nodes and downtime where useful. The S6 alternative adds visible retained connector service marks rather than supplying a concealed circuit trace. Authorized site isolation services control access when the player lacks an instrument; no free test result is supplied. Charges, D20, support costs, reputation, XP, career progression and non-undo backtracking remain active.

Saves write only fp-v051-*; stable v0.5 is a read-only migration source. Beta data is untouched. Distribution: releases/v0.5.1 standalone HTML and ZIP. Validation: JavaScript syntax, six graphs / 71 nodes / 17 checks, 585 assertions, 36 resource uses, 144 access restrictions and six actual empty-deck playthroughs, without browser errors. Embedded artwork payloads are identical to the approved baseline. See VALIDATION.json.

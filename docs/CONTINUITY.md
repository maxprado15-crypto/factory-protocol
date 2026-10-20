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

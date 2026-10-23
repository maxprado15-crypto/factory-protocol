# Factory Protocol — Decisions Log

## Approved baseline
Current approved development baseline: v0.4 — Campaign Foundation.

## Major approved decisions
1. Build one reusable educational RPG engine rather than separate codebases for every course.
2. Industrial Automation is the first campaign and validation environment.
3. Mobile-first web/PWA is the initial delivery route; native-store publishing is deferred.
4. Keep game logic/data separate from the presentation layer to preserve future Phaser/Unreal portability.
5. English must change gameplay outcomes rather than appear as detached quiz sections.
6. D20 adds uncertainty, but player knowledge and correct technical/English decisions must matter more than luck.
7. Use fail-forward for ordinary mistakes; unsafe/repeated bad decisions can produce major failure states.
8. Review and Backtrack are different. Review is informational; Backtrack keeps prior consequences and adds cost.
9. Player performance includes Efficiency, Safety, Production, Downtime, and Mission XP.
10. Do not subtract previously earned career XP for a bad choice; reduce current mission reward instead.
11. Track Safety, Reliability, and Teamwork as persistent reputation.
12. Separate XP, Level, Career Title, Mission Unlocks, and Card Unlocks.
13. Career ladder is deliberately slow: Trainee → Junior → Automation Technician → Senior → Automation Specialist → Lead Automation Specialist.
14. Player Technician card supports masculine and feminine avatars with gradual visual evolution.
15. Desktop UI should keep the factory scene visible while actions/results happen; mobile should preserve the world/action connection with sticky/overlay patterns.
16. Consequences should make the factory react visually, not only show text.
17. Cards use category color language: Equipment blue, Reference cyan, Safety amber, Skill violet, Support green.
18. Use a standardized Mission Schema to make new missions primarily content work rather than engine work.
19. Complete the first Automation chapter before multiplying campaigns across the other courses.

## Current content state
- Mission 001: No Signal
- Mission 002: Overcurrent
- Mission 003: False Trigger
- Mission 004: Pressure Drop
- Mission Schema v1 introduced in v0.4
- 10 cards in the v0.4 content set

## Next intended milestone
v0.5 / Chapter One expansion:
- Mission 005 — Sequence Error
- Mission 006 — Night Shift
- stronger chapter/campaign map
- more meaningful deck strategy
- more avatar/career art stages
- continued playtest and balance work


## 2026-10-23 — v0.5.1 approved scope / implementation decisions

- Supersedes the historical development baseline above; derive v0.5.1 from approved v0.5 and preserve both v0.5 and v0.5-beta1.
- A deck may contain zero to four cards; only the maximum is enforced. LIMITED LOADOUT is advisory. Unlocks require explicit player selection.
- Resource evidence requires actual use, including a charge; previews reveal no results. Ownership, carrying and use are separate checks. Locked or exhausted resources remain unavailable.
- Use explicit per-check toolEvidence contracts, independent of generic tag bonuses. Reference, support, safety, reroll and high D20 results never substitute for a measuring instrument.
- Preserve existing HMI/VFD/log readings with source labels; physical readings and newly derived instrument/reference data require the corresponding resource.
- Distinguish visual evidence and hypotheses from measured confirmation throughout choices, quizzes, results, reports, review/log and scene labels in all six missions.
- Longer alternatives add seven manual nodes and downtime. S6 gains visible retained connector service marks for its no-diagram route; isolated tube removal can reveal visible damage without claiming active small-leak localization. Authorized site isolation services handle access if the player lacks the required absence-of-voltage instrument.
- Keep the D20 formula, charges, support costs, Second Check, mission/card unlock order, XP ladder, reputation and non-undo backtracking. Correct the inherited audio-save namespace bug while isolating all writes to fp-v051-*.
- Archive the exact approved v0.5 standalone alongside the new release for reproducible builds. Do not modify earlier release files or image payloads. Validate graph targets and executable no-card/resource paths in the built standalone.

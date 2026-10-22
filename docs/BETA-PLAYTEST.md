# Factory Protocol — External Beta Playtest

## Current beta

- Build: `v0.5-beta1`
- Stable baseline preserved: `v0.5`
- Purpose: first external playtest with a colleague
- Distribution: standalone HTML package
- Persistent artifact: ChatGPT Library `/Projetos/Factory Protocol/Releases/v0.5-beta1`

## Feedback form

https://docs.google.com/forms/d/e/1FAIpQLSfsbcDV5WtGrVYepxSYGOoN3AYkJiJ61YCdJIGpwaNakjkYdw/viewform

The form does not collect respondent email automatically.

## Tester instructions

1. Open `factory-protocol-v0.5-beta1.html` in a current Chrome, Edge, or Firefox browser.
2. Begin at Mission 001 and play without coaching from the project author.
3. Experiment with different field-deck cards and observe whether they materially change diagnostic reasoning.
4. Notice whether English feels integrated into the work context rather than appearing as a separate quiz.
5. Report bugs, confusing decisions, unclear consequences, difficulty problems, visual issues, and strong/weak missions through the feedback form.

## Beta-specific changes

- Clear `BETA BUILD · v0.5-beta1` identification.
- First-run playtest instructions.
- In-game `BETA INFO` and `BETA FEEDBACK` controls.
- Dedicated beta save namespace (`fp-v05b1-*`) with migration fallback from v0.5.
- Stable v0.5 progress is not overwritten by beta saves.
- Audio preference write corrected to the beta namespace.

## Data handling

The prototype requires no account or server. Game progress is stored in the tester's browser local storage. Feedback is submitted separately through the Google Form.

## Web publication status

A direct GitHub Pages deployment was intentionally not left active after the connector could not transfer the complete visual build reliably through its file-size path. For the first single-tester beta, distribute the standalone playtest ZIP instead of a degraded or incomplete web build.

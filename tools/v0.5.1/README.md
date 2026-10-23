# Rebuild and validate v0.5.1

From the repository root:

```sh
python tools/v0.5.1/build.py
node --check tools/v0.5.1/final-script.js
node tools/v0.5.1/validate.cjs
```

The build uses the exact archived approved standalone in releases/v0.5 and the explicit source contracts in src/v0.5.1. It preserves every embedded image payload. The executable validation requires Playwright available to Node and its Chromium browser; CHROME_PATH can select an installed Chrome executable. It uses an isolated headless browser and temporary game state, never the user's normal browser profile.

Validation exercises the built HTML, every transition target, each 0–4-card loadout, every declared resource evidence path, absent/locked/exhausted/unselected resources, six actual empty-deck playthroughs, preview non-disclosure, single-charge consumption, save isolation and non-undo backtracking. Browser snapshots and temporary extracted scripts are ignored by Git.

The ZIP contains only the standalone, README.txt, manifest.json and VALIDATION.json in a Factory-Protocol-v0.5.1 folder. It uses standard deflate compression. SHA-256 values are recorded in the manifest and validation report.

# Factory Protocol v0.4.1 — Scene & Card Systems Upgrade

## Visual scenes
Each current mission now has its own technical scene profile:
- M001: S2 photoelectric sensor station.
- M002: M3 motor + VFD overcurrent section.
- M003: S4 optical packaging / reflective false-trigger section.
- M004: A4 pneumatic cylinder / pressure-drop and leak section.

The beacon, focus ring and diagnostic overlays move to mission-relevant positions.

## Card system
Cards no longer disappear after first use. Charges reset at mission start and are not refunded by backtracking.

Uses per mission:
- Multimeter: 3
- Wiring Diagram: 3
- Sensor Datasheet: 3
- Lockout Kit: 2
- Second Check: 2
- Ask the Senior Tech: 2
- Precision Alignment: 2
- Thermal Trend: 3
- Portable Pressure Gauge: 3
- Leak Detection Spray: 2

Selecting a relevant card now changes the check before the roll. Depending on the card it can:
- reduce target difficulty;
- add a numeric bonus;
- reveal contextual evidence;
- enable a reroll;
- reveal a focused hint;
- add a time cost for support.

## Compatibility
v0.4.1 reads existing v0.4 progress and then saves to new `fp-v041-*` keys.

## Validation
- 16 game modules concatenated and checked with `node --check`.
- Standalone JavaScript checked after inlining.
- Four SVG scene assets rendered successfully for preview.

## Release hashes
- standalone SHA-256: `87f9f5f776530eb87d27729acb8886819bacd38b80c5df6e10747b915dce9bc3`
- zip SHA-256: `956227f27e2fde7730dab6a1f495ae9cd340db515ef311debbd4c1f7c151ea19`

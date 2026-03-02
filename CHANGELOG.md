# Changelog

All notable changes to this project will be documented in this file.

## [0.3.0] - 2025-10-24

### Added

- `Note.fromMidi()` and `Note.fromFrequency()` constructors
- `isValidNote` and `isValidInterval` utility functions
- TypeDoc documentation generation (`npm run docs`)
- GitHub Actions CI workflow (test, lint, format, type check, build)

### Changed

- Code quality improvements and Biome formatting applied throughout
- Type-safe chaining enforced in `search` function

## [0.2.0] - 2025-10-23

### Added

- TypeScript support with strict mode and full type coverage
- Auto-generated `.d.ts` type declaration files for package consumers

### Changed

- Replaced Jest with Vitest (better ESM and TypeScript support)
- Replaced ESLint with Biome (linting only, formatting disabled)
- Modernized project setup: native ESM, updated Node.js requirements (>=18.0.0)

## [0.1.0] - 2021-02-21

Initial release.

### Added

- `Note` class with scientific pitch notation, transposition, frequency and MIDI conversion
- `Interval` class with music theory shorthand, arithmetic, and enharmonic equivalence
- `NoteList` class for ordered note sequences with transposition, filtering, and sorting
- Search module with bitmask-based reverse lookup for scales and chords
- ~190 scale definitions and ~244 chord definitions
- Convenience functions: `note()`, `notes()`, `interval()`, `scale()`, `chord()`, `search()`
- Full test suite

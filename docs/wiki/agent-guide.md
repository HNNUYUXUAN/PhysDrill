# Agent guide

[Wiki](README.md) · [Architecture](architecture.md) · [Deployment](deployment.md)

## Start here

Read `git status --short`, `package.json`, and the files related to the requested change. Reuse the current React/TypeScript/Vite application. Product copy and course content are Chinese; the two root READMEs describe the same capabilities in Chinese and English.

| Task | Read / edit | Validate |
| --- | --- | --- |
| Training UI or footer | `src/main.tsx`, `src/academic.css` | Typecheck, build, affected desktop/mobile interaction |
| Answer comparison or scheduling | `src/core.ts`, `src/core.test.ts` | Boundary-focused unit tests and training flow |
| Persistence or import | `src/core.ts`, `src/store.tsx` | Backup round trip, draft/session restore, migration tests |
| Question or answer correction | `scripts/bank.mjs`, source Markdown, verification notes | Bank generation, source tests, affected Wolfram evidence |
| Wolfram results | `scripts/wolfram-files.mjs`, `wolfram/`, `src/WolframResult.tsx` | Program/revision matching, diagnostics, exported images |
| Public documentation | Root READMEs, `docs/wiki/`, `docs/assets/README.md` | Links, bilingual facts, real rendered layout |
| Hosting | `vite.config.ts`, `.github/workflows/pages.yml` | Correct base path, static assets, training and refresh |

## Project invariants

- Preserve the original source Markdown bytes and provenance. Maintain extracted answers and corrections in the generator.
- Keep stable question IDs and answer variant IDs. Increment revisions for substantive answer changes and preserve attempt history.
- The bundled bank contains 62 questions (27/18/15/2) and 71 answer programs. Derived syntax exercises retain source links and separate statistics.
- Keep the storage key `physdrill.v1`. Validate whole imports before writing; preserve custom sources during bundled-source migration.
- Sessions retain the selected answer profile, current question, draft, and reveal state across refreshes.
- Check lexical structure precisely: case, brackets, operators, argument order, and meaningful symbol boundaries. Equivalent expressions and comprehensive calculations use self-assessment.
- Render course math through the existing restricted Markdown/KaTeX pipeline. Use recorded Wolfram outputs only when the question, variant, revision, and program match.
- Public introductions describe usage and capabilities. Put audit history in verification records and media provenance in asset notes.

## Commands

From the repository root, with Node.js 24 and npm:

```sh
npm ci
npm run dev
# http://127.0.0.1:5173/PhysDrill/
```

For a release or changes spanning the bank/core:

```sh
npm run lint
npm run typecheck
npm test
npm run bank
git diff --exit-code -- src/data/bank.json
npm run build
```

The bank diff check applies to regeneration-only work; for an intentional bank update, review and commit the generated delta. `npm run preview` shares port 5173 with the dev server, so stop the other service first. Both commands use strict port binding.

## Browser validation

Use the fixed Playwright runtime: Windows `C:\ProgramData\PlaywrightRuntime` with browser files in `C:\ProgramData\ms-playwright`; WSL `/opt/playwright-runtime` with `/opt/ms-playwright`. Chromium is the routine test browser. Report a missing/incompatible runtime rather than installing another revision.

The installed `playwright-cli` can run `scripts/browser-marking.cjs` with `run-code --filename`. This script writes demonstration records into an isolated browser profile and refreshes public screenshots. Use a dedicated test session; preserve the user's everyday browser data.

Check 1440px and 390px layouts, reference matching, correction, next question, paper self-assessment, wrong-answer review, Wolfram expansion, and refresh recovery as applicable. `browser-migration.cjs` checks a pre-existing session; read each script's setup before chaining it. Other scripts cover modes, backup recovery, and baseline navigation.

## Deployment handoff

The primary published entry in documentation is `https://physdrill.yuxuan.wiki`. A domain-root build uses `npm run build -- --base=/`; the default build retains `/PhysDrill/` for GitHub Pages. See [deployment.md](deployment.md) for exact commands, progress transfer, and acceptance checks. Report the verified target and commit separately from infrastructure work still to be performed.

On Windows Git Bash, prefix root-base build and preview commands with `MSYS_NO_PATHCONV=1` to preserve the literal `/` argument. PowerShell and Linux shells accept the ordinary commands above.

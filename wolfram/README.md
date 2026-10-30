# PhysDrill Wolfram sources

本目录公开 62 道来源题的 71 份程序（通用 53、课程 9、现代 9），以及逐题运行脚本和数学纠错测试。

Each source question has a stable ID. Shared answers use `common`; changed plotting APIs have separate `course` and `modern` files. The original course Markdown and the uncorrected source answers remain in the repository and question bank.

## Run / 复现

Requires a licensed Wolfram installation with `wolframscript` on PATH. From the repository root:

```sh
node scripts/wolfram-files.mjs
wolframscript -file wolfram/RunAll.wls
wolframscript -file wolfram/TestCorrections.wls
```

- `questions/*.wl`: generated directly from the structured answer bank. Open or run each in a fresh kernel; programs intentionally preserve the handwritten course syntax and assignments.
- `RunAll.wls`: starts a separate kernel process for every variant, preventing variable contamination and repeated-message suppression across questions.
- `RunOne.wls`: applies a 30-second evaluation limit, records messages, exports graphics at 900px width, and writes a per-program JSON record. To run one: `wolframscript -file wolfram/RunOne.wls C-014 modern`.
- `Corrections.wlt`: six targeted mathematical checks for A23/A24, B11, B13/B14 and D2. These complement the execution audit.
- `TestCorrections.wls`: runs those checks and writes `corrections-test.json`.
- [`../public/wolfram/`](../public/wolfram/): complete JSON report, per-program records, message logs and actual PNG exports. `src/data/wolfram.json` is the identical build-time copy of the complete report.

## Recorded run / 本次结果

2026-10-30, Wolfram 15.0.1 for Microsoft Windows (64-bit), July 2, 2026.

| Scope | Outcome |
|---|---|
| 62 common/modern programs | Evaluated without diagnostic messages |
| 15 plotting questions | All have an exported modern/common image |
| 9 course plotting variants | Missing legacy `Graphics` packages; messages preserved |
| Course PolarPlot / SphericalPlot3D | Built-in command still returns a plot after the package diagnostic |
| Targeted mathematical tests | 6 succeeded, 0 failed |

D1 ends with semicolons; the runner reads `{v2, a2}` after execution to expose the requested values `{14, 12}`. This readout is audit instrumentation, not additional exam content. D2 uses the complete flux derivative and the +Z normal convention.

The executed bank version was 1. Bank version 2 updates the C14 verification note; version 3 migrates source paths and refines explanatory text. The tests check that every published program and revision still exactly matches the current bank.

`evaluated` means execution completed without diagnostic output. `messages` preserves the exact kernel diagnostics, including legacy-package compatibility requirements. Mathematical assumptions and the RegionPlot verification history are in the [verification record](../docs/verification.md).

The web application displays these precomputed assets; training and progress storage run locally in the browser.

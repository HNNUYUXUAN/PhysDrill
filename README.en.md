<p align="center">
  <img src="docs/assets/hnnu-logo.svg" width="360" alt="Huainan Normal University 淮南师范学院">
</p>

# PhysDrill

**Practice Mathematica until you can write it on paper.**

[Study online ↗](https://physdrill.yuxuan.wiki) · [User guide](docs/wiki/usage.md) · [Project Wiki](docs/wiki/README.md) · [简体中文](README.md)

PhysDrill prepares you for handwritten computational physics exams. Recall a program, write it down, check it, and try again—building familiarity with command names, brackets, and argument order. It works on desktop and mobile, with progress saved in your browser.

![Course modules and training overview](docs/assets/overview.png)

## Start with one question

Open the app and select **开始速刷** (Start Quick Drill) for a mixed set of 10 questions. Filter by module or command, then choose random, sequential, or unlimited practice.

| Mode | How it works |
| --- | --- |
| Input drill | Submit your program; a reference match passes, while differences reveal correction cues and a red reference answer |
| Paper recall | Write on paper, reveal the answer, then choose mastered, uncertain, or incorrect |
| Syntax review | Check function names, capitalization, brackets, argument order, and equality signs |

![Answer open: Easy. Answer closed: Give me a second.](docs/assets/meme-cram-en.webp)

## Write, check, correct

The reference program comes first. Expand formulas, derivations, and Wolfram graphics when you need them. Automatic checks compare lexical structure; equivalent expressions and comprehensive calculations use self-assessment.

![Input, correction, a successful match, and wrong-answer review](docs/assets/drill-flow.gif)

![Teacher: Sin[x]. Capital S.](docs/assets/meme-syntax-en.webp)

## Return to the questions that need practice

Incorrect and uncertain answers enter the Wrong Book for focused sessions. Three consecutive confident answers mark a question as mastered; review intervals progress through 1, 3, 7, and 14 days. History stays available after a correct answer or manual removal.

![Wrong Book: We meet again. Me: I've got this one.](docs/assets/meme-review-en.webp)

<p align="center">
  <img src="docs/assets/mobile-drill.png" width="320" alt="Correction cues and a reference program on mobile">
</p>

## 62 course questions, with Wolfram programs

| Module | Questions | Practice |
| --- | ---: | --- |
| Symbolic basics | 27 | Common functions, complex numbers, simplification, expansion, and factorization |
| Solving | 18 | Equations, limits, calculus, series, differential equations, and linear algebra |
| Plotting | 15 | 2D and 3D graphics, vector fields, and inequality regions |
| Comprehensive calculations | 2 | Particle motion, magnetic flux, and induced EMF |

Questions are drawn from the repository's [course material](sources/questions.md). The course profile follows classroom command conventions; the modern profile uses corresponding built-in commands. Identical answers share progress, while different variants track it separately.

All **71 Wolfram programs** include kernel execution records, and all 15 plotting questions have exported graphics. Explore them inside a question or download the programs to rerun them. See the [verification record](docs/verification.md) for legacy-command compatibility and mathematical revisions.

![Wolfram exports: surfaces, gradient fields, and inequality regions](docs/assets/wolfram-gallery.webp)

[Browse programs](wolfram/) · [Run the audit](wolfram/README.md) · [Maintain the question bank](docs/wiki/question-bank.md)

## Keep your progress

The current question, draft, wrong answers, and mastery state save automatically. To switch devices, browsers, or site addresses, export a full JSON backup from **设置与数据** (Settings & Data) and import it at the new location. Back up before clearing browser data.

[Backup and restore steps](docs/wiki/usage.md#backup-and-restore)

## Run locally

Use Node.js 24 and npm:

```sh
git clone https://github.com/HNNUYUXUAN/PhysDrill.git
cd PhysDrill
npm ci
npm run dev
```

Open <http://127.0.0.1:5173/PhysDrill/>. `npm run build` produces a static site in `dist/`; see the [deployment guide](docs/wiki/deployment.md) for a domain-root build.

## Documentation and development

The app and course materials are in Chinese. The Wiki includes an English quick guide and an English agent guide.

| Entry | Contents |
| --- | --- |
| [User guide](docs/wiki/usage.md) | Training, self-assessment, answer profiles, and backups |
| [Architecture](docs/wiki/architecture.md) | State flow, storage, question data, and execution evidence |
| [Agent guide](docs/wiki/agent-guide.md) · [llms.txt](llms.txt) | Code map, maintenance rules, and validation commands |
| [Deployment](docs/wiki/deployment.md) | Custom domain, GitHub Pages, and release checks |
| [Project profile](docs/portfolio.md) · [Asset sources](docs/assets/README.md) | Portfolio notes, screenshots, memes, and university logo |

Built with React · TypeScript · Vite · Tailwind CSS · KaTeX · Vitest.

Maintained by 缪雨轩 · Huainan Normal University

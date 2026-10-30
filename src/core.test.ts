import { describe, it, expect } from "vitest";
import katex from "katex";
import {
  bank,
  bankSchema,
  initial,
  start,
  rate,
  next,
  stats,
  compare,
  submitAnswer,
  correctionHint,
  order,
  eligible,
  syntax,
  key,
  answer,
  importData,
  replaceBank,
  upgradeBank,
  stateSchema,
  type Config,
} from "./core";
const config: Config = {
  profile: "course",
  mode: "input",
  filter: "all",
  category: "A",
  tag: "",
  order: "source",
  length: 10,
};
describe("immediate feedback", () => {
  it("preserves an active draft during a documentation-only bank update", () => {
    const s = start(initial(), config);
    s.session!.draft = "Sin[";
    const b = structuredClone(bank);
    b.questions[0].variants[0].note = "Updated evidence";
    expect(upgradeBank(s, b).session).toEqual(s.session);
    b.questions[0].variants[0].revision++;
    expect(upgradeBank(s, b).session).toBe(null);
  });
  it("records a matching answer once and advances", () => {
    let s = start(initial(), config);
    s.session!.draft = answer(bank.questions[0], "course").program;
    const submitted = submitAnswer(s);
    expect(submitted.attempts).toHaveLength(1);
    expect(submitted.attempts[0].result).toBe("correct");
    expect(submitted.session!.qid).toBe("A-002");
    expect(submitted.session!.draft).toBe("");
  });
  it("retains differences for correction and self assessment", () => {
    const s = start(initial(), config);
    s.session!.draft = "sin[x]";
    const submitted = submitAnswer(s);
    expect(submitted.attempts).toHaveLength(0);
    expect(submitted.session!.revealed).toBe(true);
    expect(submitAnswer(submitted)).toBe(submitted);
    expect(correctionHint("sin[x]", "Sin[x]")).toContain("「Sin」");
    expect(correctionHint("x = 1", "x == 1")).toContain("「==」");
  });
  it("keeps paper, empty answers and complex questions as self assessment", () => {
    for (const c of [
      { ...config, mode: "paper" as const },
      { ...config, category: "D" },
      config,
    ]) {
      const s = start(initial(), c);
      if (c.category === "D")
        s.session!.draft = answer(
          bank.questions.find((q) => q.id === s.session!.qid)!,
          "course",
        ).program;
      const result = submitAnswer(s);
      expect(result.session!.revealed).toBe(true);
      expect(result.attempts).toHaveLength(0);
    }
  });
  it("respects manual next and persists a rated reveal idempotently", () => {
    const s = start(initial(), config);
    s.settings.autoNext = false;
    s.session!.draft = answer(bank.questions[0], "course").program;
    const result = stateSchema.parse(
      JSON.parse(JSON.stringify(submitAnswer(s))),
    );
    expect(result.session!.rated).toBe(true);
    expect(result.session!.qid).toBe("A-001");
    expect(submitAnswer(result).attempts).toHaveLength(1);
  });
});
describe("source bank", () => {
  it("contains exactly all source questions", () => {
    expect(bank.questions).toHaveLength(62);
    expect(
      bank.categories.map(
        (c) => bank.questions.filter((q) => q.categoryId === c.id).length,
      ),
    ).toEqual([27, 18, 15, 2]);
    expect(new Set(bank.questions.map((q) => q.id)).size).toBe(62);
  });
  it("rejects duplicates and missing answers", () => {
    expect(() =>
      bankSchema.parse({
        ...bank,
        questions: [bank.questions[0], bank.questions[0]],
      }),
    ).toThrow();
    const b = structuredClone(bank);
    b.questions[0].variants[0].program = "";
    expect(() => bankSchema.parse(b)).toThrow();
  });
  it("renders every source and corrected formula", () => {
    for (const q of bank.questions)
      for (const t of [
        q.prompt,
        q.originalSolution,
        ...q.variants.flatMap((v) => [v.solution, v.note]),
      ])
        for (const m of t.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$\n]+)\$/g))
          expect(() =>
            katex.renderToString(m[1] || m[2], {
              throwOnError: true,
              displayMode: !!m[1],
            }),
          ).not.toThrow();
  });
  it("keeps original with corrected evidence", () => {
    const q = bank.questions.find((q) => q.id === "A-023")!;
    expect(q.originalAnswer).toBe("Re[a+ib]");
    expect(answer(q, "course").program).toBe("Re[a + I b]");
  });
});
describe("comparison", () => {
  it.each([
    ["Sin[x]", "sin[x]", false],
    ["Sin[x]", "Sin(x)", false],
    ["a==b", "a=b", false],
    ["a b", "ab", false],
    ["2x", "2 x", true],
    ["Log[x,y]", "Log[y,x]", false],
    ["Sin[ x ]", "Sin[x]", true],
    ["x->0", "x- >0", false],
    ['"a b"', '"ab"', false],
    ["a=1\nb=2", "a=1 b=2", false],
    ["DSolve[\n x, y]", "DSolve[x,y]", true],
  ])("%s vs %s", (a, b, r) => expect(compare(a, b)).toBe(r));
  it("strict keeps internal whitespace", () =>
    expect(compare("Sin[ x ]", "Sin[x]", true)).toBe(false));
});
describe("training state", () => {
  it("counts only final assessments, idempotently", () => {
    let s = start(initial(), config);
    expect(stats(s).attempts).toBe(0);
    expect(rate(s, "wrong")).toBe(s);
    s.settings.autoNext = false;
    s.session!.revealed = true;
    s = rate(s, "wrong", new Date(2026, 9, 30));
    expect(stats(s).attempts).toBe(1);
    expect(rate(s, "wrong")).toBe(s);
    expect(s.progress["A-001:common"].active).toBe(true);
    expect(next(s).session!.qid).toBe("A-002");
  });
  it("preserves errors after success and schedules mastery", () => {
    let s = initial();
    for (let i = 0; i < 4; i++) {
      s = start(s, { ...config, length: 1 });
      s.session!.revealed = true;
      s = rate(s, i ? "correct" : "wrong", new Date(2026, 9, 30));
    }
    const p = s.progress["A-001:common"];
    expect(p.active).toBe(true);
    expect(p.wrong).toBe(1);
    expect(p.retries).toBe(3);
    expect(p.streak).toBe(3);
    expect(p.due).toBe("2026-11-06");
  });
  it("syntax does not master full questions", () => {
    let s = start(initial(), { ...config, mode: "syntax" });
    s.session!.revealed = true;
    s = rate(s, "correct");
    expect(stats(s).seen).toBe(0);
    expect(s.attempts).toHaveLength(1);
  });
  it("locks session profile and restores snapshot", () => {
    const s = start(initial(), config);
    s.session!.draft = "Sin[x]";
    s.settings.profile = "modern";
    const restored = stateSchema.parse(JSON.parse(JSON.stringify(s)));
    expect(restored.session!.config.profile).toBe("course");
    expect(restored.session!.draft).toBe("Sin[x]");
  });
  it("revisions retain history and reset mastery", () => {
    let s = start(initial(), config);
    s.session!.revealed = true;
    s = rate(s, "correct");
    const b = structuredClone(bank);
    b.questions[0].variants[0].revision++;
    s = replaceBank(s, b);
    expect(s.attempts).toHaveLength(1);
    expect(s.progress["A-001:common"].streak).toBe(0);
    expect(s.session).toBeNull();
  });
});
describe("selection", () => {
  it("filters source categories and tags", () => {
    expect(eligible(initial(), config)).toHaveLength(27);
    expect(
      eligible(initial(), { ...config, tag: "Sin" }).every((q) =>
        q.tags.includes("Sin"),
      ),
    ).toBe(true);
    expect(eligible(initial(), { ...config, filter: "wrong" })).toHaveLength(0);
  });
  it("weighted rounds have no duplicates", () => {
    const s = initial(),
      ids = bank.questions.map((q) => q.id);
    const a = order(s, { ...config, order: "random" }, ids, () => 0.5);
    expect(new Set(a).size).toBe(62);
    expect(order(s, config, ["A-001", "A-002"], () => 0, "A-001")[0]).toBe(
      "A-002",
    );
  });
  it("handles empty, single and repeated rounds", () => {
    const s = initial();
    expect(start(s, { ...config, tag: "missing" })).toBe(s);
    let n = start(s, { ...config, tag: "Conjugate", length: 3 });
    for (let i = 0; i < 3; i++) {
      n.session!.revealed = true;
      n = rate(n, "correct");
    }
    expect(n.session!.finished).toBe(true);
    expect(n.attempts).toHaveLength(3);
  });
  it("variants are isolated", () => {
    const q = bank.questions.find((q) => q.id === "C-005")!;
    expect(key(q, "course")).not.toBe(key(q, "modern"));
  });
  it("syntax derives a real variant", () => {
    for (const q of eligible(initial(), { ...config, mode: "syntax" })) {
      const x = syntax(q, "course", () => 0.8);
      expect(x.snippet.length).toBeGreaterThan(0);
      if (!x.isOriginal)
        expect(x.snippet).not.toBe(answer(q, "course").program);
    }
  });
});
describe("backup", () => {
  it("roundtrips a full backup", () => {
    const s = start(initial(), config);
    expect(importData(JSON.stringify(s)).data).toEqual(s);
  });
  it("rejects invalid JSON and versions", () => {
    expect(() => importData("{")).toThrow();
    expect(() =>
      importData(JSON.stringify({ ...initial(), schemaVersion: 9 })),
    ).toThrow();
  });
});

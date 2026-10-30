import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import audit from "./data/wolfram.json";
import { bank } from "./core";

describe("published Wolfram evidence", () => {
  it("covers all 62 questions and 71 exact answer programs", () => {
    expect(audit.questionCount).toBe(62);
    expect(audit.records).toHaveLength(71);
    expect(
      new Set(audit.records.map((r) => `${r.qid}:${r.variant}`)).size,
    ).toBe(71);
    for (const q of bank.questions)
      for (const v of q.variants) {
        const r = audit.records.find(
          (r) => r.qid === q.id && r.variant === v.id,
        )!;
        expect(r.program).toBe(v.program);
        expect(r.revision).toBe(v.revision);
        expect(readFileSync(r.source, "utf8").endsWith(v.program + "\n")).toBe(
          true,
        );
        if (r.image) expect(existsSync("public/" + r.image)).toBe(true);
      }
  });
  it("retains all legacy diagnostics and all 15 current plots", () => {
    const current = audit.records.filter((r) => r.variant !== "course");
    expect(current).toHaveLength(62);
    expect(
      current.every((r) => r.status === "evaluated" && r.messages.length === 0),
    ).toBe(true);
    expect(
      current.filter((r) => r.qid.startsWith("C-") && r.image),
    ).toHaveLength(15);
    expect(
      audit.records.filter((r) => r.variant === "course" && r.messages.length),
    ).toHaveLength(9);
  });
});

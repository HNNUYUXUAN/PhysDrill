import { expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { bank } from "./core";

it("preserves source bytes and every question's line provenance", () => {
  for (const [file, hash] of [
    [
      "sources/questions.md",
      "9a2daf60b607e10afe5424030c01bcd6e7846fa6fea0b90de36de4c01f30632d",
    ],
    [
      "sources/notes.md",
      "7481727bf1dbbec75dda5eca07e89d1b9eb4515fc82b2b73f30f5b1cbf81f7a9",
    ],
  ])
    expect(createHash("sha256").update(readFileSync(file)).digest("hex")).toBe(
      hash,
    );
  const lines = readFileSync("sources/questions.md", "utf8").split(/\r?\n/);
  for (const q of bank.questions) {
    expect(q.source.file).toBe("sources/questions.md");
    expect(lines[q.source.lineStart - 1]).toContain(String(q.source.item));
  }
});

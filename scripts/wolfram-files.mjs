import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const bank = JSON.parse(readFileSync("src/data/bank.json", "utf8"));
mkdirSync("wolfram/questions", { recursive: true });
for (const q of bank.questions)
  for (const v of q.variants) {
    const header = `(* PhysDrill ${q.id} / ${v.id} / revision ${v.revision}\nSource: ${q.source.file}, line ${q.source.lineStart}\nGenerated from src/data/bank.json. Run each file in a fresh kernel. *)\n`;
    writeFileSync(
      `wolfram/questions/${q.id}-${v.id}.wl`,
      header + v.program + "\n",
    );
  }
console.log("Generated 71 Wolfram source files for 62 questions.");

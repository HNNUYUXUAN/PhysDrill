import fs from "node:fs";
import crypto from "node:crypto";
const file = "计算物理基础课程复习题库.md";
const raw = fs.readFileSync(file, "utf8");
const text = raw.replace(/\r\n/g, "\n");
const sha256 = crypto.createHash("sha256").update(raw).digest("hex");
const sections = text.split(/^## /m).slice(2);
const categories = ["基础符号", "求解题", "绘图题", "综合计算"];
const corrections = {
  "A-023": ["Re[a + I b]", "ib 是单个符号；虚数单位使用大写 I。"],
  "A-024": ["Im[a + I b]", "ib 是单个符号；虚数单位使用大写 I。"],
  "B-011": [
    "Series[ArcSin[x], {x, 1, 8}]",
    "核验说明：x=1 是分支点，不能作普通 Taylor 展开。本题按广义级数理解，常数计入，取前 9 个非零项。第三参数是阶数，此处取 8。",
  ],
  "B-013": [
    "Maximize[1 - ((x - 2)^2)^(1/3), x]",
    "核验说明：按实数幂解释原式。最大值 1，在 x=2 取得。",
  ],
  "B-014": [
    "Minimize[{1 - ((x - 2)^2)^(1/3), 1 <= x <= 3}, x]",
    "核验说明：按实数幂解释原式。最小值 0，在 x=1 或 x=3 取得。",
  ],
  "D-002": [
    "r = t + t^2;\nb = 1 + Sqrt[t];\nPsi = Pi r^2 b;\nv = -D[Psi, t];\nt = 2;\nSimplify[v]",
    "核验说明：正向法线取 +Z。磁场随时间变化，磁通量应为 $\\Psi=\\pi(1+\\sqrt t)(t+t^2)^2$，感应电动势 $\\varepsilon=-d\\Psi/dt$，故 $\\varepsilon(2)=-3(20+23\\sqrt2)\\pi$。原稿遗漏磁场变化贡献。",
  ],
};
const modern = {
  5: "PolarPlot[Sin[t] + 1, {t, 0, 2 Pi}]",
  6: "ContourPlot[(x^2 + y^2)^2 == x^2 - y^2, {x, 0, 2 Pi}, {y, -1, 1}]",
  9: "ParametricPlot3D[{r Cos[t], r Sin[t], r + Sin[t]^2}, {r, 0, 1}, {t, 0, 2 Pi}]",
  10: "SphericalPlot3D[Sin[r] + Cos[t]^2, {r, 0, Pi}, {t, 0, 2 Pi}]",
  11: "VectorPlot[{Cos[x], Sin[y]}, {x, 0, Pi}, {y, 0, Pi}]",
  12: "VectorPlot3D[{Cos[x], Sin[y], z}, {x, 0, Pi}, {y, 0, Pi}, {z, 0, Pi}]",
  13: "VectorPlot[Evaluate[{D[x^2 + y^2, x], D[x^2 + y^2, y]}], {x, -3, 3}, {y, -3, 3}]",
  14: "RegionPlot[x^2 + y^2 <= 2, {x, -3, 3}, {y, -3, 3}]",
  15: "RegionPlot3D[x^2 + y^2 + 2 x z <= 2, {x, -3, 3}, {y, -3, 3}, {z, -3, 3}]",
};
const questions = [];
sections.forEach((section, ci) => {
  const parts =
    ci === 0
      ? [...section.matchAll(/^(\d+)\. (.+)：`([^`]+)`$/gm)].map((m) => ({
          n: +m[1],
          prompt: m[2],
          answer: m[3],
          original: m[0],
          solution: "",
        }))
      : section
          .split(/^### /m)
          .slice(1)
          .map((part) => {
            const m = part.match(/^(\d+)\. ([\s\S]*?)\n/);
            const code = part.match(/```mathematica\n([\s\S]*?)\n```/);
            if (!m || !code) throw Error("Unrecognized question");
            const before = part.slice(m[0].length, code.index).trim();
            return {
              n: +m[1],
              prompt:
                m[2] +
                "\n\n" +
                before
                  .split("**解：**")[0]
                  .replace(/\*\*Mathematica 程序：\*\*/g, "")
                  .trim(),
              answer: code[1],
              original: part,
              solution: before.includes("**解：**")
                ? before
                    .split("**解：**")[1]
                    .replace(/\*\*Mathematica 程序：\*\*/g, "")
                    .trim()
                : "",
            };
          });
  parts.forEach((p) => {
    const id =
      String.fromCharCode(65 + ci) + "-" + String(p.n).padStart(3, "0");
    const fix = corrections[id];
    const modernCode = ci === 2 ? modern[p.n] : undefined;
    const variant = (variantId, program, note = "") => ({
      id: variantId,
      program,
      solution: id === "D-002" ? fix[1] : p.solution,
      note: fix?.[1] || note,
      revision: fix ? 2 : 1,
      verification: fix
        ? "kernel-verified"
        : modernCode
          ? "documentation-checked"
          : "source-checked",
    });
    questions.push({
      id,
      categoryId: String.fromCharCode(65 + ci),
      title: p.prompt.split("\n")[0],
      prompt: p.prompt,
      answerType: ci === 3 ? "self_assessment" : "mathematica",
      tags: [...new Set(p.answer.match(/[A-Z][a-zA-Z]+(?=\[)/g) || [])],
      source: {
        file,
        section: categories[ci],
        item: p.n,
        lineStart: text.slice(0, text.indexOf(p.original)).split("\n").length,
        sha256,
      },
      originalAnswer: p.answer,
      originalSolution: p.solution,
      variants: modernCode
        ? [
            variant(
              "course",
              p.n === 13 ? "<<Graphics`PlotField`\n" + p.answer : p.answer,
              "课程旧版命令；需要相应旧版 Graphics 软件包。",
            ),
            variant(
              "modern",
              modernCode,
              p.n === 6
                ? "核验补充：y∈[-1,1] 是覆盖完整曲线的显示窗口。"
                : p.n === 14
                  ? "官方命令；本机内核返回内部诊断，图形运行核验待复查。"
                  : "使用现代内置命令。",
            ),
          ]
        : [variant("common", fix?.[0] || p.answer)],
    });
  });
});
if (questions.length !== 62)
  throw Error("Expected 62, got " + questions.length);
fs.mkdirSync("src/data", { recursive: true });
fs.writeFileSync(
  "src/data/bank.json",
  JSON.stringify(
    {
      bankVersion: 1,
      categories: categories.map((name, i) => ({
        id: String.fromCharCode(65 + i),
        name,
      })),
      rules: text.split("---")[0].split("\n").slice(2).join("\n"),
      questions,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  "62 questions: " +
    categories
      .map(
        (_, i) =>
          questions.filter((q) => q.categoryId === String.fromCharCode(65 + i))
            .length,
      )
      .join("/"),
);

# 题库维护

[Wiki](README.md) · [核验记录](../verification.md) · [Wolfram 运行指南](../../wolfram/README.md)

## 来源与生成

主来源为 `sources/questions.md`，整理说明为 `sources/notes.md`。两份原稿按原始字节保存，来源元数据记录文件、章节、题号、行号和 SHA-256。

`scripts/bank.mjs` 负责提取与修订，生成 `src/data/bank.json`。题库共 62 题，A／B／C／D 分别为 27／18／15／2；稳定 ID 从 `A-001` 到 `D-002`。考试规范另存，不计入题数。

```sh
npm run bank
node scripts/wolfram-files.mjs
npm test
```

仅重生成时，检查生成文件与已提交版本一致。答案修订从转换脚本维护，同时保留原答案、依据和核验状态；实质答案变更递增对应修订号，并检查旧进度进入复习的行为。

## 版本与历史

53 份通用答案使用 `common`，9 道版本不同的题分别提供 `course` 和 `modern`，合计 71 份程序。题号、答案版本、修订号共同关联练习记录与运行证据。

题库 v3 将来源迁移到英文路径。路径变更保持原文、程序和答案修订号一致；旧加载与备份导入按来源摘要识别，自定义来源保留。迁移与字节一致性测试位于 `src/core.test.ts`、`src/sources.test.ts`。

## Wolfram 证据更新

1. 运行生成脚本，检查 `wolfram/questions/*.wl` 的程序与来源注释。
2. 在已许可的 Wolfram 环境执行 `RunAll.wls` 与 `TestCorrections.wls`，命令见运行指南。
3. 检查每份诊断、求值结果和绘图窗口；核验数学假设并记录依据。
4. 核对 `public/wolfram/audit.json` 与 `src/data/wolfram.json`，以及题号、版本、修订和完整程序匹配。
5. 执行测试，打开受影响题目，检查参考程序、解答、图形和来源链接。

原始运行记录保存当时的内核与题库版本。现有运行基于 Wolfram 15.0.1：62 份通用／现代程序完成求值，9 份课程旧包程序保留兼容诊断，15 道绘图题均有对应导出图。逐项数学说明和历史诊断集中在[核验记录](../verification.md)。

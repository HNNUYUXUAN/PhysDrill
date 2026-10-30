# 架构与数据

[Wiki](README.md) · [Agent guide](agent-guide.md)

PhysDrill 是静态 React 应用。课程资料经脚本转换为结构化题库，浏览器负责训练、判定、复习和保存。Wolfram 在维护阶段运行，网页读取发布的程序、日志和图片。

```mermaid
flowchart LR
  Source[课程 Markdown] --> Script[bank.mjs]
  Script --> Bank[bank.json]
  Bank --> UI[React 界面]
  Bank --> WL[Wolfram 核验]
  WL --> Evidence[程序 / 日志 / 图形]
  Evidence --> UI
  UI --> Core[比较 / 抽题 / 复习 / 统计]
  Core --> Store[Context 与 localStorage]
  Store --> Backup[JSON 备份与恢复]
```

## 代码地图

| 文件 | 责任 |
| --- | --- |
| `src/main.tsx` | 导航、训练交互、题目详情、导入预览与设置 |
| `src/core.ts` | 数据 schema、答案比较、抽题、练习记录、调度、统计与迁移 |
| `src/store.tsx` | React Context 状态及 localStorage 写入、恢复提示 |
| `src/Overview.tsx`、`src/StatsDetails.tsx` | 首页与统计呈现 |
| `src/WolframResult.tsx` | 按题号、版本、修订号和程序匹配运行证据 |
| `src/academic.css` | 版式、响应式布局与批阅配色 |
| `src/data/bank.json` | 生成的题库、来源和答案版本 |
| `public/wolfram/`、`src/data/wolfram.json` | 公开运行资产与构建时审计副本 |

## 状态与持久化

`physdrill.v1` 是 localStorage 键；状态包含 schemaVersion、bankVersion、题库、attempts、progress、settings 和 session。当前 schema 为 1，内置题库为 3。

每次完成生成唯一 attemptId；揭示答案与浏览题目不计为完成。练习记录携带答案版本和修订号。程序辨析独立记录，整题掌握度使用输入或纸笔训练结果。

活动会话保存候选题、当前位置、模式、锁定的答案版本、草稿和揭示状态。界面更新经过 Store 写入浏览器；写入失败显示状态并保留内存中的数据，供导出恢复。

旧数据按来源路径和摘要迁移到英文路径，稳定题号维持历史关联。来源自定义内容继续保留。加载、导入和答案修订的具体规则由 `src/core.ts` 与对应测试定义。

## 复习与统计

随机训练按掌握状态加权，每轮无放回，下一轮避免紧邻重复，单题池除外。顺序训练遵循原题顺序。答错和不确定重置连续熟练次数；正确复习间隔递增至 14 天。

首页与统计页复用核心统计函数。日期按浏览器本地日历计算；正确率为正确完成次数除以完成次数，程序辨析单列统计。

## 运行边界

网页以静态文件发布，公式字体和图标随构建提供。训练中的程序通过词法比较检查；数学等价和综合计算使用自评。内核执行及其兼容诊断见[核验记录](../verification.md)。

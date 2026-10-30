# 题库核验记录 / Verification record

日期：2026-10-30。内容源为仓库中的两份课程 Markdown；主要来源为《计算物理基础课程复习题库.md》，62 题，27/18/15/2。原始文件保持原文。

## 核验层次

- 来源核对：逐题转换，原程序与原解答独立保留，未增加考试题目。
- 语法解析：Wolfram 15.0.1 Windows 内核读取实际生成 JSON，对全部 62 题的 71 个答案版本调用 `ToExpression[..., InputForm, HoldComplete]`，全部成功。此检查不执行代码，也不证明语义正确。
- 实算：基础 27、求解 18、综合 2 题在独立符号上下文中执行；程序均返回结果。批次出现内核 `Part::pkspec1` 诊断，不能据此声称整批无诊断。D1 末尾分号使整个程序返回 Null，变量值另有计划阶段核验。
- 绘图：现代极坐标、参数曲面、球坐标、矢量场、梯度场、隐函数及区域图已返回相应 Graphics/Graphics3D。RegionPlot 同时返回 `Part::partw` 和 `ParametricRegion::msgs`，仍需进一步图形语义核查。
- 旧命令：当前内核找不到源文列出的 Graphics 软件包；课程版保留历史适用条件，不标为当前内核运行通过。
- Wolfram 上下文检索服务出现内部错误，Evaluator 可用；不影响离线应用运行。

## 已修订条目

| 题号 | 修订与证据 |
|---|---|
| A23/A24 | `ib` 是单个符号，改为 `I b`。实数 a,b 假设下得到 a,b；无假设时结果保留 Re/Im。 |
| B11 | 保持原题面。`Series[ArcSin[x],{x,1,8}]` 含常数共 9 个非零项，最高分数幂 15/2，余项 17/2。x=1 是分支点；采用广义级数解释，不能声称普通 Taylor 展开。 |
| B13/B14 | 按实数幂解释，改为 `1-((x-2)^2)^(1/3)`。最大值 1，x=2；区间最小值 0，x=1 或 3。 |
| D2 | 磁通量为 `Pi r^2 b`，包含面积与磁场变化。t=2 时电动势为 `-3(20+23 Sqrt[2]) Pi`，原式漏掉 `-9 Sqrt[2] Pi`。 |
| C6 现代版 | 原 x 范围不变，补 y 显示范围 [-1,1]。消元所得曲线 y 范围为 ±1/(2√2)，因此窗口覆盖完整曲线。 |

旧版与现代版区别仅用于 API 兼容，已发现的数学错误在两版共用修订答案。

## 代表性求值结果

B1 `x -> -b/a`；B2 `-10+c x+a d x+b d y==0`；B3 `x>=-6/5`；B4 `2/5`；B8 `14`；B9 `Pi^2/6`；B10 `3079296`；B15 `25`；B16 `{-2,1,0}`；B17 `{{-1/5,3/5},{2/15,-1/15}}`；B18 `-1`。

B6 按原课程命令保留 `Dt[...,x]`，其输出包含系数的全导数；这与将参数视作常数的偏导不同，不能将两者静默混同。

## 官方依据

- [Series](https://reference.wolfram.com/language/ref/Series.html)：阶数与广义级数。
- [Operator Input Forms](https://reference.wolfram.com/language/tutorial/OperatorInputForms.html)：符号边界、隐式乘法和运算符。
- [ImplicitPlot compatibility](https://reference.wolfram.com/language/Compatibility/tutorial/Graphics/ImplicitPlot.html)：现代 ContourPlot 替代。

## 应用验收

核心测试覆盖数量、ID、必填、公式、严格/规范比较、随机筛选、错题、调度、修订和备份。真实 Chromium 在 1440×1000 与 390×844 检查草稿刷新、答案揭示、自评、错题入库、导出再导入、答案版本与移动端横向溢出。README 图片来自该验收会话；演示数据仅存在隔离浏览器，不作为新用户初始数据。

28 项单元测试、TypeScript、格式检查、生产构建和首轮 GitHub Actions 均通过。补充浏览器验收覆盖纸笔模式无输入框、默写刷新、程序辨析、辨析错题列表、移出后历史保留、非法 JSON 拒绝。自动化测试的确认弹窗使用隔离页面中的确认桩；应用本身保留确认步骤。依赖审计为 0 项漏洞。

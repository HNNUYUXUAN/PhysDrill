# PhysDrill

**计算物理课程纸笔考试强化训练平台** · [在线刷题](https://hnnuyuxuan.github.io/PhysDrill/) · [English](README.en.md)

![考前回忆：看答案与合上答案](docs/assets/meme-cram-zh.webp)

看题、回忆、写下程序、对照答案，再练一次。PhysDrill 将课程复习资料整理为 62 道可检索题目，提供输入速刷、纸笔默写、程序辨析和错题回炉。所有学习数据保存在本地浏览器。

![PhysDrill 首页，首次使用的零记录状态](docs/assets/overview.png)

## 在线刷题

**[打开 PhysDrill →](https://hnnuyuxuan.github.io/PhysDrill/)**

电脑和手机均可直接访问，无需安装。在线版与本地版的记录分别存储；不同设备的进度可通过设置中的 JSON 备份导出、导入转移。

前端参考 [General Physics Lab](https://hnnuyuxuan.github.io/general-physics-lab/simulations/) 的学术阅读布局：白底、衬线字体、顶部导航和可展开模块目录。

## 开始使用

需要 Node.js 24 和 npm。在项目目录运行：

```sh
npm ci
npm run dev
```

打开 [本地应用](http://127.0.0.1:5173/PhysDrill/)，点击「开始速刷」。无需账户、后端或 Mathematica 安装。依赖首次安装需要网络，应用运行无需外部 API。

```sh
npm test
npm run typecheck
npm run lint
npm run build
npm run preview
```

开发服务和预览均使用 `127.0.0.1:5173/PhysDrill/`，应先停止另一个服务；端口占用时启动失败。生产文件输出到 `dist/`，可由静态 HTTP 服务托管。

## 为反复练习设计

![训练流程：输入、订正、匹配通过、查看错题本](docs/assets/drill-flow.gif)

操作动图按输入、订正、通过和复习顺序展示；素材制作信息见文末链接。

- **62 道来源题**：基础符号 27、求解 18、绘图 15、综合计算 2。
- **即时反馈**：提交后匹配参考程序即记为正确，默认进入下一题；有差异时提示首个待核对符号。
- **答案先行**：红色突出参考程序，蓝色辅助说明；推导、核验和 Wolfram 图形按需展开。
- **输入或纸笔**：可以输入程序，也可以在纸上完成后直接揭示答案。
- **程序辨析**：从已有程序生成确定性大小写、函数、括号、等号及参数顺序练习。
- **连续训练**：模块、命令标签、错题、未练习、待复习筛选；随机或原题顺序；10、20、50、自定义及无限题量。
- **错题回炉**：错误和不确定记录进入错题本；答对和手动移出后，历史记录继续保留。
- **本地恢复**：输入草稿、当前题、自评状态和进度自动保存，刷新可继续。

<img src="docs/assets/mobile-drill.png" alt="手机上的订正提示与红色参考答案" width="320">

## 参考答案与判定

![大小写订正：Sin 的 S 要大写](docs/assets/meme-syntax-zh.webp)

课程原稿保存在 [questions.md](sources/questions.md) 和 [notes.md](sources/notes.md)，正文与摘要保持一致。修订记录保留原答案和说明；实部/虚部、级数项数、实数幂及感应电动势题已按核验结果修正。参见 [题库核验记录](docs/verification.md)。

课程版保留旧课程 API 风格，现代版提供对应内置命令；默认课程版。不同答案的进度独立，相同答案共享进度。会话开始后锁定版本。

输入与参考程序匹配时自动记为正确；有差异时展示订正提示与参考答案，由用户核对后自评。自动检查比较程序的词法结构；等价写法和综合计算由学习者自评。规范模式保留大小写、括号、运算符、参数顺序和符号边界；严格模式还保留内部空白。原稿有歧义时，核验说明会明确采用的解释。

## 错题复习

![错题重练：这回我会了](docs/assets/meme-review-zh.webp)

连续熟练答对 3 次进入已掌握；复习间隔为 1、3、7、14 天。答错当日复习，不确定次日复习。随机模式一轮内不重复，下一轮按掌握状态加权。

## 可复现的 Wolfram 题库

62 道题对应 **71 份 `.wl` 程序**，已逐份用独立 Wolfram 15.0.1 内核运行。通用／现代答案共 62 份均无诊断消息；15 道绘图题都有导出图片。9 份课程版保留旧包加载诊断，其中 2 份仍由内置绘图命令生成图片。关键纠错另有 6 项数学测试。

[浏览全部 Wolfram 文件](wolfram/) · [完整运行记录](public/wolfram/audit.json) · [核验方法与记录](docs/verification.md)

![Wolfram 导出的曲面、梯度场和不等式区域](docs/assets/wolfram-gallery.webp)

界面中点击「展开 Wolfram 图形与运行结果」即可查看。运行输出作为理解辅助，优先记忆考试要求的程序。重跑核验需要自行安装并许可 Wolfram，日常在线刷题无需安装。

```sh
node scripts/wolfram-files.mjs
wolframscript -file wolfram/RunAll.wls
wolframscript -file wolfram/TestCorrections.wls
```

## 本地数据

设置中可以导出题库或完整 JSON 备份，导入前预览并确认。完整备份包含题库、历史、设置及会话；重置练习保留题库和设置。

数据位于当前浏览器当前地址的 `localStorage`，键为 `physdrill.v1`。不同浏览器、域名或端口不会自动共享；清除浏览器数据会删除记录。请定期备份。存储失败会显示提示并提供导出入口。

```mermaid
flowchart LR
  Source[课程 Markdown] --> Convert[转换与修订]
  Convert --> Bank[结构化题库]
  Bank --> App[React 训练界面]
  Bank --> WL[开发期 Wolfram 核验]
  WL --> Evidence[程序 / 输出 / 图形 / 诊断]
  Evidence --> App
  App --> Core[比较 / 抽题 / 复习 / 统计]
  Core --> Local[浏览器 localStorage]
  Local --> Backup[JSON 备份与恢复]
```

题库维护：修改转换规则或修订表后运行 `npm run bank`，然后执行测试；保持题目 ID 稳定，答案实质变更须递增修订号。题库依据课程原稿维护，题目通过稳定 ID 追溯来源。题库 v3 使用英文来源路径，加载旧记录与备份时按来源摘要迁移，延续草稿和练习进度。

## 验证与运行条件

自动测试覆盖题库、公式渲染、程序比较、抽题复习、备份迁移及 Wolfram 文件对应关系。GitHub Actions 执行格式检查、类型检查、测试与生产构建。`scripts/browser-marking.cjs` 使用固定 Playwright Chromium 检查电脑和手机交互。

Wolfram 核验由维护者在本地执行；网页展示预先导出的结果。课程旧绘图包的兼容条件、运行诊断和数学假设见 [核验记录](docs/verification.md)。

## 网站部署

推送到 main 后，GitHub Actions 运行测试和构建，将 `dist/` 自动部署到 GitHub Pages。项目路径为 `/PhysDrill/`，公式字体与图标均随构建发布。部署工作流见 `.github/workflows/pages.yml`。

## 作为一个小作品

PhysDrill 从个人考前复习需求出发，把来源整理、答案版本、快速反馈、复习调度和可复现核验串成一个轻量工具。作品集可使用 [项目介绍](docs/portfolio.md)、页面截图和在线体验链接。界面保持黑白阅读底色，以红色批阅、蓝色说明建立清晰层级。

展示素材来源见 [素材说明](docs/assets/README.md)。

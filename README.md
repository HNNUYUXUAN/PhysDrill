<p align="center">
  <img src="docs/assets/hnnu-logo.svg" width="360" alt="淮南师范学院 Huainan Normal University">
</p>

# PhysDrill

**把 Mathematica 程序练到能在纸上写出来。**

[在线刷题 ↗](https://physdrill.yuxuan.wiki) · [使用指南](docs/wiki/usage.md) · [项目 Wiki](docs/wiki/README.md) · [English](README.en.md)

PhysDrill 是面向计算物理纸笔考试的训练工具。选题、默写、订正、再练，让命令名称、括号和参数顺序成为熟悉的书写习惯。电脑和手机均可使用，进度自动保存在当前浏览器。

![PhysDrill 课程题库与训练概览](docs/assets/overview.png)

## 从一道题开始

打开在线版，点击 **开始速刷**，即可开始一轮 10 题混合练习。按模块或命令标签筛选，选择随机、顺序或无限练习，按自己的节奏重复。

| 练习方式 | 怎样使用 |
| --- | --- |
| 输入速刷 | 写下程序并提交，匹配后通过；出现差异时查看订正提示和红色参考答案 |
| 纸笔默写 | 先在纸上写，再揭示答案，选择「掌握了」「不确定」或「答错了」 |
| 程序辨析 | 判断函数名称、大小写、括号、参数顺序和等号，练习容易写错的细节 |

![考前回忆：看答案的我与合上答案的我](docs/assets/meme-cram-zh.webp)

## 写一遍，订正一遍

参考程序优先展示；公式、推导和 Wolfram 图形可以展开阅读。自动检查比较程序的词法结构；等价写法和综合计算由学习者自评。

![输入、订正、通过和错题复习](docs/assets/drill-flow.gif)

![大小写订正：Sin 的 S 要大写](docs/assets/meme-syntax-zh.webp)

## 把错题练熟

「答错了」和「不确定」会加入错题本，下一轮可以只练这些题。连续熟练答对 3 次标记为已掌握，按 1、3、7、14 天安排复习。答对和手动移出后，历史记录继续保留。

![错题重练：又见面了，这回我会了](docs/assets/meme-review-zh.webp)

<p align="center">
  <img src="docs/assets/mobile-drill.png" width="320" alt="手机上的订正提示与参考程序">
</p>

## 62 道课程题，配套 Wolfram 程序

| 模块 | 题量 | 训练内容 |
| --- | ---: | --- |
| 基础符号 | 27 | 常用函数、复数、化简、展开与因式分解 |
| 求解 | 18 | 方程、极限、微积分、级数、微分方程与线性代数 |
| 绘图 | 15 | 二维与三维图形、矢量场和不等式区域 |
| 综合计算 | 2 | 质点运动、磁通量与感应电动势 |

题目来自仓库中的[课程资料](sources/questions.md)。课程版沿用课堂命令风格，现代版提供对应内置命令；相同答案共享进度，不同答案分别记录。

全部 **71 份 Wolfram 程序**附有内核运行记录，15 道绘图题配有导出图形。可以从题目展开查看，也可以下载程序重跑。旧命令兼容条件与数学修订见[核验记录](docs/verification.md)。

![Wolfram 导出的曲面、梯度场与不等式区域](docs/assets/wolfram-gallery.webp)

[浏览 Wolfram 程序](wolfram/) · [重跑方法](wolfram/README.md) · [题库维护](docs/wiki/question-bank.md)

## 保存学习进度

当前题、输入草稿、错题与掌握状态会自动保存。换设备、浏览器或访问地址时，在「设置与数据」导出完整 JSON 备份，再到新地址导入。清除浏览器数据前也请先备份。

[备份与恢复步骤](docs/wiki/usage.md#备份与恢复)

## 本地运行

使用 Node.js 24 和 npm：

```sh
git clone https://github.com/HNNUYUXUAN/PhysDrill.git
cd PhysDrill
npm ci
npm run dev
```

打开 <http://127.0.0.1:5173/PhysDrill/>。`npm run build` 输出静态网站到 `dist/`；自定义域名根路径的构建方式见[部署指南](docs/wiki/deployment.md)。

## 文档与开发

| 入口 | 内容 |
| --- | --- |
| [使用指南](docs/wiki/usage.md) | 训练、自评、版本选择与备份 |
| [架构与数据](docs/wiki/architecture.md) | 状态流、存储、题库与运行证据 |
| [Agent 指南](docs/wiki/agent-guide.md) · [llms.txt](llms.txt) | 代码定位、维护约定与验证命令 |
| [部署指南](docs/wiki/deployment.md) | 自定义域名、GitHub Pages 与发布验收 |
| [项目介绍](docs/portfolio.md) · [素材来源](docs/assets/README.md) | 作品集介绍、截图、梗图与校徽来源 |

技术栈：React · TypeScript · Vite · Tailwind CSS · KaTeX · Vitest。

维护：缪雨轩 · 淮南师范学院

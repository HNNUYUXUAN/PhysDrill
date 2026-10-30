# 展示素材 / Asset provenance

- `hnnu-logo.svg`：淮南师范学院校徽及校名标识，按原始 SVG 字节取自 [General Physics Lab 的同名素材](https://github.com/HNNUYUXUAN/general-physics-lab/blob/main/docs/assets/hnnu-logo.svg)。该仓库的[来源说明](https://github.com/HNNUYUXUAN/general-physics-lab/blob/main/THIRD_PARTY_NOTICES.md)记录为学校公共资料“淮南师范学院-01.svg”；标识相关权利由淮南师范学院保留。The university logo is reproduced from the linked source SVG; Huainan Normal University retains the rights to its identity marks.

- `meme-{cram,syntax,review}-{zh,en}.webp`：考前回忆、大小写订正和错题重练三组双格梗图，中英文分别配字。2026-10-30 使用 Chrome 内 ChatGPT「README Showcase · 视觉素材」项目的创建图片功能制作，统一猫学生、狗老师及黑白红蓝主色。采用图由网页 PNG 原图转换为 WebP，逐张核对文字、程序大小写与构图。模型标识为 `unknown`。
- `overview.png`、`drill.png`、`mobile-drill.png`、`wolfram.png`、`mobile-wolfram.png`：固定 Playwright Chromium 截取的应用页面，桌面 1440px、手机 390px。练习记录来自隔离验收会话。
- `drill-flow.gif`：输入、订正提示、匹配通过和错题本的操作截图序列，每帧停留 2 秒。
- `wolfram-gallery.webp`：Wolfram 导出图的等比例合集，题号 C-007、C-013、C-014、C-015；原图和运行记录位于 `public/wolfram/`。
- [架构图](../wiki/architecture.md)采用 Mermaid 文本维护，展示课程资料、题库、训练状态与备份之间的数据关系。

候选原图、提示词、摘要和选优记录保存在项目私有素材目录；公开目录收录采用图。课程资料的来源见题目元数据。

The six memes were generated through Create Image in the ChatGPT website, with separate Chinese and English captions. Downloaded PNG originals were reviewed and converted to WebP. Application screenshots use the fixed Chromium runtime; the animation holds each captured frame for two seconds. Wolfram graphics are kernel exports, and the architecture diagram is maintained as Mermaid text. Candidate files and production records remain in the private media workspace. Course provenance is recorded per question.

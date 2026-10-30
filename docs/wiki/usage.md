# 使用指南

[Wiki](README.md) · [在线训练](https://physdrill.yuxuan.wiki)

## 开始一轮练习

1. 首页点击「开始速刷」。默认是课程版、10 题、混合随机。
2. 在「快速训练」选择模块、标签、题量和顺序，也可以限定错题、未练习或待复习题目。
3. 输入程序后提交。与参考程序匹配时记录正确，默认进入下一题；有差异时先看订正提示，再核对红色参考程序并自评。
4. 草稿、当前题和揭示状态随操作保存。刷新后可继续当前会话。

## 纸笔与程序辨析

「纸笔默写」适合先在纸上写程序，再揭示答案。选择「掌握了」「不确定」「答错了」记录本次结果。

「程序辨析」围绕已有程序生成函数名称、大小写、括号、参数顺序或等号练习。成绩独立统计，并关联来源题。

题库目录支持单独查看答案；查看答案本身不增加完成次数。综合计算题通过自评记录结果。

## 版本与判定

设置中可以切换课程版和现代版。课程版沿用课堂旧式 API，现代版使用对应内置命令。新设置作用于下一轮，活动会话继续使用开始时的版本。相同程序共享进度，不同程序分别记录。

自动检查比较程序的词法结构；等价写法和综合计算由学习者自评。默认规范模式允许排版空白差异，保留符号边界、大小写、括号、运算符和参数顺序；严格模式保留内部空白。

## 错题与复习

错误和不确定答案加入错题本。可以重练单题或只抽错题；答对和手动移出后，历史记录继续保留。再次答错会重新加入活动列表。

答错当日到期，不确定次日到期。连续熟练答对的间隔为 1、3、7、14 天，连续 3 次进入已掌握。首页与统计页根据实际完成记录计算数据。

## 答案与图形

先记忆参考程序，再按需展开解答和「Wolfram 图形与运行结果」。图形来自已保存的内核运行，旧课程命令的兼容条件显示在对应记录中。网页训练直接读取这些结果；重跑程序的方法见 [Wolfram 指南](../../wolfram/README.md)。

## 备份与恢复

1. 在原地址打开「设置与数据」，点击「导出完整备份」。
2. 在目标浏览器或地址打开同一页面，使用「导入题库或完整备份」选择 JSON 文件。
3. 阅读导入预览。完整备份会替换目标地址的当前记录；有需要保留的记录时先导出。
4. 点击「确认导入」，核对练习次数、错题和当前会话。

从 GitHub Pages 转到 `https://physdrill.yuxuan.wiki` 时，按以上步骤转移进度。不同浏览器、设备、域名和端口各有独立存储。清除浏览器数据会删除该地址的学习记录。

题库导出只包含题库；完整备份同时包含历史、设置和会话。存储异常时按页面提示导出可恢复数据，再处理存储问题。

## English quick guide

The interface and course material are in Chinese. Select **开始速刷** to start a mixed 10-question drill. **快速训练** contains module, tag, ordering, and session-length controls. **纸笔默写** is paper recall; **程序辨析** is syntax review; **错题本** is the Wrong Book.

Reference matches pass automatically under the default setting. Differences reveal correction cues and the reference program. Self-assessment choices are **掌握了** (mastered), **不确定** (uncertain), and **答错了** (incorrect). Equivalent programs and comprehensive calculations use self-assessment. Course/modern profile changes apply to new sessions.

### Backup and restore

At the old site, open **设置与数据** and select **导出完整备份**. At the new site, choose the JSON file under **导入题库或完整备份**, review the preview, then select **确认导入**. A full restore replaces the target site's existing state, so export that state first if needed. Check your attempts, Wrong Book, and active session afterward. Browser storage is specific to each origin; this transfer also applies when moving from GitHub Pages to the custom domain.

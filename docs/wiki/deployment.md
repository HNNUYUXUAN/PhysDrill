# 部署指南

[Wiki](README.md) · [Agent guide](agent-guide.md)

## 发布目标

| 目标 | 地址 | 构建 base |
| --- | --- | --- |
| 自定义域名，README 主入口 | `https://physdrill.yuxuan.wiki/` | `/` |
| GitHub Pages | `https://hnnuyuxuan.github.io/PhysDrill/` | `/PhysDrill/` |

仓库提供两种静态构建方式。域名的 DNS、HTTPS 和站点根目录由托管环境配置；以下步骤供部署时执行与验收。

## 自定义域名根目录

在仓库根目录使用 Node.js 24：

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build -- --base=/
```

将 `dist/` **里面的内容**发布到站点根目录，包含 `index.html`、`assets/` 和 `wolfram/`。配置 HTTPS 和 `index.html` 首页。应用的页面切换由内部状态管理，入口为 `/`；静态资源请求应返回实际文件与正确 MIME 类型。

本地预览本次根目录产物：

```sh
npm run preview -- --base=/
# http://127.0.0.1:5173/
```

新一轮默认构建会重新生成 `dist/`，部署前核对本次产物的资源路径。根目录发布时，`index.html` 的资源入口应以 `/assets/` 开头。

Windows Git Bash 会转换形似绝对路径的参数，根路径命令请加 `MSYS_NO_PATHCONV=1` 前缀：

```sh
MSYS_NO_PATHCONV=1 npm run build -- --base=/
MSYS_NO_PATHCONV=1 npm run preview -- --base=/
```

PowerShell 与 Linux shell 使用前面的普通命令即可。

## GitHub Pages

`vite.config.ts` 默认 base 为 `/PhysDrill/`。推送 `main` 后，`.github/workflows/pages.yml` 安装锁文件依赖，校验生成题库，执行格式检查、测试、构建，并上传 `dist/` 部署到 Pages。

```sh
npm run build
npm run preview
# http://127.0.0.1:5173/PhysDrill/
```

保留默认配置即可继续发布 Pages；自定义域名构建通过命令行覆盖 base。两个部署入口各自保存浏览器学习数据。

## 从旧地址转移进度

在旧地址「设置与数据」导出完整备份，在新地址导入并确认，然后核对题库、练习次数、错题和会话。具体操作见[使用指南](usage.md#备份与恢复)。

## 发布验收

- 核对部署提交与构建日志，打开首页，检查主脚本、样式、公式字体均成功加载。
- 电脑约 1440px、手机约 390px 检查导航、长公式、程序和按钮。
- 开始顺序训练，输入 `sin[x]` 检查 A-001 订正提示；核对 `Sin[x]` 参考答案。
- 完成一题、进入下一题，填写草稿并刷新，检查恢复；检查错题重练。
- 打开绘图题的 Wolfram 图形，检查图片和 `wolfram/audit.json`。
- 导出备份，再导入预览并恢复，核对统计与会话。
- 页面底部显示项目名称；README 主入口指向自定义域名。

发布状态以目标地址的实测结果为准。维护者可按需记录部署提交、时间与验收结果。

# AGENTS.md

## 项目是什么

NewAPI 模型映射生成器，给 NewAPI / OpenAI 兼容网关配置模型映射用的工具。使用流程：填 API 地址和密钥 → 点击抓取，从上游拉取模型列表 → 用关键词过滤（排除或保留）→ 在右侧双列表里逐行修改映射名称（左列是上游原名，右列是请求名）→ 复制生成的映射 JSON，只保留有变化的条目。

部署在 Cloudflare Workers 上：静态前端 + 一个 `/fetch` 代理接口（前端不能直连上游，跨域和密钥都走这个代理）。

## 设计决策

这些是读代码读不出来的背景，改代码前先看：

- 状态管理不用 Pinia。所有跨组件状态放在 composables 里，用模块级单例变量实现，整个应用就一个实例。
- `/fetch` 在本地开发和生产环境走同一份逻辑。本地没有 Worker 运行时，所以 `vite.config.ts` 里写了一个 `localApi` 插件在 Node 里模拟它；生产环境则由 Cloudflare Worker 处理。两边都调用 `worker/handler.ts` 的 `handleApiRequest`，改接口逻辑只改这一个文件。
- 主题系统的原理：组件里只统一用 zinc/indigo 色阶，换主题时不改组件，而是在根元素上覆盖 Tailwind v4 的 `--color-*` 变量，让所有色阶整体变色。暗色主题的设计原则是保持中性底色，主题个性只体现在点缀色（覆盖 `--color-indigo-*`）和顶部微光晕上，不做整页色罩。
- 加新主题的步骤：在 `src/lib/themes.ts` 的 `THEMES` 里加一条；如果它是深色主题，必须同步更新 `index.html` 防闪烁脚本里的深色主题 id 名单，否则深色用户首屏会闪白。
- 主题的持久化策略：默认跟随系统深浅偏好（系统深色对应暗灰主题），用户手动选过主题后才写入 `nmg_theme`，之后不再跟随系统。
- 映射是按行号实时 zip 计算的：左右两列行数一致才能生成，不一致时在列表下方显示警告并且按钮禁用。已知限制：右列如果有重复名称，映射会静默合并（后者覆盖前者），没有做重复检测。
- 布局宽度用 `max-w-[1400px]` 居中，这是有意选的：比常规窄栏宽，右侧双列表才放得下；又没到无限全宽，避免行太长难读。不要改回窄容器或全宽。

## 部署

本地没有部署命令。流程是推代码到 GitHub，Cloudflare 那边用 Workers Builds 连接仓库，推送后自动执行 `npm run build` 并按 `wrangler.toml` 的配置（入口 `worker/index.ts`，静态资源目录 `dist`）完成部署。

## 默认要求

- 界面文案、代码注释、提交信息一律用中文。
- 图标只用 Lucide，禁止使用 emoji。
- 输入框不放硬编码默认值，用灰色 placeholder 提示格式；「还原配置」按钮用的默认值统一定义在 `useConfig.ts` 的 `DEFAULT_CONFIG`。
- 改完代码必须跑一遍 `npm run check`（vue-tsc 类型检查 + Prettier 校验），过了才算完成。
- 共用样式类（`.card`、`.input`、`.btn-*`、`.icon-*`、`.list-area`）统一定义在 `src/style/main.css` 的 `@layer components` 里，组件里不要再堆重复的工具类。
- TypeScript 是严格模式，并且开了 `verbatimModuleSyntax`，所以导入类型必须写 `import type`。
- 不要给页面加新功能或新板块，这个工具就是一屏完成的事，改动保持现有布局和交互。

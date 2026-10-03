# AGENTS.md

## 项目

NewAPI 模型映射生成器：从 OpenAI 兼容接口拉取模型列表，按关键词过滤，然后在右侧双列表里逐行修改映射名称，最后复制映射 JSON（请求名 → 上游名，只保留有变化的条目）。部署在 Cloudflare Workers 上：静态前端 + 一个 `/fetch` 代理接口。

## 技术栈

- 前端：Vite + Vue 3 `<script setup>` + TypeScript + Tailwind CSS v4 + lucide-vue-next 图标 + vue-sonner 通知。主题系统在 `src/lib/themes.ts`：组件统一用 zinc/indigo 色阶，主题通过在根元素覆盖 Tailwind v4 的 `--color-*` 变量整体换肤。设计原则：暗色主题保持中性底色，个性来自点缀色（覆盖 `--color-indigo-*`）+ 顶部微光晕（`--page-glow`），不做整页色罩。现有 浅色/暖白/纯黑/暗灰/暮紫/琥珀 六套；默认跟随系统深浅偏好（系统深色 → 暗灰），用户手动选过才写入 `nmg_theme`；`index.html` 的防闪烁脚本里有深色主题 id 名单，加主题要同步
- 后端：`worker/index.ts` + `worker/handler.ts`。`POST /fetch` 代理上游 `/v1/models`（15 秒超时），返回排序后的完整模型列表；过滤、映射全部在前端计算
- 状态管理不用 Pinia：composables 里放模块级单例状态

## 常用命令

- `npm run dev`：只跑 vite（端口 5173）。`/fetch` 由 `vite.config.ts` 的 `localApi` 插件在 Node 里实现，与生产 Worker 共用 `worker/handler.ts` 的 `handleApiRequest`
- `npm run build`：构建到 `dist/`
- `npm run check`：vue-tsc 类型检查 + Prettier 校验，改完代码必须跑一遍
- `npm run format`：Prettier 格式化

## 部署

没有本地部署命令。推到 GitHub，在 Cloudflare 用 Workers Builds 连仓库自动构建部署，Cloudflare 会读 `wrangler.toml`（`main = worker/index.ts`，静态资源目录 = `dist`）。

## 代码结构

- `src/lib/`：纯逻辑（api / filter / storage / themes）
- `src/composables/`：useConfig（API 配置）、useFilter（关键词过滤）、useModels（两个列表文本 + 抓取）、useTheme（主题）
- `src/components/`：ConnectCard（左侧配置面板）、ModelMapping（右侧双列表）、KeywordInput（标签式关键词输入）、ThemeMenu（右上角主题菜单）、ui/Switch
- 核心交互：`fetchModels` 抓取后按关键词过滤，源列表填模型、最终列表填对应小写名；`ModelMapping` 里按行号 zip 实时算出映射（行数不一致给行内警告，不生成）；复制映射 / 复制模型列表 / 源转小写填入最终
- localStorage 前缀 `nmg_`：config（API 配置）、filter（关键词）、source / final（两个列表文本）、theme（主题），没有旧版迁移逻辑
- 布局用 `max-w-[1400px]` 居中（比窄栏宽、又不至于把右侧双列表拉得过宽），改动别改回窄容器或无限全宽

## 规则

- 界面文案、注释、提交信息一律中文
- 图标只用 Lucide，禁止 emoji
- 输入框不放硬编码默认值，用灰色 placeholder 提示
- 共用样式类（`.card`/`.input`/`.btn-*`/`.icon-*`/`.list-area`）定义在 `src/style/main.css` 的 `@layer components`，别在组件里重复堆工具类
- TypeScript 严格模式 + `verbatimModuleSyntax`，类型导入用 `import type`
- Prettier 只保留两个非默认项（`singleQuote`、`htmlWhitespaceSensitivity: ignore`），其余全用官方默认值（printWidth 80）；别手写超长行，交给 format
- 不要给页面加新功能或新板块，改动保持现有的一屏布局和交互

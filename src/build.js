const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const jsDir = path.join(__dirname, 'js');

// 合并 JS 文件
const jsFiles = ['config.js', 'utils.js', 'editors.js', 'storage.js', 'api-ops.js', 'ui.js', 'main.js'];
const mergedJs = jsFiles.map((f) => fs.readFileSync(path.join(jsDir, f), 'utf8')).join('\n');

// 读取 CSS 文件
const cssContent = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');

// 读取模板
const template = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');

// 注入 CSS 和 JS
const styleTag = `<style>\n${cssContent}\n</style>`;
const scriptTag = `<script>\n${mergedJs}\n</script>`;

let html = template.replace('{{STYLE_CSS}}', styleTag);
html = html.replace(/<script>\s*\{\s*\{\s*APP_JS\s*;\s*\}\s*\}\s*<\/script>/, scriptTag);

// 写入到根目录的 index.html
fs.writeFileSync(path.join(rootDir, 'index.html'), html);

console.log('✅ 构建完成: index.html');

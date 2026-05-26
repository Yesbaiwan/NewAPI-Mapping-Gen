const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const srcDir = __dirname;

// 检查文件行数
function checkFileLines() {
  console.log('📊 文件行数检查 (限制: 300行)\n');

  const files = [
    'src/template.html',
    'src/styles.css',
    'src/build.js',
    'src/js/config.js',
    'src/js/utils.js',
    'src/js/editors.js',
    'src/js/storage.js',
    'src/js/api-ops.js',
    'src/js/ui.js',
    'src/js/main.js',
    'worker.js',
  ];

  let hasError = false;

  files.forEach((file) => {
    const filePath = path.join(rootDir, file);
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  ${file} - 文件不存在`);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').length;
    const status = lines <= 300 ? '✅' : '❌';

    if (lines > 300) {
      hasError = true;
      console.log(`${status} ${file}: ${lines} 行 (超过300行限制)`);
    } else {
      console.log(`${status} ${file}: ${lines} 行`);
    }
  });

  return hasError;
}

// 检查函数行数
function checkFunctionLines() {
  console.log('\n📊 函数行数检查 (限制: 100行)\n');

  const jsFiles = ['src/js/config.js', 'src/js/utils.js', 'src/js/editors.js', 'src/js/storage.js', 'src/js/api-ops.js', 'src/js/ui.js', 'src/js/main.js', 'worker.js'];

  let hasError = false;

  jsFiles.forEach((file) => {
    const filePath = path.join(rootDir, file);
    if (!fs.existsSync(filePath)) return;

    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    let funcStart = null;
    let funcName = '';
    let braceCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const funcMatch = line.match(/^(?:async\s+)?function\s+(\w+)/);
      const arrowMatch = line.match(/^(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?\(/);

      if (funcMatch || arrowMatch) {
        funcStart = i;
        funcName = funcMatch ? funcMatch[1] : arrowMatch[1];
        braceCount = 0;
      }

      if (funcStart !== null) {
        braceCount += (line.match(/{/g) || []).length;
        braceCount -= (line.match(/}/g) || []).length;

        if (braceCount === 0 && i > funcStart) {
          const funcLines = i - funcStart + 1;
          if (funcLines > 100) {
            hasError = true;
            console.log(`❌ ${file}:${funcStart + 1} - ${funcName}(): ${funcLines} 行`);
          }
          funcStart = null;
        }
      }
    }
  });

  if (!hasError) {
    console.log('✅ 所有函数都在100行以内');
  }

  return hasError;
}

// 运行检查
console.log('='.repeat(50));
console.log('代码规范检查');
console.log('='.repeat(50) + '\n');

const linesError = checkFileLines();
const funcError = checkFunctionLines();

console.log('\n' + '='.repeat(50));
if (linesError || funcError) {
  console.log('❌ 检查未通过，请修复上述问题');
  process.exit(1);
} else {
  console.log('✅ 所有检查通过');
}

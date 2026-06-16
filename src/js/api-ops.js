// API 操作
async function fetchModels() {
  try {
    showStatus('正在获取模型列表...', 'info');
    const cfg = getConfig();
    const r = await fetchJson('/fetch', {
      method: 'POST',
      body: JSON.stringify(cfg),
    });
    const { filteredModels = [], totalCount = 0, filteredCount = 0 } = r;
    setEditorValues(filteredModels.join('\n'), filteredModels.map(m => m.toLowerCase()).join('\n'));
    showStatus(cfg.enableFilter ? `✅ 成功获取 ${totalCount} 个模型，过滤后剩余 ${filteredCount} 个` : `✅ 成功获取 ${totalCount} 个模型`, 'success');
  } catch (e) {
    showStatus('❌ 获取失败: ' + e.message, 'error');
  }
}

async function generateMapping() {
  const { allModels, finalModels } = getEditorValues();
  const { mapping } = await fetchJson('/generate-mapping', {
    method: 'POST',
    body: JSON.stringify({
      allModels: parseModels(allModels),
      finalModels: parseModels(finalModels),
    }),
  });
  return mapping;
}

async function copyFinalModels() {
  await copyToClipboard(parseModels(getEditorValues().finalModels).join(', '), '✅ 最终模型已复制到剪贴板');
}

async function copyMappingResult() {
  try {
    const mapping = await generateMapping();
    if (!Object.keys(mapping).length) {
      showStatus('⚠️ 映射前后无变化', 'warning');
      return;
    }
    await copyToClipboard(JSON.stringify(mapping, null, 2), '✅ 模型映射已复制到剪贴板');
  } catch (e) {
    showStatus('❌ 生成映射失败: ' + e.message, 'error');
  }
}

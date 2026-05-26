// 工具函数
const $ = (id) => document.getElementById(id);
const getStorage = (k, d) => localStorage.getItem(STORAGE_PREFIX + k) ?? d;
const setStorage = (k, v) => localStorage.setItem(STORAGE_PREFIX + k, v);
const parseModels = (t) =>
  (t || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
const toggleHidden = (el, hide) => {
  if (el) el.classList.toggle('hidden', hide);
};

async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  if (!res.headers.get('content-type')?.includes('json')) {
    throw new Error('服务器返回非JSON响应');
  }
  if (!res.ok) {
    let msg = '请求失败';
    try {
      msg = (await res.json()).error || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

async function copyToClipboard(text, msg) {
  if (!text) {
    showStatus('⚠️ 没有可复制的内容', 'warning');
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    showStatus(msg, 'success');
  } catch (e) {
    showStatus('❌ 复制失败: ' + e.message, 'error');
  }
}

function getConfig() {
  const radio = document.querySelector('input[name="filterMode"]:checked');
  return {
    apiUrl: $('apiUrl').value,
    apiEndpoint: $('apiEndpoint').value,
    apiKey: $('apiKey').value,
    enableFilter: $('enableFilter').checked,
    excludeKeywords: $('excludeKeywords').value,
    includeKeywords: $('includeKeywords').value,
    filterMode: radio ? radio.value : 'exclude',
  };
}

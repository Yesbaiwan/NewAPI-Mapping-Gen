// 存储管理
function saveConfig() {
  Object.entries(CONFIG_FIELDS).forEach(([k, v]) => {
    if (v.type === 'checkbox') {
      const el = $(v.el);
      if (el) setStorage(k, el.checked);
    } else if (v.type === 'radio') {
      const c = document.querySelector(`input[name="${v.name}"]:checked`);
      setStorage(k, c ? c.value : v.def);
    } else {
      const el = $(v.el);
      if (el) setStorage(k, el.value);
    }
  });
}

function loadConfig() {
  Object.entries(CONFIG_FIELDS).forEach(([k, v]) => {
    const s = getStorage(k, v.def);
    if (v.type === 'checkbox') {
      const el = $(v.el);
      if (el) el.checked = s === 'true' || s === true;
    } else if (v.type === 'radio') {
      const r = document.querySelector(`input[name="${v.name}"][value="${s}"]`);
      if (r) r.checked = true;
    } else {
      const el = $(v.el);
      if (el) el.value = s;
    }
  });
  toggleHidden($('apiEndpointGroup'), !$('showApiEndpoint').checked);
}

function clearApiConfig() {
  $('apiUrl').value = DEFAULT_CONFIG.apiUrl;
  $('apiEndpoint').value = DEFAULT_CONFIG.apiEndpoint;
  $('apiKey').value = DEFAULT_CONFIG.apiKey;
  saveConfig();
  showStatus('✅ 配置已还原', 'success');
}

// UI 交互
function showStatus(msg, type) {
  const div = document.createElement('div');
  div.className = `fixed bottom-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg font-medium shadow-lg backdrop-blur-sm transition-all duration-300 transform translate-y-10 opacity-0 z-[1000] ${STATUS_COLORS[type] || STATUS_COLORS.info}`;
  div.textContent = msg;
  $('statusContainer').innerHTML = '';
  $('statusContainer').appendChild(div);
  requestAnimationFrame(() => div.classList.remove('translate-y-10', 'opacity-0'));
  setTimeout(() => {
    div.classList.add('translate-y-10', 'opacity-0');
    setTimeout(() => div.remove(), 300);
  }, 3000);
}

function initPopover() {
  const btn = $('filterSettingsBtn'),
    pop = $('filterPopover');
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (pop.classList.contains('hidden')) {
      const r = btn.getBoundingClientRect();
      pop.style.top = `${r.bottom + 8}px`;
      pop.style.left = 'auto';
      pop.style.right = `${window.innerWidth - r.right}px`;
      pop.classList.remove('hidden');
    } else {
      pop.classList.add('hidden');
    }
  });
  document.addEventListener('click', (e) => {
    if (!pop.contains(e.target) && e.target !== btn) pop.classList.add('hidden');
  });
  pop.addEventListener('click', (e) => e.stopPropagation());
}

function initButtons() {
  $('btnGroup').innerHTML = BTN_CONFIG.map(({ id, icon, text, cls }) => `<button id="${id}" class="btn-base ${cls} text-white"><span class="mr-2">${icon}</span><span>${text}</span></button>`).join(
    '',
  );
  const fnMap = { fetchModels, copyFinalModels, copyMappingResult, clearEditor, clearApiConfig };
  BTN_CONFIG.forEach(({ id, fn }) => $(id).addEventListener('click', fnMap[fn]));
  $('copyToFinalBtn').addEventListener('click', copyToFinalModels);
}

function initEventListeners() {
  $('showApiEndpoint').addEventListener('change', function () {
    toggleHidden($('apiEndpointGroup'), !this.checked);
    if (!this.checked) $('apiEndpoint').value = '/v1/models';
    saveConfig();
  });
  ['apiUrl', 'apiKey', 'apiEndpoint', 'excludeKeywords', 'includeKeywords'].forEach((id) => $(id).addEventListener('blur', saveConfig));
  $('enableFilter').addEventListener('change', saveConfig);
  document.querySelectorAll('input[name="filterMode"]').forEach((r) => r.addEventListener('change', saveConfig));
}

import htmlContent from './index.html';

const HEADERS = {
  json: { 'Content-Type': 'application/json;charset=UTF-8' },
  html: { 'Content-Type': 'text/html;charset=UTF-8' },
  cors: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  },
};

const buildFullUrl = (url, path) => `${url.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;

const parseKeywords = (str) =>
  str
    ?.split(',')
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean) ?? [];

function filterModels(ids, excludeKeywords, includeKeywords, mode) {
  const kw = parseKeywords(mode === 'exclude' ? excludeKeywords : includeKeywords);
  if (!kw.length) return ids;
  const match = (id) => kw.some((k) => id.toLowerCase().includes(k));
  return mode === 'exclude' ? ids.filter((id) => !match(id)) : ids.filter(match);
}

async function parseRequestBody(request) {
  const body = await request.json().catch(() => null);
  if (!body) throw Object.assign(new Error('请求体必须是有效的JSON'), { status: 400 });
  return body;
}

async function handleFetch(request) {
  try {
    const body = await parseRequestBody(request);
    const { apiUrl, apiEndpoint = '/v1/models', apiKey, enableFilter, excludeKeywords, includeKeywords, filterMode } = body;
    if (!apiUrl?.trim() || !apiKey?.trim()) {
      return jsonResponse({ error: '请提供有效的API URL和API密钥' }, 400);
    }
    const response = await fetch(buildFullUrl(apiUrl, apiEndpoint), {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!response.ok) throw new Error(`API请求失败: ${response.status}`);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('json')) throw new Error('API返回非JSON响应');
    const json = await response.json();
    const modelIds = (Array.isArray(json.data) ? json.data : [])
      .map((m) => m.id)
      .filter(Boolean)
      .sort();
    if (!modelIds.length) throw new Error('未找到模型ID');
    const filtered = enableFilter ? filterModels(modelIds, excludeKeywords, includeKeywords, filterMode) : modelIds;
    return jsonResponse({
      allModels: modelIds,
      filteredModels: filtered,
      totalCount: modelIds.length,
      filteredCount: filtered.length,
    });
  } catch (error) {
    return jsonResponse({ error: error.message }, error.status || 500);
  }
}

async function handleGenerateMapping(request) {
  try {
    const { allModels, finalModels } = await parseRequestBody(request);
    if (!Array.isArray(allModels) || !Array.isArray(finalModels)) {
      return jsonResponse({ error: 'allModels和finalModels必须是数组' }, 400);
    }
    if (allModels.length !== finalModels.length) {
      return jsonResponse({ error: `模型数量不一致: 源模型 ${allModels.length} 个, 最终模型 ${finalModels.length} 个` }, 400);
    }
    const mapping = Object.fromEntries(finalModels.map((f, i) => [f, allModels[i]]).filter(([f, a]) => f && a && f !== a));
    return jsonResponse({ mapping });
  } catch (e) {
    return jsonResponse({ error: e.message }, e.status || 500);
  }
}

const jsonResponse = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { ...HEADERS.json, ...HEADERS.cors } });

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: HEADERS.cors });
    const pathname = new URL(request.url).pathname;
    const handlers = {
      '/': () => new Response(htmlContent, { headers: { ...HEADERS.html, ...HEADERS.cors } }),
      '/fetch': () => handleFetch(request),
      '/generate-mapping': () => handleGenerateMapping(request),
    };
    return handlers[pathname]?.() ?? new Response('Not Found', { status: 404, headers: HEADERS.cors });
  },
};

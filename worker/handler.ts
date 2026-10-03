const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json;charset=UTF-8', ...CORS },
  });

const buildUrl = (base: string, path: string) =>
  `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;

async function handleFetch(request: Request): Promise<Response> {
  const body = (await request.json().catch(() => null)) as {
    apiUrl?: string;
    apiEndpoint?: string;
    apiKey?: string;
  } | null;
  if (!body) return json({ error: '请求体必须是有效的 JSON' }, 400);
  const apiUrl = body.apiUrl?.trim();
  const apiKey = body.apiKey?.trim();
  // 密钥可留空：不填就不带 Authorization 头
  if (!apiUrl) return json({ error: '请提供有效的 API 地址' }, 400);
  try {
    const headers: Record<string, string> = {};
    if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
    const upstream = await fetch(
      buildUrl(apiUrl, body.apiEndpoint?.trim() || '/v1/models'),
      { headers, signal: AbortSignal.timeout(15_000) },
    );
    if (!upstream.ok)
      return json({ error: `上游 API 返回 ${upstream.status}` }, 502);
    const data = (await upstream.json().catch(() => null)) as {
      data?: Array<{ id?: string }>;
    } | null;
    const models = (Array.isArray(data?.data) ? data!.data : [])
      .map((m) => m.id)
      .filter((id): id is string => Boolean(id))
      .sort();
    if (!models.length)
      return json({ error: '未在上游响应中找到模型 ID' }, 502);
    return json({ models });
  } catch (e) {
    const msg =
      e instanceof Error
        ? e.name === 'TimeoutError'
          ? '上游请求超时（15s）'
          : e.message
        : '未知错误';
    return json({ error: msg }, 502);
  }
}

/**
 * API 路由分发：本地 dev 由 Vite 插件调用，生产由 Cloudflare Worker 调用。
 * 返回 null 表示非 API 请求，交给调用方处理静态资源。
 */
export async function handleApiRequest(
  request: Request,
): Promise<Response | null> {
  if (request.method === 'OPTIONS')
    return new Response(null, { status: 204, headers: CORS });
  const { pathname } = new URL(request.url);
  if (request.method === 'POST' && pathname === '/fetch')
    return handleFetch(request);
  return null;
}

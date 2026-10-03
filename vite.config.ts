import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Connect, type Plugin } from 'vite';
import { handleApiRequest } from './worker/handler.ts';

/** 本地 dev 时在 Node 里直接实现 /fetch，与 worker/handler.ts 共享同一份逻辑，无需 wrangler */
function localApi(): Plugin {
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use('/fetch', (req: Connect.IncomingMessage, res) => {
        void (async () => {
          const request = new Request('http://localhost/fetch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // undici 接受 Node 请求对象这种异步可迭代流作为 body；DOM 类型没有 duplex 字段
            body: req as unknown as ReadableStream,
            duplex: 'half',
          } as RequestInit);
          const response =
            (await handleApiRequest(request)) ??
            new Response('Not Found', { status: 404 });
          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(await response.text());
        })().catch(() => {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: '本地 API 处理失败' }));
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [vue(), tailwindcss(), localApi()],
});

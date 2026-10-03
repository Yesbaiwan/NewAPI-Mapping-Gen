import { handleApiRequest } from './handler.ts';

interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return (await handleApiRequest(request)) ?? env.ASSETS.fetch(request);
  },
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    try {
      const response = await env.ASSETS.fetch(request);
      if (response.status !== 404) return response;
    } catch (e) {
      // asset not found, fall through to SPA fallback
    }

    url.pathname = '/index.html';
    return env.ASSETS.fetch(new Request(url, request));
  },
};

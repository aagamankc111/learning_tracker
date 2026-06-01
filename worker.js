export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;

    url.pathname = '/index.html';
    return env.ASSETS.fetch(new Request(url, request));
  },
};

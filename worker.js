export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname.match(/\.[a-zA-Z0-9]+$/)) {
      try {
        const response = await env.ASSETS.fetch(request);
        if (response.status === 200) return response;
      } catch (e) {}
    }

    url.pathname = '/index.html';
    return env.ASSETS.fetch(url.toString());
  },
};

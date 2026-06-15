// worker.js
var HTML = `<!doctype html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Learning Tracker \u2013 AI Infrastructure & Cloud</title><script defer="defer" src="/static/js/main.126dc475.js"><\/script><link href="/static/css/main.59db43d8.css" rel="stylesheet"></head><body class="bg-gray-50 dark:bg-dark-900 text-gray-800 dark:text-gray-100 font-sans antialiased"><script>!function(){var e=localStorage.getItem("theme");("dark"===e||!e&&window.matchMedia("(prefers-color-scheme: dark)").matches)&&document.documentElement.classList.add("dark")}()<\/script><noscript>You need to enable JavaScript to run this app.</noscript><div id="root"></div></body></html>`;
var worker_default = {
  async fetch(request, env, ctx) {
    return new Response(HTML, {
      status: 200,
      headers: { "Content-Type": "text/html" }
    });
  }
};
export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map

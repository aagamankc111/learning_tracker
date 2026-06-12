import { readFileSync, writeFileSync } from 'fs';

const html = readFileSync('build/index.html', 'utf8');
const escaped = html.replace(/`/g, '\\`').replace(/\${/g, '\\${');

const worker = `const HTML = \`${escaped}\`;

export default {
  async fetch(request, env, ctx) {
    return new Response(HTML, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
  },
};
`;

writeFileSync('worker.js', worker);

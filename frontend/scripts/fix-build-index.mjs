import fs from 'node:fs';
import path from 'node:path';

const buildDir = path.resolve(process.cwd(), 'build');
const indexPath = path.join(buildDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error(`[fix-build-index] Missing ${indexPath}`);
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf8');

// Vite should write correct asset URLs, but on some setups we've seen
// the generated build/index.html reference a non-existent hashed file.
// Since we build with deterministic filenames (assets/index.js|css),
// force the HTML to match.
html = html
  .replace(/<h1>\s*Hello int is index\.html\s*<\/h1>/gi, '')
  .replace(/\/static\/assets\/index-[^"]+\.js/g, '/assets/index.js')
  .replace(/\/static\/assets\/index-[^"]+\.css/g, '/assets/index.css')
  .replace(/\/static\/assets\/index\.js/g, '/assets/index.js')
  .replace(/\/static\/assets\/index\.css/g, '/assets/index.css')
  .replace(/\/assets\/index-[^"]+\.js/g, '/assets/index.js')
  .replace(/\/assets\/index-[^"]+\.css/g, '/assets/index.css');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('[fix-build-index] OK');


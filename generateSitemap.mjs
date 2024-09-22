import fs from 'fs';
import path from 'path';
import { globby } from 'globby';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateSitemap() {
  const pages = await globby([
    'app/**/*.tsx',
    'app/**/*.ts',
    'app/**/*.js',
    'app/**/*.jsx',
    '!app/**/_*.tsx',
    '!app/**/_*.ts',
    '!app/**/_*.js',
    '!app/**/_*.jsx',
    '!app/**/layout.tsx',
    '!app/**/layout.ts',
    '!app/**/layout.js',
    '!app/**/layout.jsx',
  ]);

  const baseUrl = 'https://dhairya.ai';

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map((page) => {
      const route = page
        .replace('app', '')
        .replace(/\.(tsx|ts|js|jsx)$/, '')
        .replace(/\/index$/, '')
        .replace(/\[(.+)\]/, ':$1');

      return `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    })
    .join('')}
</urlset>`;

  fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), sitemap);
  console.log('Sitemap generated successfully!');
}

generateSitemap();
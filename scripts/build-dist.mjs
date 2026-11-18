// Build a clean deploy folder (dist/) and sync SEO values from assets/js/config.js.
// Usage: npm run dist
import { readFileSync, writeFileSync, rmSync, mkdirSync, cpSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { join, dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const p = (...a) => join(root, ...a);
const warn = (m) => console.warn('  ⚠ ' + m);

// ---- 1. Read config.js (it assigns window.NAYRA_CONFIG) ----
const sandbox = { window: {} };
vm.runInNewContext(readFileSync(p('assets/js/config.js'), 'utf8'), sandbox, { timeout: 1000 });
const C = sandbox.window.NAYRA_CONFIG;
if (!C) throw new Error('NAYRA_CONFIG not found in config.js');

const site = String(C.siteUrl || '').replace(/\/+$/, '');
if (!/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}$/i.test(site)) throw new Error(`siteUrl must be like https://www.example.com (got "${C.siteUrl}")`);
const wa = String(C.whatsappNumber || '').replace(/\D/g, '');
const placeholderPhone = /^91(9{10}|0{10})$/.test(wa) || /9{5}\s?9{5}/.test(C.phoneDisplay || '');
if (placeholderPhone) warn('whatsappNumber / phoneDisplay are still placeholders — telephone left out of JSON-LD.');
if (C.email === 'info@nayrawater.in') warn('email is still the default value — confirm it is real.');

// ---- 2. Optional: convert product photos to WebP (needs `cwebp`) ----
const prodDir = p('assets/img/products');
if (existsSync(prodDir)) {
  for (const f of readdirSync(prodDir)) {
    if (!/\.(png|jpe?g)$/i.test(f)) continue;
    const out = join(prodDir, basename(f, extname(f)) + '.webp');
    if (existsSync(out)) continue;
    try { execFileSync('cwebp', ['-q', '80', '-resize', '600', '0', '-quiet', join(prodDir, f), '-o', out]); console.log('  ✓ webp', out); }
    catch { warn(`could not convert ${f} (install cwebp: brew install webp)`); }
  }
}

// ---- 3. Sync SEO blocks inside index.html ----
const ldJson = (o) => JSON.stringify(o).replace(/</g, '\\u003c'); // never allow "</script>" breakout
const addr = String(C.address || '');
const ld = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${site}/#business`,
  name: C.company || 'NAYRA Pure Water',
  description: 'Pure packaged drinking water manufacturer and supplier in Delhi. Multi-stage purification with micro-filtration and ozonisation.',
  url: `${site}/`,
  image: `${site}/assets/img/label-brand.jpg`,
  logo: `${site}/assets/img/favicon.svg`,
  slogan: C.tagline,
  address: {
    '@type': 'PostalAddress',
    streetAddress: addr.split(/,\s*Delhi/i)[0] || addr,
    addressLocality: 'Delhi', addressRegion: 'Delhi',
    postalCode: (addr.match(/\b\d{6}\b/) || [''])[0],
    addressCountry: 'IN'
  },
  ...(C.openingHoursSchema ? { openingHours: C.openingHoursSchema } : {}),
  ...(C.serviceAreas ? { areaServed: C.serviceAreas } : {}),
  ...(!placeholderPhone && wa ? { telephone: '+' + wa } : {}),
  ...(C.email ? { email: C.email } : {})
};
const sameAs = Object.values(C.social || {}).filter(u => /^https:\/\//.test(u || ''));
if (sameAs.length) ld.sameAs = sameAs;

let html = readFileSync(p('index.html'), 'utf8');
const replaceBlock = (name, body) => {
  const re = new RegExp(`(<!--${name}:start[^>]*-->)[\\s\\S]*?(\\s*<!--${name}:end-->)`);
  if (!re.test(html)) throw new Error(`marker <!--${name}:start--> not found in index.html`);
  html = html.replace(re, (_, a, b) => `${a}\n${body}${b}`);
};
replaceBlock('seo', [
  `  <link rel="canonical" href="${site}/" />`,
  `  <meta property="og:url" content="${site}/" />`,
  `  <meta property="og:image" content="${site}/assets/img/label-brand.jpg" />`
].join('\n'));
replaceBlock('ld', `  <script type="application/ld+json">${ldJson(ld)}</script>`);

// FAQ structured data, built from the visible FAQ so the two never drift apart
const strip = (h) => h.replace(/<span data-areas>[^<]*<\/span>/g, C.serviceAreas || 'Delhi NCR')
  .replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const faqs = [...html.matchAll(/<details[^>]*>\s*<summary[^>]*>([\s\S]*?)<svg[\s\S]*?<\/summary>\s*<p[^>]*>([\s\S]*?)<\/p>\s*<\/details>/g)]
  .map(([, q, a]) => ({ '@type': 'Question', name: strip(q), acceptedAnswer: { '@type': 'Answer', text: strip(a) } }));
if (faqs.length < 3) throw new Error(`FAQ parse found only ${faqs.length} questions`);
replaceBlock('faq', `  <script type="application/ld+json">${ldJson({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs })}</script>`);
writeFileSync(p('index.html'), html);

// ---- 4. robots.txt + sitemap.xml ----
const today = new Date().toISOString().slice(0, 10);
writeFileSync(p('robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);
writeFileSync(p('sitemap.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${site}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`);

// ---- 5. Clean dist/ ----
const dist = p('dist');
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist);
cpSync(p('assets'), join(dist, 'assets'), { recursive: true, filter: (s) => !/(\.DS_Store|\.md)$/.test(s) });
for (const f of ['robots.txt', 'sitemap.xml', '_headers', '.htaccess']) if (existsSync(p(f))) cpSync(p(f), join(dist, f));

// cache-busting: ?v=<hash> on JS so it can be cached for a year
const hash = (f) => createHash('sha256').update(readFileSync(p(f))).digest('hex').slice(0, 10);
let distHtml = html;
for (const f of ['assets/js/config.js', 'assets/js/main.js']) {
  distHtml = distHtml.replace(`"${f}"`, `"${f}?v=${hash(f)}"`);
}

// Inline the CSS (saves one full network round-trip before first paint — ~2 s on slow 3G).
// The CSP keeps blocking any other inline style: only this exact block is allowed, by its sha256 hash.
const css = readFileSync(p('assets/css/style.css'), 'utf8').replace(/\.\.\/fonts\//g, 'assets/fonts/').replace(/\.\.\/img\//g, 'assets/img/');
if (/<\/style/i.test(css)) throw new Error('unexpected </style in CSS');
const cssHash = `'sha256-${createHash('sha256').update(css, 'utf8').digest('base64')}'`;
const linkTag = '<link rel="stylesheet" href="assets/css/style.css" />';
if (!distHtml.includes(linkTag)) throw new Error('stylesheet <link> not found in index.html');
distHtml = distHtml.replace(linkTag, `<style>${css}</style>`);
const withHash = (s) => {
  const out = s.replace(/style-src 'self'(?: 'sha256-[^']+')?;/g, `style-src 'self' ${cssHash};`);
  if (out === s && !s.includes(cssHash)) throw new Error('CSP style-src not found');
  return out;
};
distHtml = withHash(distHtml);
writeFileSync(join(dist, 'index.html'), distHtml);
for (const f of ['_headers', '.htaccess']) {
  const fp = join(dist, f);
  if (existsSync(fp)) writeFileSync(fp, withHash(readFileSync(fp, 'utf8')));
}

console.log(`✓ dist/ ready for ${site}`);

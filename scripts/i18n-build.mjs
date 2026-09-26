// Generates the localized copies of the site.
//
//   node scripts/i18n-build.mjs
//
// English stays hand-written in `public/`; every other language is written to
// `public/<lang>/` with the same file names, so hosting's clean URLs give
// `/az/modules/hr` for free. Nothing here is a runtime dependency — the output
// is committed, and Firebase Hosting serves it as plain static HTML. A visitor
// with JavaScript disabled still gets a fully translated page and a working
// language switcher, because both are baked into the markup.
//
// Three regions of every page are owned by this script and rewritten in place
// between `<!--i18n:name-->` markers, in the English sources too:
//   alternates       — the rel="alternate" hreflang links
//   switcher         — the header language menu
//   switcher-mobile  — the same links inside the mobile drawer
import fs from 'node:fs';
import path from 'node:path';
import { walk } from './lib/html-i18n.mjs';
import { sourcePages } from './i18n-extract.mjs';
import {
  LANGUAGES, CODES, TARGETS, SOURCE, ORIGIN, APP_ORIGIN, APP_ENTRY, UI,
  localizePath, urlForFile,
} from '../i18n/config.mjs';

const ROOT = 'public';

// Priority per page for sitemap.xml, and the date the site last changed.
const PRIORITY = {
  '/': '1.0', '/modules': '0.9', '/pricing': '0.9', '/contact': '0.7',
  '/about': '0.6', '/privacy': '0.3', '/terms': '0.3',
};
const LASTMOD = '2026-09-26';

const dictionaries = new Map();
export function loadDictionary(lang) {
  if (dictionaries.has(lang)) return dictionaries.get(lang);
  const dict = readDictionary(lang);
  dictionaries.set(lang, dict);
  return dict;
}

function readDictionary(lang) {
  if (lang === SOURCE) return new Map();
  const file = `i18n/${lang}.json`;
  if (!fs.existsSync(file)) return new Map();
  return new Map(Object.entries(JSON.parse(fs.readFileSync(file, 'utf8'))));
}

/** `/pricing#faq` → `/de/pricing#faq`; assets and unrelated external URLs are untouched. */
function localizeUrl(value, lang) {
  if (lang === SOURCE) return value;
  let url = value;
  let prefix = '';
  if (url.startsWith(ORIGIN)) { prefix = ORIGIN; url = url.slice(ORIGIN.length) || '/'; }
  // The application is the one external host that speaks the same prefixes we
  // do, so a link into it carries the visitor's language across instead of
  // landing them in English.
  else if (url.startsWith(APP_ORIGIN)) {
    prefix = APP_ORIGIN;
    url = url.slice(APP_ORIGIN.length) || '/';
    if (url === '/') url = APP_ENTRY;
  }
  if (!url.startsWith('/') || url.startsWith('/assets/')) return value;
  const split = url.search(/[?#]/);
  const pathname = split === -1 ? url : url.slice(0, split);
  const suffix = split === -1 ? '' : url.slice(split);
  return prefix + localizePath(pathname, lang) + suffix;
}

const GLOBE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18"/></svg>';
const CHEVRON = '<svg class="lang-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';

const linksFor = (url, lang, indent) => LANGUAGES.map((l) => {
  const current = l.code === lang ? ' aria-current="true"' : '';
  return `${indent}<a class="lang-option" href="${localizePath(url, l.code)}" hreflang="${l.code}"`
    + ` lang="${l.htmlLang}" data-lang="${l.code}"${current}>${l.name}</a>`;
}).join('\n');

function regionFor(name, { url, lang }) {
  const ui = UI[lang];
  const href = (code) => ORIGIN + (localizePath(url, code) === '/' ? '/' : localizePath(url, code));

  if (name === 'alternates') {
    const links = LANGUAGES.map((l) => `<link rel="alternate" hreflang="${l.code}" href="${href(l.code)}">`);
    // x-default points at English: it is the source language and the version an
    // unmatched visitor is served.
    links.push(`<link rel="alternate" hreflang="x-default" href="${href(SOURCE)}">`);
    return `\n${links.join('\n')}\n`;
  }

  // A <details> menu, so switching languages needs no JavaScript. site.js only
  // adds the click-outside/Escape close and remembers the choice.
  if (name === 'switcher') {
    return `
        <details class="lang" data-lang-switcher>
          <summary class="lang-button" title="${ui.switcher}" aria-label="${ui.current}">${GLOBE}<span class="lang-code">${lang.toUpperCase()}</span>${CHEVRON}</summary>
          <div class="lang-menu" role="group" aria-label="${ui.switcher}">
${linksFor(url, lang, '            ')}
          </div>
        </details>
        `;
  }

  if (name === 'switcher-mobile') {
    return `
    <div class="mobile-lang" role="group" aria-label="${ui.switcher}">
      <span class="mobile-lang-label">${ui.label}</span>
      <div class="mobile-lang-options">
${linksFor(url, lang, '        ')}
      </div>
    </div>
    `;
  }
  return null;
}

/** Produces one page in one language from the English source. */
export function render(html, { file, lang }) {
  const dict = loadDictionary(lang);
  const url = urlForFile(file);
  const translate = (value) => dict.get(value) ?? value;
  return walk(html, {
    onText: translate,
    onAttr: translate,
    onRegion: (name, inner) => regionFor(name, { url, lang }) ?? inner,
    onTag: ({ tag, attrs, raw }) => {
      if (tag === 'html') {
        const l = LANGUAGES.find((x) => x.code === lang);
        return raw.replace(/\blang="[^"]*"/, `lang="${l.htmlLang}"`);
      }
      if (lang === SOURCE) return raw;
      return raw.replace(/\b(href|src|action|content)="([^"]*)"/g, (whole, name, value) => {
        if (name === 'content' && !(tag === 'meta' && attrs.property === 'og:url')) return whole;
        return `${name}="${localizeUrl(value, lang)}"`;
      });
    },
  });
}

/** Every file the generator owns, as path → contents. */
export function build() {
  const out = new Map();
  const pages = sourcePages();
  for (const file of pages) {
    const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
    for (const lang of CODES) {
      const target = lang === SOURCE ? file : path.join(lang, file);
      out.set(target, render(html, { file, lang }));
    }
  }
  out.set('sitemap.xml', sitemap(pages));
  return out;
}

function sitemap(pages) {
  const urls = pages.map(urlForFile).filter((u) => u !== '/404');
  const entries = [];
  for (const lang of CODES) {
    for (const url of urls) {
      const loc = ORIGIN + (localizePath(url, lang) === '/' ? '/' : localizePath(url, lang));
      entries.push(`  <url>\n    <loc>${loc}</loc>\n    <lastmod>${LASTMOD}</lastmod>\n`
        + `    <priority>${PRIORITY[url] || '0.8'}</priority>\n  </url>`);
    }
  }
  return '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + entries.join('\n') + '\n</urlset>\n';
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const files = build();
  let written = 0;
  for (const [file, contents] of files) {
    const full = path.join(ROOT, file);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    if (!fs.existsSync(full) || fs.readFileSync(full, 'utf8') !== contents) {
      fs.writeFileSync(full, contents);
      written++;
    }
  }
  console.log(`${files.size} files generated for ${CODES.length} languages `
    + `(${TARGETS.join(', ')} + ${SOURCE}); ${written} changed.`);
}

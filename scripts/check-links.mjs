#!/usr/bin/env node
/**
 * Comprovador d'enllaços SENSIBLE A MAJÚSCULES sobre `dist/`.
 *
 * Per què existeix: a Windows/macOS `fs.existsSync('.../privacyPolicy')` retorna
 * true encara que la carpeta sigui `privacypolicy`. GitHub Pages serveix des de
 * Linux, on sí que compta. Així que una web pot passar totes les proves locals
 * i donar 404 en producció — és exactament el que va passar amb les rutes
 * generades per `[lang]/legal/[slug].astro`.
 *
 * Aquí cada segment de la URL es resol contra el llistat real del directori,
 * amb comparació exacta de nom.
 *
 * Ús: npm run build && npm run check:links
 */
import fs from 'node:fs';
import path from 'node:path';

const dist = 'dist';

if (!fs.existsSync(dist)) {
  console.error('No existeix dist/. Executa abans: npm run build');
  process.exit(1);
}

/**
 * Busca una entrada amb el nom exacte dins d'un directori.
 * @param {string} dir
 * @param {string} name
 * @returns {import('node:fs').Dirent | null}
 */
function exactEntry(dir, name) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return null;
  }
  return entries.find((entry) => entry.name === name) ?? null;
}

/**
 * Resol un pathname absolut del lloc contra dist/ respectant majúscules.
 * @param {string} urlPath
 * @returns {string | null} ruta real del fitxer, o null si no existeix
 */
function resolve(urlPath) {
  const segments = urlPath.split('/').filter(Boolean);
  let current = dist;

  for (const segment of segments) {
    const entry = exactEntry(current, segment);
    if (!entry) return null;
    current = path.join(current, entry.name);
  }

  if (fs.statSync(current).isDirectory()) {
    const index = exactEntry(current, 'index.html');
    return index ? path.join(current, index.name) : null;
  }
  return current;
}

const broken = [];
let checked = 0;

/** @param {string} file */
function checkFile(file) {
  const html = fs.readFileSync(file, 'utf8');
  for (const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    const raw = match[1];
    if (!raw || raw.startsWith('//')) continue;
    const clean = decodeURIComponent(raw).replace(/\/$/, '');
    if (!clean) continue;
    checked++;
    if (!resolve(clean)) {
      broken.push(`${raw}  →  ${file.replace(/\\/g, '/')}`);
    }
  }
}

/** @param {string} dir */
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name === 'index.html' || entry.name === '404.html') checkFile(full);
  }
}

walk(dist);

// El sitemap també ha d'apuntar a rutes que existeixin, amb les majúscules correctes.
const sitemapPath = path.join(dist, 'sitemap-0.xml');
const sitemapBroken = [];
let sitemapCount = 0;
if (fs.existsSync(sitemapPath)) {
  const xml = fs.readFileSync(sitemapPath, 'utf8');
  for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    sitemapCount++;
    const pathname = decodeURIComponent(new URL(match[1]).pathname).replace(/\/$/, '');
    if (pathname && !resolve(pathname)) sitemapBroken.push(match[1]);
  }
}

console.log(`Enllaços i recursos comprovats: ${checked}`);
console.log(`Sitemap: ${sitemapCount} URLs`);

if (broken.length === 0 && sitemapBroken.length === 0) {
  console.log('OK: cap ruta trencada (comparació sensible a majúscules).');
  process.exit(0);
}

console.error(`\nERROR: ${broken.length} enllaços trencats i ${sitemapBroken.length} URLs del sitemap.`);
for (const item of broken.slice(0, 30)) console.error(`  ${item}`);
for (const item of sitemapBroken.slice(0, 30)) console.error(`  sitemap → ${item}`);
process.exit(1);

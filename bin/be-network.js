#!/usr/bin/env node
// be-network sync [publicDir]
//   Replaces <publicDir>/network/ (default public/network/) with the kit's stylesheet and
//   thumbnails. That folder belongs to the kit: anything else in it is deleted. Run it before
//   dev and build (npm "predev" and "prebuild" scripts).
//
// be-network html <file.html> --current <id|none> [--base /network/]
//   For sites without a framework: writes the banner between the markers
//   <!-- be-network:start --> and <!-- be-network:end --> in an HTML file.
import { cpSync, existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderBanner } from '../index.js';

const assets = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets');
const [command, ...args] = process.argv.slice(2);

const option = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : args[i + 1];
};

function fail(message) {
  console.error(`be-network: ${message}`);
  process.exit(1);
}

if (command === 'sync') {
  const publicDir = resolve(args[0] ?? 'public');
  if (!existsSync(publicDir)) fail(`no such folder: ${publicDir}`);
  const target = join(publicDir, 'network');
  rmSync(target, { recursive: true, force: true });
  cpSync(assets, target, { recursive: true });
  console.log(`be-network: ${readdirSync(target).length} files -> ${target}`);
} else if (command === 'html') {
  const file = args[0];
  const current = option('current');
  if (!file || !current) fail('usage: be-network html <file.html> --current <id|none> [--base /network/]');
  const html = readFileSync(file, 'utf8');
  const start = '<!-- be-network:start -->';
  const end = '<!-- be-network:end -->';
  const a = html.indexOf(start);
  const b = html.indexOf(end);
  if (a === -1 || b < a) fail(`${file} needs the markers ${start} and ${end} where the banner goes`);
  const banner = renderBanner(current === 'none' ? null : current, { base: option('base') });
  writeFileSync(file, `${html.slice(0, a + start.length)}\n${banner}\n${html.slice(b)}`);
  console.log(`be-network: banner written to ${file}`);
} else {
  fail('commands: sync [publicDir] | html <file.html> --current <id|none> [--base /network/]');
}

// npm test: the list is well formed, every site has a thumbnail, and each banner marks exactly the
// right entry as "You are here".
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';
import { renderBanner, sites } from '../index.js';

const asset = (name) => new URL(`../assets/${name}`, import.meta.url);

test('ids are unique and every site has a thumbnail', () => {
  assert.equal(new Set(sites.map((s) => s.id)).size, sites.length);
  for (const s of sites) assert.ok(existsSync(asset(`${s.id}.webp`)), `missing assets/${s.id}.webp`);
  assert.ok(existsSync(asset('network-banner.css')));
});

test('urls are https origins without a trailing slash', () => {
  for (const s of sites) assert.match(s.url, /^https:\/\/[a-z0-9.-]+$/, s.url);
});

test('each site sees itself as "You are here" and links to the others', () => {
  for (const s of sites) {
    const html = renderBanner(s.id);
    assert.equal(html.match(/aria-current="page"/g)?.length, 1);
    assert.equal(html.match(/bxn__here/g)?.length, 1);
    assert.ok(!html.includes(`href="${s.url}/"`), `${s.id} links to itself`);
    assert.equal(html.match(/<a class="bxn__item"/g)?.length, sites.length - 1);
  }
});

test('null renders every entry as a link; an unknown id throws', () => {
  assert.ok(!renderBanner(null).includes('aria-current'));
  assert.throws(() => renderBanner('whereisthewal'), /unknown site id/);
});

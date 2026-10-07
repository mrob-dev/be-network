// The Berlin Experiences network banner as an HTML string. Every stack renders this one function's
// output (the Astro and React components and the plain-HTML command all wrap it), so the markup is
// the same on every site. Runs at build time or on the server; it has no browser dependencies.
import { network, sites } from './sites.js';

export { network, sites };

const LABEL = 'Berlin Experiences network';

const escape = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Checks `current` against the list. `null` means a page outside the list (for example
 * berlinexperiences.com itself): every entry is a link. Anything else must be a site id, so a typo
 * fails the build instead of quietly losing the "You are here" entry.
 */
function assertCurrent(current) {
  if (current === null) return;
  if (!sites.some((s) => s.id === current)) {
    throw new Error(`be-network: unknown site id "${current}". Known ids: ${sites.map((s) => s.id).join(', ')}`);
  }
}

/** The inside of the banner's <nav>, for wrappers that render the <nav> element themselves. */
export function renderBannerInner(current, { base = '/network/' } = {}) {
  assertCurrent(current);
  const items = sites.map((s) => {
    const here = s.id === current;
    // Decorative: the site name beside it is the link text.
    const thumb = `<img class="bxn__thumb" src="${escape(base + s.id)}.webp" alt="" width="120" height="80" loading="lazy" decoding="async">`;
    const text =
      `<span class="bxn__text"><strong class="bxn__name">${escape(s.name)}</strong>` +
      `<span class="bxn__desc">${escape(s.blurb)}</span>` +
      (here ? '<small class="bxn__here">You are here</small>' : '') +
      '</span>';
    return here
      ? `<li><span class="bxn__item" aria-current="page">${thumb}${text}</span></li>`
      : `<li><a class="bxn__item" href="${escape(s.url)}/">${thumb}${text}</a></li>`;
  });
  return (
    '<p class="bxn__label"><span class="bxn__rule" aria-hidden="true"></span>' +
    `<span>More from <a href="${escape(network.url)}">${escape(network.name)}</a></span></p>` +
    `<ul class="bxn__list">${items.join('')}</ul>`
  );
}

/** The whole banner. `current` is this site's id, or null. */
export function renderBanner(current, options) {
  return `<nav class="bxn" aria-label="${LABEL}">${renderBannerInner(current, options)}</nav>`;
}

export const bannerLabel = LABEL;

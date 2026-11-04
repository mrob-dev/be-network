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

/**
 * Progressive enhancement for the carousel layout (tablet and phone widths, see the stylesheet): advances
 * one card every few seconds, pauses while someone touches, hovers, focuses or scrolls the strip, lets a
 * mouse drag it, and does nothing when the list doesn't scroll (desktop grid) or the visitor prefers reduced
 * motion. Inline, no request to another domain; without it the strip is still a swipeable row.
 */
export const bannerScript = `(()=>{for(const n of document.querySelectorAll('.bxn:not([data-bxn])')){n.setAttribute('data-bxn','');const l=n.querySelector('.bxn__list');if(!l)continue;const rm=matchMedia('(prefers-reduced-motion: reduce)');let hold=0,r=0,down=0,moved=0,x0=0,s0=0;const scrolls=()=>l.scrollWidth>l.clientWidth+4;const step=()=>{if(hold||document.hidden||rm.matches||!scrolls())return;const li=l.querySelector('li');const w=li?li.getBoundingClientRect().width+(parseFloat(getComputedStyle(l).columnGap)||0):l.clientWidth;const end=l.scrollLeft+l.clientWidth>=l.scrollWidth-4;l.scrollTo({left:end?0:l.scrollLeft+w,behavior:'smooth'})};setInterval(step,3800);const pause=()=>{hold=1;clearTimeout(r)};const resume=()=>{clearTimeout(r);r=setTimeout(()=>{hold=0},6000)};for(const e of ['pointerdown','touchstart','focusin','mouseenter','wheel'])l.addEventListener(e,pause,{passive:true});for(const e of ['pointerup','touchend','focusout','mouseleave'])l.addEventListener(e,resume,{passive:true});l.addEventListener('dragstart',e=>e.preventDefault());l.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||!scrolls())return;down=1;moved=0;x0=e.clientX;s0=l.scrollLeft;l.style.scrollSnapType='none'});addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-x0;if(Math.abs(dx)>4)moved=1;l.scrollLeft=s0-dx});addEventListener('pointerup',()=>{if(!down)return;down=0;l.style.scrollSnapType=''});l.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopPropagation();moved=0}},true)}})();`;

/** The whole banner. `current` is this site's id, or null. Includes the small carousel script. */
export function renderBanner(current, options) {
  return `<nav class="bxn" aria-label="${LABEL}">${renderBannerInner(current, options)}</nav><script>${bannerScript}</script>`;
}

export const bannerLabel = LABEL;

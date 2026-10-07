// The Berlin Experiences network banner for React and Next.js sites. Plain JavaScript (no JSX), so
// it needs no transpiling from node_modules. Render it on the server: it is static markup with no
// interactivity. React 19 hoists the stylesheet <link> into the head and loads it once.
import { createElement, Fragment } from 'react';
import { bannerLabel, renderBannerInner } from '../index.js';

export default function NetworkBanner({ current, base, stylesheet = true }) {
  return createElement(
    Fragment,
    null,
    stylesheet && createElement('link', { rel: 'stylesheet', href: `${base ?? '/network/'}network-banner.css`, precedence: 'default' }),
    createElement('nav', {
      className: 'bxn',
      'aria-label': bannerLabel,
      dangerouslySetInnerHTML: { __html: renderBannerInner(current, { base }) },
    }),
  );
}

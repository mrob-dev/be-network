import type { ReactElement } from 'react';

export interface NetworkBannerProps {
  /** This site's id from sites.js, or null for a page outside the list. */
  current: string | null;
  /** Where the site serves the kit's files. Default '/network/'. */
  base?: string;
  /** Render the stylesheet <link> (hoisted by React 19). Default true. */
  stylesheet?: boolean;
}

export default function NetworkBanner(props: NetworkBannerProps): ReactElement;

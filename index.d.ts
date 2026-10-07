export interface NetworkSite {
  id: string;
  name: string;
  url: string;
  blurb: string;
}

export interface BannerOptions {
  /** Where the site serves the kit's files. Default '/network/'. */
  base?: string;
}

export declare const network: { name: string; url: string };
export declare const sites: readonly NetworkSite[];
export declare const bannerLabel: string;

/** The whole banner. `current` is this site's id, or null for a page outside the list. */
export declare function renderBanner(current: string | null, options?: BannerOptions): string;
/** The inside of the banner's <nav>. */
export declare function renderBannerInner(current: string | null, options?: BannerOptions): string;

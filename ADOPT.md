# Switching a site to be-network

Paste the prompt below into a Claude Code session in the site's own workspace,
after a short preamble with what's known about that site. The prompt is the
same for every site; the session works out the stack and the site's id itself.
Democracy Destroyed (Astro 7) is the reference: `src/components/NetworkBanner.astro`,
`package.json` (`predev`, `prebuild`) and `.gitignore` in
github.com/mrob-dev/democracydestroyed. Where Is The Wall is the Next.js
example (github.com/mrob-dev/whereisthewall).

| Site | Stack | Status |
| --- | --- | --- |
| Where Is The Wall | Next.js | switched: 2.0.1, live 14 Oct 2026 |
| Democracy Destroyed | Astro 7 | switched (reference): 2.0.2, live 14 Oct 2026 |
| Berlin Wall Escapes | Next.js | 1.x kit |
| Victims of the Wall | Astro 7 | 1.x kit, list in `src/config/site.ts` |
| Berlin Is Closed | plain HTML | older text-only `.network` banner in `index.html` |
| Battle of Berlin | Astro 5 | none |
| Potsdam Conference | Next.js | none |
| Berlinfographics | ? | ? |
| Berlin Excursions | ? | uses the package (^2.0.1) with `current={null}`: not in `sites.js` |

## Lessons from the first switches

- **Windows lockfiles.** On Windows, `npm i` and `npm update` can drop entries
  that only Linux installs need from `package-lock.json` (seen:
  `node_modules/@emnapi/core`, `node_modules/@emnapi/runtime`, and the copies
  nested under `@tailwindcss/oxide-wasm32-wasi`). Where the lockfile is
  installed on Linux (GitHub Actions, Hostinger server builds) that breaks the
  install. After installing, `git diff package-lock.json` must show only
  be-network's own entries; restore anything else from git.
- **English only.** The package's names and blurbs are English. On a page in
  another language, wrap the banner in an element with `lang="en"`. Whether
  be-network should carry German blurbs is the owner's decision: ask, and
  don't build it unasked.
- **Sites with no build step.** A site served straight from git (Berlin Is
  Closed on Hostinger Git deployment) can't sync at build time, so it commits
  the synced `network/` files and the `be-network html` output instead of
  ignoring them, and re-runs both when the package changes.
- **Compare against the live reference only when it's current.** The reference
  site must be live on the version being installed before anything is compared
  with it.
- **Clear the CDN after a static deploy.** `/network/network-banner.css` keeps
  the same URL in every version, and Hostinger serves it with
  `Cache-Control: public, max-age=604800`. The static-site deploy doesn't purge
  the CDN's compressed (Brotli) copy: democracydestroyed.com went on serving
  the 5 October stylesheet to browsers for a week after two deploys, while
  uncompressed and cache-busted requests (curl, `?v=`) got the new one. After
  deploying, clear the cache (Hostinger MCP `hosting_cache_clear-website`), then
  check from a real browser with `fetch('/network/network-banner.css',
  {cache: 'no-store'})`, not with curl. Returning visitors can still hold the
  old file for up to seven days.

## The prompt

```text
Switch this site's "More from Berlin Experiences" network banner to the shared be-network package
(github.com/mrob-dev/be-network, public; v2). The package holds the one list of sites, the markup,
the stylesheet and the thumbnails for every site in the network; this site should keep none of its
own copies.

1. Check `git status` is clean before you start. If it isn't, stop and tell me what's uncommitted.
2. Install it: npm i git+https://github.com/mrob-dev/be-network.git#semver:^2.0.0
   Then run `git diff package-lock.json`: on Windows, npm can drop lockfile entries that Linux
   installs need (seen: node_modules/@emnapi/core, node_modules/@emnapi/runtime and the copies
   nested under @tailwindcss/oxide-wasm32-wasi). Restore anything that isn't be-network's own entry,
   so the diff shows be-network and nothing else.
   Then read node_modules/be-network/README.md and follow it for this site's stack (Astro, Next.js
   / React, or plain HTML). This site's `current` id is the entry in node_modules/be-network/sites.js
   whose url is this site's domain.
3. Add "predev" and "prebuild" scripts that run `be-network sync <public folder>`, add the copied
   folder (public/network/) to .gitignore, and `git rm --cached` any kit files already tracked there.
   Exception: a site with no build step that is served straight from git (Hostinger Git deployment)
   can't sync at build time. There, run `be-network sync` and `be-network html` yourself and commit
   their output, including the network/ folder, and say in the repo's docs that both must be re-run
   whenever be-network is updated.
4. Replace whatever banner the site has now with the package's component: delete any hard-coded
   list of network sites, old banner markup, and old banner or `.network*` styles (only the
   banner's; leave unrelated rules alone). Keep at most the one allowed override,
   `.bxn { --bxn-display: <this site's heading font>; }`. If the site has no banner yet, put it
   directly under the homepage hero, and load /network/network-banner.css in the head of pages that
   show it (the React component does that itself). The package is English-only: on a page whose
   language isn't English, wrap the banner in an element with lang="en". Don't add translated
   blurbs; if the site seems to need them, ask me.
5. Update anything in this repo that describes the old arrangement (CLAUDE.md, docs, comments that
   point at whereisthewall.com/network/ as the canonical kit) to point at be-network instead. If the
   site has a credits page that lists the network thumbnails, use the credits in the package README.
6. Check it: the build passes; the homepage shows all eight sites in the package's order, with this
   site's entry as "You are here" (pale background, badge, not a link) and the other seven linking
   out; every thumbnail loads; no console errors. Look at it at desktop width and at 390px wide.
   Compare it with https://democracydestroyed.com/ (the reference), but first check that the live
   https://democracydestroyed.com/network/network-banner.css is identical to
   node_modules/be-network/assets/network-banner.css. If it isn't, the reference is out of date:
   compare against the package README instead and tell me.
7. Commit with a message that says the banner now comes from be-network v2, then deploy the site the
   way it is normally deployed. On Hostinger, clear the website cache afterwards (Hostinger MCP
   `hosting_cache_clear-website`): the deploy doesn't purge the CDN's compressed copy of the
   unchanged-URL stylesheet. Then check the live homepage from a real browser, including
   fetch('/network/network-banner.css', {cache: 'no-store'}) containing --bxn-here-bg. curl with no
   Accept-Encoding, or a ?v= query, gets a different cache entry and can show the new file while
   browsers still get the old one.
```

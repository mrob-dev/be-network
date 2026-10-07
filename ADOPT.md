# Switching a site to be-network

Paste the prompt below into a Claude Code session in the site's own workspace.
It is the same prompt for every site; the session works out the stack and the
site's id itself. Democracy Destroyed (Astro 7) was switched first and is the
reference: `src/components/NetworkBanner.astro`, `package.json` (`predev`,
`prebuild`) and `.gitignore` in github.com/mrob-dev/democracydestroyed.

Where each site stood when 2.0.0 was released:

| Site | Stack | Banner before |
| --- | --- | --- |
| Where Is The Wall | Next.js | 1.x kit in `public/network/` (was the canonical copy, with README) |
| Berlin Wall Escapes | Next.js | 1.x kit |
| Victims of the Wall | Astro | 1.x kit, list in `src/config/site.ts` |
| Berlin Is Closed | plain HTML | older text-only `.network` banner in `index.html` |
| Battle of Berlin | Astro 5 | none |
| Potsdam Conference | Next.js | none |
| Berlinfographics | ? | ? |
| Democracy Destroyed | Astro 7 | switched (reference) |

## The prompt

```text
Switch this site's "More from Berlin Experiences" network banner to the shared be-network package
(github.com/mrob-dev/be-network, private; v2). The package holds the one list of sites, the markup,
the stylesheet and the thumbnails for every site in the network; this site should keep none of its
own copies.

1. Check `git status` is clean before you start. If it isn't, stop and tell me what's uncommitted.
2. Install it: npm i git+https://github.com/mrob-dev/be-network.git#semver:^2.0.0
   Then read node_modules/be-network/README.md and follow it for this site's stack (Astro, Next.js
   / React, or plain HTML). This site's `current` id is the entry in node_modules/be-network/sites.js
   whose url is this site's domain.
3. Add "predev" and "prebuild" scripts that run `be-network sync <public folder>` (or, for a plain
   HTML site, wire `be-network sync` and `be-network html` into however the site is built). Add the
   copied folder (public/network/) to .gitignore and `git rm --cached` any kit files already tracked
   there.
4. Replace whatever banner the site has now with the package's component: delete any hard-coded
   list of network sites, old banner markup, and old banner or `.network*` styles. Keep at most the
   one allowed override, `.bxn { --bxn-display: <this site's heading font>; }`. If the site has no
   banner yet, put it directly under the homepage hero, and load /network/network-banner.css in the
   head of pages that show it (the React component does that itself).
5. Update anything in this repo that describes the old arrangement (CLAUDE.md, docs, comments that
   point at whereisthewall.com/network/ as the canonical kit) to point at be-network instead. If the
   site has a credits page that lists the network thumbnails, use the credits in the package README.
6. Check it: the build passes; the homepage shows all eight sites in the package's order, with this
   site's entry as "You are here" (pale background, badge, not a link) and the other seven linking
   out; every thumbnail loads; no console errors. Look at it at desktop width and at 390px wide, and
   compare it with https://democracydestroyed.com/ (the reference).
7. Commit with a message that says the banner now comes from be-network v2, then deploy the site the
   way it is normally deployed and check the live homepage.
```

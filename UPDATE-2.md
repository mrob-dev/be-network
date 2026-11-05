# Rolling out be-network 2.2 to every site

2.1.0 (4 Nov 2026) brought ten sites in a new order, a two-rows-of-five desktop grid and a swipeable slideshow row
on tablets and phones; 2.2.0 (same day) renames "Battle of Berlin 1945" to "The Battle of Berlin" and
"Potsdam Conference 1945" to "The Potsdam Conference". Sites do **not** pick it up by themselves: each one keeps the version in its lockfile until
it is updated, rebuilt and deployed. Germany Divided is done (live 4 Nov 2026).

Paste this into a Claude Code session in each site's own workspace:

```text
Update this site's Berlin Experiences network banner to be-network 2.2.0 or later (github.com/mrob-dev/be-network,
public). Since 2.1.0 it adds Berlin Deportations and Germany Divided (ten sites), changes the order, lays the banner out
as two rows of five on desktop and as a draggable slideshow row on tablet and phone, and appends a small inline
script to the banner markup.

1. Check `git status` is clean; if not, stop and tell me what is uncommitted.
2. If the site already uses the package (package.json has be-network): `npm update be-network`, confirm
   node_modules/be-network/package.json says 2.2.0 or later, and check `git diff package-lock.json` shows only
   be-network's own entries (on Windows restore anything else from git, see ADOPT.md). If the site does not use
   the package yet (old 1.x kit, hand-written banner, or no banner), follow ADOPT.md in the be-network repo to
   switch it over first, at the latest version.
3. `current` must be this site's id from node_modules/be-network/sites.js (berlindeportations for
   berlindeportations.com). The banner sits directly under the homepage hero.
4. If the site sends a Content-Security-Policy that blocks inline scripts, tell me: the slideshow needs the inline
   script (the row still swipes without it). Don't weaken the policy without asking.
5. Build and check the homepage at 1600px (two rows of five, thumbnail beside the text), 1280px (two rows of
   five, thumbnail above), 820px (one row, about three cards, advancing every few seconds) and 390px (one card and
   a bit, advancing; no sideways page scroll). All ten thumbnails load, this site's entry is "You are here", no
   console errors.
6. Commit ("Network banner: be-network 2.2"), deploy the usual way, clear the Hostinger cache
   (hosting_cache_clear), then check the live page in a browser, including
   fetch('/network/network-banner.css', {cache: 'no-store'}) containing "repeat(5".
```

| Site | Banner today | What it needs |
| --- | --- | --- |
| Germany Divided | 2.2.0 | done |
| Democracy Destroyed | package 2.0.2 | `npm update be-network`, build, deploy |
| Where Is The Wall | 2.2.0 | done (live 5 Nov 2026; banner in the site footer, not under the hero) |
| Berlin Excursions | package ^2.0.1, `current={null}` | `npm update be-network`, build, deploy |
| Victims of the Wall | 1.x kit | switch to the package (ADOPT.md) |
| Berlin Wall Escapes | 1.x kit | switch to the package (ADOPT.md) |
| Berlin Is Closed | plain HTML, text-only banner | `be-network sync` + `be-network html`, commit output (ADOPT.md) |
| Battle of Berlin 1945 | none | add (ADOPT.md) |
| Potsdam Conference 1945 | none | add (ADOPT.md) |
| Berlinfographics | unknown | check, then add or update |
| Berlin Deportations | none | add (ADOPT.md), `current="berlindeportations"` |

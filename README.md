# be-network

The Berlin Experiences network banner: the strip that cross-links the network's
sites, shown under each homepage hero. This repository is the only copy of it.
Every site installs it as a package and renders the banner from it at build
time, so the list of sites, the wording, the markup, the stylesheet and the
thumbnails are the same everywhere.

The banner is static HTML in each site's own pages: no script, no request to
another domain, nothing for a privacy notice to declare.

| Path | What it is |
| --- | --- |
| `sites.js` | The list of sites: id, name, URL, blurb. Order is display order. |
| `index.js` | `renderBanner(current)`: the banner as an HTML string. Every wrapper uses it. |
| `astro/NetworkBanner.astro` | Astro component. |
| `react/NetworkBanner.js` | React / Next.js component (plain JS, no transpiling needed). |
| `bin/be-network.js` | `be-network sync` copies the assets into a site; `be-network html` writes the banner into a plain HTML file. |
| `assets/` | `network-banner.css` and one 240×160 `<id>.webp` thumbnail per site. |
| `ADOPT.md` | The prompt for switching a site over to this package. |

## Using it on a site

Install from GitHub. The repository is public, so any machine can install it
over HTTPS without credentials, including Hostinger's server builds and GitHub
Actions. The lockfile may record it as `git+ssh://…`; npm still fetches it over
HTTPS where SSH isn't set up.

```bash
npm i git+https://github.com/mrob-dev/be-network.git#semver:^2.0.0
```

Copy the stylesheet and thumbnails into the site before every dev run and
build, and keep git out of that folder:

```jsonc
// package.json
"scripts": {
  "predev": "be-network sync public",
  "prebuild": "be-network sync public",
  ...
}
```

```gitignore
# network banner kit, copied from the be-network package by predev/prebuild
public/network/
```

`public/network/` belongs to the package: `sync` empties it and copies the kit
in, so put nothing else there.

Then render the banner directly under the homepage hero, with this site's `id`
from `sites.js` as `current`. That entry becomes "You are here" (its own
background, a badge, not a link). `current={null}` makes every entry a link,
for a page that isn't in the list, such as berlinexperiences.com itself. An
unknown id fails the build.

**Astro.** Load the stylesheet in the layout's `<head>` on pages that show the
banner, then:

```astro
---
import NetworkBanner from 'be-network/astro';
---
<NetworkBanner current="democracydestroyed" />
```

**Next.js / React 19.** The component renders the stylesheet `<link>` as well;
React hoists it into the head. Use it in a server component (it has no state):

```tsx
import NetworkBanner from 'be-network/react';

<NetworkBanner current="potsdamconference" />
```

**Plain HTML.** Put the markers where the banner goes and run the writer as
part of the site's build (and once now):

```html
<!-- be-network:start -->
<!-- be-network:end -->
```

```bash
be-network sync .                       # assets into ./network/
be-network html index.html --current berlinisclosed
```

and add `<link rel="stylesheet" href="/network/network-banner.css">` to the
`<head>`.

## Rules

- Don't restyle `.bxn*` classes or edit the copied files. The one allowed
  override is a `--bxn-*` token on `.bxn` in the site's own CSS, and in
  practice only the heading font: `.bxn { --bxn-display: var(--font-heading); }`.
  The colours stay the same everywhere.
- Don't add, reword or reorder entries on one site. Change `sites.js` here.
- Thumbnails keep `alt=""`: the site name beside each one is the link text.

## Changing the network

1. Edit `sites.js`, and for a new site add `assets/<id>.webp` (240×160 WebP,
   public domain or CC0 on its Commons record, or the site's own artwork; add a
   credit below).
2. `npm test` checks that ids are unique, URLs are bare `https://` origins and
   every site has a thumbnail.
3. Bump `version` in `package.json` (minor for new or changed entries, major
   for anything that changes the markup or class names), commit, tag
   `v<version>` and push the tag.
4. On each site: `npm update be-network`, build, check the banner, commit,
   deploy. A major version needs the range in the site's `package.json`
   raised too.

## Versions

- **2.0.2**: text only. The stylesheet's header names this repository as the
  canonical copy (it named whereisthewall.com/network/); the docs say the
  repository is public; ADOPT.md gains the lessons of the first switches.
- **2.0.1**: thumbnails sit above the text until the strip has its full
  1200px (was 900px), so long names such as "Berlinfographics" fit.
- **2.0.0**: this package. Eight sites (adds Berlinfographics, Battle of Berlin
  1945, Potsdam Conference 1945 and Democracy Destroyed); the current entry gets
  a background (`--bxn-here-bg`) instead of a greyed-out thumbnail; two rows on
  desktop.
- **1.x**: the four-site kit copied by hand from whereisthewall.com/network/.

## Thumbnail credits

The seven photographs are public domain or CC0, and the Berlinfographics
thumbnail is Berlin Experiences' own artwork, so no attribution is required.
Credited here anyway, and fine to add to a site's credits page:

- Where Is The Wall: The Wall Project, Wende Museum, Los Angeles. Carol M.
  Highsmith, public domain.
  [Commons](https://commons.wikimedia.org/wiki/File:The_Wall_Project_presented_by_the_Wende_Museum._Portions_of_the_Berlin_Wall,_Los_Angeles,_California_LCCN2013632352.tif)
- Berlin Wall Escapes: the Wall at Kopenhagener Straße, Wilhelmsruh, from the
  air. AlliiertenMuseum / U.S. Army Photograph, CC0.
  [Commons](https://commons.wikimedia.org/wiki/File:Heidekrautbahn_Berliner_Mauer_Kopenhagener_Stra%C3%9Fe.jpg)
- Victims of the Wall: memorial for Ida Siekmann, Bernauer Straße.
  Singlespeedfahrer, CC0.
  [Commons](https://commons.wikimedia.org/wiki/File:Memorial_Ida_Siekmann_Bernauer_Stra%C3%9Fe_Berlin_1v5.jpg)
- Berlin Is Closed: Westendbrücke deconstruction works, 2025. Leonhard Lenz,
  CC0.
  [Commons](https://commons.wikimedia.org/wiki/File:Westendbr%C3%BCcke_Berlin-Charlottenburg_deconstruction_works_2025-04-11_22.jpg)
- Berlinfographics: the logo and headline from berlinfographics.com's own
  social card (`/og-image.png`). Berlin Experiences.
- Battle of Berlin 1945: Soviet tanks of the 7th Guards Tank Corps on the
  approach to Berlin, April 1945. Unknown photographer, public domain.
  [Commons](https://commons.wikimedia.org/wiki/File:7._GTK_verso_Berlino.JPG)
- Potsdam Conference 1945: the opening session at Cecilienhof, 17 July 1945.
  U.S. Army Signal Corps, U.S. National Archives (NARA 198799), public domain.
  [Commons](https://commons.wikimedia.org/wiki/File:Opening_session_of_the_Potsdam_Conference_in_Potsdam,_Germany._President_Harry_S._Truman_is_seated_foreground_(back..._-_NARA_-_198799.jpg)
- Democracy Destroyed: the assembly chamber of the Reichstag after the fire of
  27 February 1933. Press photograph, Narodowe Archiwum Cyfrowe (National
  Digital Archives of Poland), public domain.
  [Commons](https://commons.wikimedia.org/wiki/File:3_1_0_17_11933_8_1_32674_REICHSTAGSBRAND_Reichstag_Fire_German_Parliament_Berlin_1933-02-27_Assembly_chamber_destroyed_by_the_fire._News_photo_February_1933._Narodowe_Archiwum_Cyfrowe_PDM.jpg)

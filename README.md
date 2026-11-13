# Edugames (retro port)

Restoration of old private Flash projects as static HTML + TypeScript + raw canvas.
The original ActionScript code is kept as close to 1:1 as possible; anything the
browser lacks is polyfilled in `common/`.


## Play

**https://edugames-www.michal-perzak.workers.dev/**

| Game | URL |
| ---- | --- |
| Hub (all games) | https://edugames-www.michal-perzak.workers.dev/ |
| Mat Wieża (EduGameMultiply) | https://edugames-www.michal-perzak.workers.dev/games/multiply/ |
| RoBo (EduGameLogic) | https://edugames-www.michal-perzak.workers.dev/games/logic/ |
| Wyścigi Literek (EduGameLetters) | https://edugames-www.michal-perzak.workers.dev/games/letters/ |
| Ogród (the garden of achievements) | https://edugames-www.michal-perzak.workers.dev/games/garden/ |

The site is the static files of this repo in the R2 bucket `www`, served by the worker in `worker/` (see "Deployment"). Progress and achievements are stored in the browser (`localStorage`).
The bucket also has a bare development URL, https://pub-ae6f42f4dbfd49bdbeae62d969149acb.r2.dev, which does not serve folders: open `.../index.html` there.

## Layout

```
achievements/      Shared achievements code (port of the garden swc) and its assets; games/garden is the garden page
index.html + hub/  Game hub: one tile per game (a live link per ported game, "SOON" stamp for anything not ported)
flash originals/   Untouchable history. Reference only.
common/            Polyfills shared by all games (@edugames/common), mirroring the AS3 package layout:
                   flash/*  org/puremvc/as3/*  com/greensock/*  AssetLoader  Bootstrap
games/
  multiply/        EduGameMultiply
  logic/           EduGameLogic
  letters/         EduGameLetters
scripts/serve.mjs  Tiny static server (node built-ins only)
```

EduGameHistory is out of scope for now.

## Stack

- TypeScript (the only dependency, dev-only), compiled with `tsc -b` (project references)
- Plain ES modules in the browser, resolved by an import map in each game's `index.html`. No bundler.
- Raw `<canvas>` rendering; the game is scaled into a full-window container (10% margin, aspect kept) over a heavily blurred copy of itself
- Yarn 1 (classic) workspaces, Node 24

## Commands

```
yarn install
yarn build      # tsc -b, all workspaces
yarn watch
yarn clean
yarn serve      # http://localhost:8080/ (the hub), /games/multiply/, /games/logic/ (build first)
```

## Deployment

The site is plain static files; it is pushed to the R2 bucket `www` with [wrangler](https://developers.cloudflare.com/workers/wrangler/) (log in once with `wrangler login`):

```
yarn deploy        # build, then upload what changed since the last deploy
yarn deploy:dry    # build, then list what would be uploaded
node scripts/deploy.mjs --force   # upload everything again (also --bucket <name>, --jobs <n>)
```

The bucket gets the layout of the repo: `/index.html` (the hub), `/hub`, `/common/dist`, `/achievements`, `/games/<name>/{index.html,dist,Assets}`.
Source maps, `.d.ts` files, tests and the `flash originals` are not uploaded. Uploaded files are remembered in `.deploy-manifest.json` (git-ignored).
Wrangler is a third-party tool used only for this; it is not a dependency of the repo.

### Worker

R2 stores objects, it does not serve "folders". `worker/` is a small Cloudflare Worker (no dependencies) that serves the bucket like a web server:
`/` and `/x/` answer with their `index.html`, `/x` redirects to `/x/` so relative links keep working, `HEAD`, `Range` and `ETag` (304) are supported, anything else is a 404/405.

```
yarn worker:dev       # wrangler dev, on a local copy of the bucket (fill it with: node scripts/deploy.mjs --local --force)
yarn worker:deploy    # publish the worker (currently live at the workers.dev address above; a route/custom domain can be added in worker/wrangler.jsonc)
BASE_URL=http://127.0.0.1:8787 node scripts/browser-test.mjs scripts/tests/hub.mjs   # run a browser test against it
```

## Porting approach

The originals are **ActionScript 3** (`flash.display.*`, PureMVC AS3, TweenLite),
not AS2. Sources use ~12k lines across 4 games, so the shared surface is large
and worth polyfilling once:

| Original              | Polyfill in `common/`                                   |
| --------------------- | ------------------------------------------------------- |
| `org.puremvc.as3.*`   | Minimal PureMVC (Facade, Proxy, Mediator, Commands)     |
| `com.greensock.*`     | Minimal TweenLite/TweenMax, easing, the few plugins used |
| `flash.display/events/text/geom/media/net/utils` | Display list + events over canvas |
| `[Embed]` + `Loader.loadBytes` | Open question: image loading strategy  |

Decisions:

- **Rendering:** retained display list (Sprite tree), fully redrawn to the canvas every frame.
- **TypeScript strictness:** relaxed to keep the originals intact. `noImplicitAny` stays on
  (AS3 `*` becomes an explicit `any`); `strictNullChecks`, `strictPropertyInitialization`
  and `strictFunctionTypes` are off. Tighten only where it costs the original code nothing.
- **Asset loading:** every `[Embed]` and `Loader` goes through one central asset loader in
  `common/`, which drives the main-screen loading indicator. See AGENTS.md.

## Historic API

### ActionScript 3 in brief

**ActionScript 3.0** (AS3) is an object-oriented programming language for the Adobe Flash Player
and Adobe AIR runtimes. It was introduced in June 2006 with Flash Player 9 and Flex 2, replacing
ActionScript 2 (Flash MX 2004), which itself grew out of the scripting language Macromedia added to
Flash 5 in 2000. AS3 runs on a new virtual machine, AVM2, which compiles bytecode (ABC, packed in
`.swf` files) just-in-time and is much faster than the AVM1 that ran AS1/AS2.

The language follows a draft of ECMAScript 4 (the standard that was later abandoned) and is a close
relative of JavaScript and TypeScript: classes, packages, interfaces, optional static types with a
strict compile mode, `getter`/`setter`s, regular expressions and E4X (native XML literals). Its runtime
API is organised in packages: a display list (`flash.display`: `Sprite`, `MovieClip`, `Bitmap`,
`Stage`), a DOM-3-style event model with capture/target/bubble phases (`flash.events`), text
(`flash.text`), sound (`flash.media`), networking and local storage (`flash.net`, `SharedObject`).

Adobe ended support for Flash Player on 31 December 2020 and browsers blocked it from January 2021.
AIR remains available through HARMAN. The Flex SDK was handed over to the Apache Software Foundation
(Apache Flex) in 2011-2012.

### Original project

- Built with FlashDevelop projects (`.as3proj`), targeting Flash Player 11.8, 960x600 at 30 fps.
- Architecture: PureMVC (Facade / Commands / Mediators / Proxies), GreenSock for tweens.
- Assets are embedded with `[Embed]` and decoded at runtime (`Loader.loadBytes`).
- `Preloader.as` is the SWF's frame-based preloader that starts `Main` via `getDefinitionByName`.
- `garden.swc` and `ogrod_popr_01.swc` are the author's own (compiled-only) achievements libraries.

### Third-party libraries used by the originals

| Library | Version | Release date | Source / note |
| ------- | ------- | ------------ | ------------- |
| [PureMVC AS3 Standard Framework](https://github.com/PureMVC/puremvc-as3-standard-framework) | 2.0.4 (`PureMVC_AS3_2_0_4.swc`) | 2008-08-14 | Date of the `2.0.4` tag commit on GitHub. |
| [GreenSock Animation Platform for AS3](https://github.com/greensock/GreenSock-AS3) (TweenLite, TweenMax, easing, plugins, LoaderMax) | v11 line (SWC contains `core.TweenCore`; compiled 2011-12-23) | v11.2: 2010-03-06 (first official v11). The SWC was built 2011-12-23. | Exact minor version not confirmed. It is not a tagged GitHub release: the repo's tags start at v12 (last: [12.1.5](https://github.com/greensock/GreenSock-AS3/tags), 2014-07-21). The v11.2 date comes from a mirrored changelog. |
| Myriad Pro (Regular, Bold OTF) | n/a | n/a | Adobe typeface, embedded as `MYRIADPRO-*.OTF`. |
| [JPEXS Free Flash Decompiler](https://github.com/jindrapetrik/jpexs-decompiler) (FFDec) | 26.4.0 | 2026-10-19 | Build-time only, not part of the repo: one-off export of the garden reward symbols (see `scripts/tools/make-garden-items.mjs`). |

GreenSock plugins used by Multiply: `AutoAlpha`, `Tint`, `RemoveTint`, `TransformAroundPoint`, `MotionBlur`,
`SoundTransform` (`Physics2D` is imported but unused). These are the ones the polyfill must provide.

Sources: PureMVC [2.0.4 tag](https://github.com/PureMVC/puremvc-as3-standard-framework/commit/81ca250fc042456c38e18357ea9c9b464fb7cfdd),
GreenSock [AS3 repository](https://github.com/greensock/GreenSock-AS3).

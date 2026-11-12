# Edugames (retro port)

Restoration of old private Flash projects as static HTML + TypeScript + raw canvas.
The original ActionScript code is kept as close to 1:1 as possible; anything the
browser lacks is polyfilled in `common/`.

## Layout

```
flash originals/   Untouchable history. Reference only.
common/            Polyfills shared by all games (@edugames/common)
games/
  multiply/        EduGameMultiply   (first port)
  logic/           EduGameLogic      (todo)
  letters/         EduGameLetters    (todo)
  achievements/    EduAchievements   (todo)
scripts/serve.mjs  Tiny static server (node built-ins only)
```

EduGameHistory is out of scope for now.

## Stack

- TypeScript (the only dependency, dev-only), compiled with `tsc -b` (project references)
- Plain ES modules in the browser, resolved by an import map in each game's `index.html`. No bundler.
- Raw `<canvas>` rendering
- Yarn 1 (classic) workspaces, Node 24

## Commands

```
yarn install
yarn build      # tsc -b, all workspaces
yarn watch
yarn clean
yarn serve      # http://localhost:8080/games/multiply/
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

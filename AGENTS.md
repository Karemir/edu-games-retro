# AGENTS.md

Port of old Flash games (ActionScript 3, PureMVC, GreenSock) to TypeScript + static HTML + raw canvas.
See `README.md` for layout and commands.

## Hard rules

1. **Never modify `flash originals/`.** It is read-only history and the reference.
2. **Preserve the original code.** Port `.as` to `.ts` keeping names, structure, comments and logic.
   Only changes required by the TypeScript spec are allowed (syntax: `var x:T` -> `let x: T`,
   `package`/`import` -> ES modules, `Array`/`Vector` typing, etc.). No refactors, no bug fixes,
   no "improvements" to the originals. If the original looks wrong, leave it and mention it.
3. **Polyfill, don't rewrite.** When something is missing in the browser (flash.* APIs, PureMVC,
   GreenSock, `[Embed]`, `Loader.loadBytes`), implement it in `common/` with the original API
   and package structure, so ported game code stays as close as possible to the source.
4. **No third-party dependencies** except TypeScript itself. Ask before adding anything else, even trivial.
5. **Raw canvas only for the game.** No DOM-based rendering of game content, no libraries. The shared container chrome (back/mute buttons, credit, blurred backdrop) is the only DOM, built in `common/`.
6. Polyfills stay small and simple: implement only what the games actually use.

## Conventions

- Yarn 1 workspaces: `common`, `games/*`. Packages are `@edugames/<name>`.
- Build with `yarn build` (`tsc -b`); it must pass before a task is done.
- Games are served statically; each `index.html` has a sized `<div id="container">` and an import map for `@edugames/common`; `bootstrap()` builds the canvas, scaling and blurred backdrop inside it.
- Tests and tools convert stage coordinates to page coordinates with the `pt()` helper (the canvas is scaled).
- Copy needed assets from `flash originals/<Game>/Assets` into the game's own folder; never reference the originals at runtime.
- Match surrounding code style (tabs vs spaces, comment density, naming) of the file being ported.
- Mark any unavoidable deviation from the original with a short `// PORT:` comment.
- EduGameHistory is out of scope for now.

## Asset loading

- `[Embed(source=...)] var x:Class` is ported as `x: Class = embed("path")` from `common/`. It registers the
  file with the single central `AssetLoader` and returns a Class-like constructor whose instances behave like
  the Flash embed (`new x() as Bitmap`).
- Instance-level embeds must be hoisted to `static` so they register at module load, before the preload
  step finishes (`// PORT:` comment).
- `Loader.loadBytes` / `Loader.load` are also routed through `AssetLoader`, so every pending load counts
  toward the progress shown by the loading indicator (replaces the original `Preloader`).
- Startup of `Main` waits for `AssetLoader` to report all loads complete.

## Porting rules for AS3 -> TS (spec-required changes, mark with `// PORT:` when not mechanical)

- Imports: `import flash.display.Sprite;` -> `import { Sprite } from "@edugames/common/flash/display/Sprite.js";` (same for `org/puremvc/...`, `com/greensock/...`). Game-local imports need `.js` too (NodeNext).
- AS3 `Class` -> `import type { Class } from "@edugames/common/flash/utils/Class.js"`. `[Embed]` -> `embed(...)` from `@edugames/common/AssetLoader.js`.
- Members need `this.`; inherited statics need the class name (`instance` -> `Facade.instance`).
- Untyped AS3 `*` -> `any`. `int`/`uint`/`Number` -> `number`, `Boolean` -> `boolean`.
- AS3 default values of untyped-in-TS fields differ (`int` is 0, `Boolean` false, `Number` NaN, objects null; TS gives `undefined`). Add explicit initialisers where the original relies on them.
- `x as T` returns null on failure in AS3; TS `as` is compile-time only. Keep the cast, and use `instanceof` only where the original semantics need it.
- Methods are auto-bound by the polyfill base classes (`bindMethods`). Classes that extend nothing are not: bind by hand if a method is passed around.
- Unused imports are removed, not mocked: never add empty stub modules to `common/` for an import nothing uses.
- Original oddities (e.g. `!ldr.content is Bitmap` precedence) are ported as written, never fixed.
- Local `trace()` -> `console.log`, marked `// PORT:`.

## Testing in a browser

`yarn build && yarn test:browser` (menu -> arcade -> answer run of the real game) opens a visible Chrome (own temp profile), serves the repo on a free port, runs
`scripts/tests/multiply-play.mjs` over the DevTools protocol and writes screenshots to `test-output/` (git-ignored).
Add `--headless` to the script for no window. A 60 s watchdog kills Chrome and the server whatever happens
(`WATCHDOG_MS` to change it). Write new checks as step files in `scripts/tests/`. `window.__stage` is the debug hook.

## Adding a game to the hub

When a game is ported: set its `href` in `hub/src/Hub.ts` (null shows the "SOON" stamp) and, for a new game, add its icon source to
`scripts/tools/make-hub-icons.mjs` and run `node scripts/browser-test.mjs scripts/tools/make-hub-icons.mjs --headless`. `yarn test:hub` checks the hub.

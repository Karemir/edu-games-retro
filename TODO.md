# TODO / decisions log

What we decided (kept as a record) and what is still open. Finished work is not listed here: see git history.

## Decisions

- Target is ActionScript **3** (not AS2 as first thought). See README "Historic API".
- Mirror the AS3 package layout inside `common/src` (`flash/display/Sprite.ts`, `org/puremvc/...`, `com/greensock/...`)
  so ported imports map mechanically. Games import them as `@edugames/common/<as3/path>.js` via an import map.
- Relaxed TypeScript (see README); `useDefineForClassFields: false` so field declarations don't clobber base-constructor state.
- Rendering: retained display list, fully redrawn every frame; frame logic runs at the SWF frame rate (30 fps).
  `ENTER_FRAME` is broadcast to every dispatcher that listens for it, on or off stage.
- AS3 methods are bound to their instance, TS methods are not: polyfill base classes bind subclass methods
  (`bindMethods`) and their own methods lazily (`bindNativeMethods`), so `addEventListener(X, this.OnX)` and
  `setTimeout(this.Foo, ..)` work unchanged.
- Assets: every `[Embed]` becomes a static `embed("path", opts)` (`// PORT:` if it was an instance field), registered in the
  central `AssetLoader` which feeds the loading indicator. Embeds created at module load fill in once the file has loaded.
  `Loader.loadBytes` on an embed resolves from the preload decode; `content` stays null until the async `COMPLETE`.
- `Preloader.as` is ported 1:1 and doubles as the loading indicator.
- Assets are copied into each game folder (`games/<name>/Assets`); embed paths are rewritten relative to `index.html`.
- Embedded fonts are laid out with the font's win ascent/descent and line gap (what the SWF embeds), device fonts with browser metrics.
- GreenSock overwrite default assumed to be v11 TweenLite behaviour: `ALL_ONSTART` (2).
- `motionBlur` is an approximation (averaged copies along the per-frame movement), not GreenSock's BlurFilter version.
- Every deviation from the originals in game code is marked `// PORT:` (`grep -rn "PORT:" games/`).
- Stage scaling: `bootstrap(container, Root, fps, width, height, margin)` fits the game into the container keeping the SWF aspect with a 10% margin and renders at device resolution;
  a 64px copy of each frame, stretched over the container and CSS-blurred (48px), is the backdrop. `stage.scaleMode`/`align` set by games are ignored. The page only provides a sized `#container`.
- Browser tests use `scripts/browser-test.mjs` (CDP, no dependencies) because `playwright-cli` was not on PATH.

## Open

**To decide**
- **Achievements:** Multiply calls `Achievements.*` (NetCom, Popup, GardenMediator, AchievementProxy), compiled in `garden.swc`;
  sources live in `EduAchievements/src`. Currently skipped (`// PORT: achievements TODO`). Port it, stub it, or leave it out?
- **Audio autoplay:** `Sounds` starts the music in its constructor, silent until the first click. Start it on the first gesture?
- **Missing assets:** `Sound.play()` crashes on a failed decode. What should a missing asset do?
- **Test harness:** switch to `playwright-cli` if it gets installed, or keep the CDP script?
- **Next game:** Logic, Letters or Achievements first? (They need `TweenMax`, more plugins, more `TextField`/`Graphics`.)

**To verify**
- Multiply side by side with the Flash original: tower build animations, bounce timing (and the GreenSock overwrite default),
  motion blur look, text layout (single-line height assumes no line gap), sounds, highscores. Only menu -> arcade -> answer is checked.
- Exact GreenSock AS3 minor version of `greensock.swc` (see README).
- Import cycles (`AppFacade` <-> commands/mediators) on other browsers; fine in Chrome.

**Gaps, to fill when a game needs them**
- GreenSock: `TweenMax` (repeat, yoyo, timelines); `useFrames`, `runBackwards` on `fromTo`, easeParams, overwrite modes 3 and 5;
  Tint/RemoveTint/TransformAroundPoint/SoundTransform plugins (they warn and do nothing); `motionBlur` quality/fastMode/rotation.
- `TextField`: one format per field; no input, HTML styling or scrolling.
- `Graphics`: only rect, circle, line, fill and lineStyle (no gradients, bitmap fills, curves).
- Filters, `cacheAsBitmap`, blend modes: stored, not rendered.
- `ColorTransform` is an offscreen pixel pass per frame (fine for a few markers, slow for big trees).
- Sound: `SoundChannel` position/peaks, `SoundTransform.pan`.
- Input: `hitArea`; hover state is not cleared when the hovered object is removed.
- Out of scope for now: EduGameHistory.

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
  each finished frame is averaged (repeated halving) to 48px, blurred on a 192px canvas (`ctx.filter`) and stretched over the container; no CSS filter on the full-size element. `stage.scaleMode`/`align` set by games are ignored. The page only provides a sized `#container`.
- Never read pixels back (`getImageData`) in the frame loop: it stalls the GPU (it cost 58 ms/frame, 17 FPS, before it was removed). Profile with `scripts/tests/multiply-profile.mjs`, compare FPS with `multiply-perf.mjs`.
- Container chrome shared by all games lives in `common/src/ContainerUI.ts` as DOM over the container (not part of the game canvas): back button (top-left),
  music and effects mute (top-right, remembered in localStorage), author credit "by Michał Perzak" (bottom-right). Audio goes through `GameAudio` (music bus + effects bus);
  `Sound.play()` routes looping sounds to music and one-shots to effects, so game code is unchanged.
- Browser tests use `scripts/browser-test.mjs` (CDP, no dependencies) because `playwright-cli` was not on PATH.

## Open

**To decide**
- **Achievements:** Multiply calls `Achievements.*` (NetCom, Popup, GardenMediator, AchievementProxy), compiled in `garden.swc`;
  sources live in `EduAchievements/src`. Currently skipped (`// PORT: achievements TODO`). Port it, stub it, or leave it out?
- **Audio autoplay:** `Sounds` starts the music in its constructor, silent until the first click. Start it on the first gesture?
- **Back button target:** it uses `history.back()`, else goes to `../../` (nothing there yet). Needs a games hub/launcher page; what should it be?
- **Duplicate mute controls:** Multiply's own sound panel (music/effects toggles in the menu) overlaps with the container buttons. Keep both?
- **Backdrop blink:** reported on the machine you use; not reproducible here (screenshots identical, buffer changes < 1/255 per frame). The CSS blur was the suspect and has been removed. Still blinking?
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
- `ColorTransform` uses offscreen compositing (multiply/lighter, no pixel readback): multipliers 0..1 and positive offsets only; negative/alpha offsets ignored. It redraws its subtree offscreen each frame.
- Sound: `SoundChannel` position/peaks, `SoundTransform.pan`.
- Input: `hitArea`; hover state is not cleared when the hovered object is removed.
- Out of scope for now: EduGameHistory.

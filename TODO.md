# TODO / decisions log

Running log of what we decided and what we postponed. Newest entries at the bottom of each section.

## Decisions

- Target is ActionScript **3** (not AS2 as first thought). See README "Historic API".
- Mirror the AS3 package layout inside `common/src` (`flash/display/Sprite.ts`, `org/puremvc/...`,
  `com/greensock/...`) so ported imports map mechanically.
- Games import polyfills as `@edugames/common/<as3/path>.js`; an import map in each `index.html` maps `@edugames/common/` to `common/dist/`.
- Relaxed TypeScript (see README). `useDefineForClassFields: false` so field declarations don't clobber base-constructor state.
- Rendering: retained display list, fully redrawn every frame. Frame logic runs at the SWF frame rate (30 fps).
- `ENTER_FRAME` is broadcast to every dispatcher that listens for it (like Flash), on or off stage.
- AS3 methods are bound to their instance, TS methods are not. Polyfill base classes bind subclass methods
  in their constructor (`bindMethods`), so `addEventListener(X, this.OnX)` and `setTimeout(this.Foo, ..)` work unchanged.
- Assets: every `[Embed]` becomes `embed("path", opts)` (static field, hoisted if it was an instance field, `// PORT:`),
  registered in the central `AssetLoader` which feeds the loading indicator.
- `Loader.loadBytes` on an embed resolves from a decode done during preload; `content` is still null until the async `COMPLETE`.
- `Preloader.as` is ported 1:1 as the loading indicator; the root `MovieClip` reaches its last frame when `AssetLoader` is done.
- Assets are copied into each game folder (`games/<name>/Assets`); embed paths are rewritten relative to `index.html`.

- GreenSock overwrite default assumed to be v11 TweenLite behaviour: `ALL_ONSTART` (2). Verify against visible behaviour of chained tweens (`HeightIndicator`, `TowerBox`).
- First vertical slice is verified: Preloader (loading bar) -> Main smoke scene with embedded Bitmap/font/Sound, click hit-testing, `buttonMode` cursor, bound listeners, TextField and a Bounce tween.

- EduGameMultiply is fully ported (34 files, same layout as the original `src/`), Achievements skipped. Notable deviations are all marked `// PORT:` in the sources
  (`grep -rn "PORT:" games/multiply/src`).
- `DisplayObject.mask` clips to the mask's filled shape (the mask itself is not drawn); native polyfill methods are lazily bound per instance (`bindNativeMethods`);
  embeds instantiated at module load (e.g. `TowerBlockAddon` static initialiser) get their pixels/audio once the file has loaded.

## Postponed

- `motionBlur` GreenSock plugin: no-op for now (used in `TowerBox` brick/roof drops).
- GreenSock plugins other than `autoAlpha` (Tint, RemoveTint, TransformAroundPoint, SoundTransform): activated in `AppCommand` but not used by Multiply tweens.
- Exact GreenSock AS3 minor version of `greensock.swc` (see README).
- **Achievements** (marked for later): `Achievements.*` (NetCom, Popup, GardenMediator, AchievementProxy) is skipped for now; port Multiply without it first (`Main`, `AppFacade`, menu code reference it, mark each spot with `// PORT: achievements TODO`).
  Details: `Achievements.*` (NetCom, Popup, GardenMediator, AchievementProxy): Multiply imports them from the compiled `garden.swc`; sources live in `EduAchievements/src`. Decide how to port/stub.
- Canvas scaling for `StageScaleMode.SHOW_ALL` (fit to window).
- Audio autoplay policy: resume `AudioContext` on first user gesture; background music may start silent until then.
- Filters, `cacheAsBitmap`, blend modes: stored, not rendered.
- `flash.display.Graphics` beyond the calls Multiply uses (gradients, bitmap fills, curves).
- `CustomActions` (`adobe.utils`) is imported but unused: empty stub.
- Games other than Multiply; EduGameHistory is out of scope.
- `TweenMax` and its extras (repeat, yoyo, timelines): other games import it; only TweenLite exists so far.
- `TweenLite` options not implemented: `useFrames`, `runBackwards` on `fromTo`, easeParams, overwrite modes 3 and 5.
- Remaining plugins as real implementations: Tint/RemoveTint/TransformAroundPoint/SoundTransform currently warn and do nothing.
- `ColorTransform` is rendered by an offscreen pixel pass per frame (fine for a few markers, slow for large trees); `Tint` plugins still missing.
- `TextField`: single format per field, no input/HTML styling/scrolling. Revisit when a game needs it.
- `Stage`: `SHOW_ALL` scaling/letterboxing, HiDPI canvas, `stage.focus` keyboard routing details.
- Browser tests use `scripts/browser-test.mjs` (CDP, no deps) because `playwright-cli` was not on PATH; switch if it is installed.
- `Sound`: `SoundChannel` position/leftPeak, `SoundTransform.pan`.
- `Graphics`: only rect/circle/line/fill/lineStyle so far.
- Hit-testing refinements: `mouseEnabled=false` objects still count as hits for their own bounds; `hitArea`; non-interactive overlays.
- Port the real `Main`/game code, replacing the smoke scene in `games/multiply/src/Main.ts`.
- `Sound.play()` with a failed/missing decode crashes (null buffer); decide how a missing asset should behave.
- `Stage`: hover state is not cleared when the hovered object is removed from the display list.
- Review notes: `common/` was reviewed by reading after the first vertical slice; fixed capture-phase dispatch, `mouseEnabled` in hit tests, stale keyboard focus, `SharedObject.getLocal` identity, `Facade` method binding.
- Multiply: verify against the Flash original side by side (tower build animations, bounce timing, sounds, highscores); only the menu -> arcade -> answer flow is checked.
- Multiply: `motionBlur` on tower drops, Achievements button/popups, `Preloader` styling.
- Check import cycles (`AppFacade` <-> commands/mediators) on other browsers; fine in Chrome.
- Audio: `Sounds` starts music in its constructor before any user gesture; silent until the first click.

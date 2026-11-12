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
- Hub (`index.html` + `hub/`): forest from Multiply's tall `gameBg.jpg` (cropped to 960:600 by the icon tool into `hub/assets/hubBg.jpg`) as the stage and blurred backdrop, one tile per game (87px icon like the garden button, label in Myriad Pro Bold). A game with `href: null` in `hub/src/Hub.ts` gets the "SOON" stamp.
  Icons are crops of each game's main image made by `scripts/tools/make-hub-icons.mjs`; the garden tile reuses the original `btnGarden.png`. The game back button falls back to `../../` = the hub.
- Music is muted until the user turns it on (decided by the user; effects start on). The hub press is a user gesture, so the audio context of a game started from the hub is allowed to run.
- Hub loader: pressing a live tile hides the buttons, shows the robot walking left to right (real asset progress, never shorter than 1 s), then starts the game in the same page
  (`boot()` exported by each game's `Boot.ts`, `AssetLoader.basePath` points at the game folder, URL pushed to the history so Back reloads the hub). The games' own pages still work.
- Achievements ported (`achievements/` workspace, `@edugames/achievements`, shared by the games; the garden is its own page `games/garden`, ported from `MainGarden`).
  The server of the original is replaced by `localStorage` (`NetCom`: keys `edugames:achievements` = unlocked codes, `edugames:garden` = slot -> reward); player name and host URL are ignored.
  The games' garden buttons navigate to `../garden/` (the original opened the garden over the game). Unlock popups show in the games as before.
- Garden reward art: the 21 `itm_N` symbols were vector library symbols (`ogrod_popr_01.swc`). Exported once with JPEXS FFDec 26.4.0 (third-party, build-time only, not in the repo),
  packed into lossy-WebP sprite sheets by `scripts/tools/make-garden-items.mjs` (`achievements/Assets/items`, 6.2 MB) and played by `ItemClip` (one frame per ENTER_FRAME, like a MovieClip).
- Letters (Wyścigi Literek) is ported (all reachable code, plays a whole race in the test). Not ported because the original cannot compile them (they use members that do not exist,
  `TextStyles.CreateBookingEntry` and `Events.MENU_TRACK_SELECTED`, and nothing live reaches them): `Visuals/BookingBoard`, `Visuals/BookingScreen`, `Visuals/ScoreBoard`, `Visuals/Parts/ScoreBoardEntry`.
  `Mediators/VehicleSelectLogic` is not ported either (it imports `Visuals.VehicleSelectScreen`, which is not in the sources). Dead code that does compile (`EndgameLogic`, `Proxies/Data/BookingPossibility`) was ported.
- `SplitTextField` (a GreenSock Club class, in the game's own `src`) is ported with the game; it relies on `TextField.getLineMetrics/getLineOffset/getLineText`, approximations of Flash's.
- `Dictionary` supports string keys only (what the originals use). `TweenMax` is the small subset (to/from/fromTo/allTo/allFrom/allFromTo).
- All four hub tiles are live now; the "SOON" stamp mechanism stays in `hub/src/Hub.ts` (`href: null`) for games that are not ported (EduGameHistory).
- Persistence: `SharedObject` is written to localStorage on `flush()`, when the page is hidden/closed and once a second if its data changed (Flash saved shared objects by itself on close; Multiply and Letters never call `flush()`).
  Letters had no saving in the original (`SaveGame`/`LoadGame` were empty stubs, `HasSavedGame` returned `true // TODO`, the resume button was never added): added at the user's request, marked `// PORT:`
  (`GameData` saves under `eduLetters` when a new game starts and after every race result, i.e. when the place popup is dismissed. Pressing GRAJ loads the last save and goes straight to the race-level choice; without a save the new-game panel opens. The resume button stays hidden, as in the original.)
- Deployment: `yarn deploy` uploads the static site (857 files, ~31 MB) to the R2 bucket `www` with wrangler, in parallel and incrementally (`scripts/deploy.mjs`, content types and cache headers set per file: code 5 min, assets 1 h).
- Internal links name `index.html` explicitly (hub tiles, the games' garden buttons, back fallbacks), so the site also works on hosts that do not serve folders (R2 public URL). The worker serves folders anyway.
- Browser tests use `scripts/browser-test.mjs` (CDP, no dependencies) because `playwright-cli` was not on PATH.

## Open

**To decide**
- **Duplicate mute controls:** Multiply's own sound panel (music/effects toggles in the menu) overlaps with the container buttons. Keep both?
- **Backdrop blink:** reported on the machine you use; not reproducible here (screenshots identical, buffer changes < 1/255 per frame). The CSS blur was the suspect and has been removed. Still blinking?
- **Letters save:** one save slot and no way to start over from the menu (GRAJ always loads the last save). Add a "new game" / reset option?
- **Publishing the worker:** `worker/` is written and tested locally but not deployed. `wrangler deploy` needs either a workers.dev subdomain on the account (none is registered yet) or a custom domain/route for it. Which do you want, and under which name?
- **Missing assets:** `Sound.play()` crashes on a failed decode. What should a missing asset do?
- **Test harness:** switch to `playwright-cli` if it gets installed, or keep the CDP script?
- **Achievements load:** the item sheets (6.2 MB) are loaded by every game that imports the package. Lazy-load them (only the garden and the unlock popup need them)?
- **Achievements data:** progress lives in the browser (`localStorage`), shared by all games on this origin; no per-player profiles. Add an export/reset, or leave it?
- **Hub:** EduGameHistory is not listed (out of scope). Add it as a "soon" tile anyway? The hub title/branding ("Gra w Klasy" logos exist in the game art) is undecided; for now no title.

**To verify**
- Garden: dragging/placing works in the test (storage updated); not checked yet: removing an item (shovel), the scroll arrows of the drawer, all 21 items, the info panel on hover, side-by-side with the Flash original.
- Letters: compare side by side with the Flash original: letter positions of `SplitTextField` and the green highlight, racer speeds and AI, place popups, the tournament/map screens, all three tracks, word sounds (358 mp3s, ~12 MB loaded at start: lazy-load?), save data shared with Multiply under `eduMultiply`.
- Logic is ported (26 files) and plays through menu -> difficulty -> level -> running commands; verify side by side with the Flash original: drag-to-reorder of commands, all 20 levels and the end popup, drop-shadow look, tint highlight, sounds. Same Achievements skip as Multiply.
- Multiply side by side with the Flash original: tower build animations, bounce timing (and the GreenSock overwrite default),
  motion blur look, text layout (single-line height assumes no line gap), sounds, highscores. Only menu -> arcade -> answer is checked.
- Exact GreenSock AS3 minor version of `greensock.swc` (see README).
- Import cycles (`AppFacade` <-> commands/mediators) on other browsers; fine in Chrome.

**Gaps, to fill when a game needs them**
- GreenSock: `TweenMax` (repeat, yoyo, timelines); `useFrames`, `runBackwards` on `fromTo`, easeParams, overwrite modes 3 and 5;
  TransformAroundPoint/TransformAroundCenter/SoundTransform plugins (they warn and do nothing; Tint/RemoveTint exist, `{color, amount}` form missing); `motionBlur` quality/fastMode/rotation.
- `TextField`: one format per field; no input, HTML styling or scrolling.
- `Graphics`: only rect, circle, line, fill and lineStyle (no gradients, bitmap fills, curves).
- Filters: only `DropShadowFilter` is rendered (canvas shadow, approximate blur; first shadow only, not combined with tint/blur); `BlurFilter`, `cacheAsBitmap`, blend modes: stored, not rendered.
- `ColorTransform` uses offscreen compositing (multiply/lighter, no pixel readback): multipliers 0..1 and positive offsets only; negative/alpha offsets ignored. It redraws its subtree offscreen each frame.
- Sound: `SoundChannel` position/peaks, `SoundTransform.pan`.
- Input: `hitArea`; hover state is not cleared when the hovered object is removed.
- Out of scope for now: EduGameHistory.

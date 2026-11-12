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
5. **Raw canvas only.** No DOM-based rendering, no libraries.
6. Polyfills stay small and simple: implement only what the games actually use.

## Conventions

- Yarn 1 workspaces: `common`, `games/*`. Packages are `@edugames/<name>`.
- Build with `yarn build` (`tsc -b`); it must pass before a task is done.
- Games are served statically; each `index.html` uses an import map for `@edugames/common`.
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

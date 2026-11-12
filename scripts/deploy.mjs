// Uploads the static site to the R2 bucket with wrangler (`wrangler r2 object put ... --remote`, so you must be logged in: `wrangler login`).
//   yarn deploy            build + upload what changed since the last deploy
//   yarn deploy:dry        build + list what would be uploaded
//   node scripts/deploy.mjs [--dry-run] [--force] [--bucket www] [--jobs 8]      (--force uploads everything again)
// The bucket gets the layout of the repo: /index.html (hub), /hub, /common/dist, /achievements, /games/<name>/{index.html,dist,Assets}.
// What was uploaded is remembered in .deploy-manifest.json (git-ignored), so only changed files are sent next time.
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const flag = name => args.includes(name);
const option = (name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);
const bucket = option("--bucket", "www");
const jobs = Number(option("--jobs", 8));
const dryRun = flag("--dry-run"), force = flag("--force");

const TYPES = {
	".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8",
	".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif", ".svg": "image/svg+xml",
	".mp3": "audio/mpeg", ".ogg": "audio/ogg", ".wav": "audio/wav", ".otf": "font/otf", ".ttf": "font/ttf", ".woff": "font/woff", ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8",
};
const SKIP = [/\.d\.ts$/, /\.d\.ts\.map$/, /\.js\.map$/, /\.tsbuildinfo$/, /(^|\/)\.DS_Store$/, /(^|\/)Thumbs\.db$/, /\.rar$/];
const CODE = new Set([".html", ".js", ".json", ".css"]);

function walk(dir) {
	const out = [];
	for (const name of readdirSync(dir)) {
		const p = join(dir, name);
		if (statSync(p).isDirectory()) out.push(...walk(p)); else out.push(p);
	}
	return out;
}

const roots = ["index.html", "hub/dist", "hub/assets", "common/dist", "achievements/dist", "achievements/Assets"];
for (const g of readdirSync(join(root, "games"))) {
	if (!statSync(join(root, "games", g)).isDirectory()) continue;
	roots.push(`games/${g}/index.html`, `games/${g}/dist`, `games/${g}/Assets`);
}

const files = [];
for (const r of roots) {
	const p = join(root, r);
	if (!existsSync(p)) {
		if (r.endsWith("/dist") || r == "common/dist") { console.error(`missing ${r}: run \`yarn build\` first`); process.exit(1); }
		continue;
	}
	for (const f of statSync(p).isDirectory() ? walk(p) : [p]) {
		const key = relative(root, f).split("\\").join("/");
		if (!SKIP.some(re => re.test(key))) files.push({ path: f, key });
	}
}

const manifestPath = join(root, ".deploy-manifest.json");
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};
const done = manifest[bucket] ?? (manifest[bucket] = {});
for (const f of files) f.hash = createHash("sha256").update(readFileSync(f.path)).digest("hex");
const todo = files.filter(f => force || done[f.key] !== f.hash);
const bytes = todo.reduce((n, f) => n + statSync(f.path).size, 0);
console.log(`${files.length} files in the site, ${todo.length} to upload to r2://${bucket} (${(bytes / 1048576).toFixed(1)} MB)${dryRun ? " [dry run]" : ""}`);
if (dryRun) {
	for (const f of todo) console.log("  " + f.key);
	process.exit(0);
}

const put = f => new Promise(resolveRun => {
	const ext = extname(f.key).toLowerCase();
	const cache = CODE.has(ext) ? "public, max-age=300" : "public, max-age=3600";
	const run = attempt => execFile("wrangler", ["r2", "object", "put", `${bucket}/${f.key}`, "--file", f.path, "--content-type", TYPES[ext] ?? "application/octet-stream", "--cache-control", cache, "--remote"],
		{ maxBuffer: 1 << 24 }, (err, stdout, stderr) => {
			if (err && attempt < 2) return run(attempt + 1);
			resolveRun(err ? { f, error: (stderr || stdout || String(err)).trim().split("\n").slice(-3).join(" | ") } : { f });
		});
	run(1);
});

let next = 0, finished = 0;
const failed = [];
async function worker() {
	while (next < todo.length) {
		const f = todo[next++];
		const r = await put(f);
		finished++;
		if (r.error) { failed.push(r); console.error(`FAILED ${f.key}: ${r.error}`); } else { done[f.key] = f.hash; }
		if (finished % 25 == 0 || finished == todo.length) {
			console.log(`  ${finished}/${todo.length}`);
			writeFileSync(manifestPath, JSON.stringify(manifest, null, 1)); // progress survives an interruption
		}
	}
}
await Promise.all(Array.from({ length: Math.min(jobs, todo.length) }, worker));
writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
console.log(failed.length ? `${failed.length} uploads failed (run again to retry them)` : `uploaded ${todo.length} files to r2://${bucket}`);
process.exit(failed.length ? 1 : 0);

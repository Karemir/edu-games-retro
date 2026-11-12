// Drives a VISIBLE Chrome over the DevTools protocol (node built-ins only, no dependencies).
// Usage: node scripts/browser-test.mjs scripts/tests/<steps>.mjs [--headless]
// A step file default-exports async ({ ev, shot, click, press, pt, send, sleep, goto, baseUrl }) => {}.
// Hard watchdog: everything (Chrome, server) is killed after WATCHDOG_MS no matter what.
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { createServer } from "node:net";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const WATCHDOG_MS = Number(process.env.WATCHDOG_MS ?? 60000);
const CHROME = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const root = resolve(import.meta.dirname, "..");
const stepsFile = process.argv[2];
const headless = process.argv.includes("--headless");
const outDir = join(root, "test-output");
mkdirSync(outDir, { recursive: true });

const children = [];
const cleanup = () => { for (const c of children) try { c.kill("SIGKILL"); } catch {} };
const die = (code, msg) => { if (msg) console.log(msg); cleanup(); process.exit(code); };
setTimeout(() => die(2, `[watchdog] killed after ${WATCHDOG_MS} ms`), WATCHDOG_MS).unref();
process.on("SIGINT", () => die(130));

const freePort = () => new Promise(r => { const s = createServer().listen(0, () => { const p = s.address().port; s.close(() => r(p)); }); });
const sleep = ms => new Promise(r => setTimeout(r, ms));

const webPort = await freePort(), debugPort = await freePort();
children.push(spawn("node", [join(root, "scripts/serve.mjs")], { env: { ...process.env, PORT: String(webPort) }, stdio: "ignore" }));
children.push(spawn(CHROME, [
	...(headless ? ["--headless=new"] : []), "--no-first-run", "--no-default-browser-check", "--autoplay-policy=no-user-gesture-required",
	`--remote-debugging-port=${debugPort}`, `--user-data-dir=${join("/tmp", "edugames-chrome-" + debugPort)}`, "--window-size=1000,700", "about:blank"], { stdio: "ignore" }));

let tab;
for (let i = 0; i < 50 && !tab; i++) {
	try { tab = (await (await fetch(`http://127.0.0.1:${debugPort}/json`)).json()).find(t => t.type == "page"); } catch {}
	if (!tab) await sleep(200);
}
if (!tab) die(1, "Chrome did not start");

const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);
let id = 0;
const pending = new Map();
ws.onmessage = m => {
	const d = JSON.parse(m.data);
	if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); }
	else if (d.method == "Runtime.consoleAPICalled") console.log("[page]", d.params.args.map(a => a.value ?? a.description).join(" "));
	else if (d.method == "Runtime.exceptionThrown") console.log("[page exception]", d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text);
};
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async expression => {
	const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
	return r.result?.result?.value ?? r.result?.exceptionDetails?.exception?.description;
};
const shot = async name => {
	const r = await send("Page.captureScreenshot", { format: "png" });
	writeFileSync(join(outDir, name + ".png"), Buffer.from(r.result.data, "base64"));
	console.log("[shot]", join("test-output", name + ".png"));
};
const click = async (x, y) => {
	await send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y });
	await send("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "left", clickCount: 1 });
	await send("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button: "left", clickCount: 1 });
};

await send("Runtime.enable");
await send("Page.enable");
let failed = false;
try {
	const steps = (await import(pathToFileURL(resolve(stepsFile)).href)).default;
	// stage (game) coordinates -> page coordinates, whatever the canvas is scaled to
const pt = async (x, y) => {
	const r = JSON.parse(await ev("JSON.stringify((() => { const r = document.getElementById('stage').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, sw: window.__stage.stageWidth, sh: window.__stage.stageHeight }; })())"));
	return { x: r.x + x * r.w / r.sw, y: r.y + y * r.h / r.sh, k: r.w / r.sw };
};
	const press = async (key, code, keyCode) => { for (const type of ["keyDown", "keyUp"]) await send("Input.dispatchKeyEvent", { type, key, code, windowsVirtualKeyCode: keyCode, text: type == "keyDown" && key.length == 1 ? key : undefined }); };
	await steps({ ev, shot, click, press, pt, send, sleep, baseUrl: `http://localhost:${webPort}`, goto: url => send("Page.navigate", { url: `http://localhost:${webPort}${url}` }) });
} catch (e) {
	failed = true;
	console.log("[test failed]", e?.message ?? e);
}
die(failed ? 1 : 0, failed ? "FAIL" : "PASS");

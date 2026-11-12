// Minimal static file server for the repo root (node built-ins only).
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(import.meta.url), "..", "..");
const port = Number(process.env.PORT ?? 8080);
const types = {
  ".html": "text/html", ".js": "text/javascript", ".map": "application/json",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
  ".mp3": "audio/mpeg", ".otf": "font/otf", ".ttf": "font/ttf",
};

createServer(async (req, res) => {
  let path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (path.endsWith("/")) path += "index.html";
  try {
    res.setHeader("Content-Type", types[extname(path)] ?? "application/octet-stream");
    res.end(await readFile(join(root, path)));
  } catch {
    res.statusCode = 404;
    res.end("not found");
  }
}).listen(port, () => console.log(`http://localhost:${port}/games/multiply/`));

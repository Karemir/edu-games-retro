// Static website in front of an R2 bucket. R2 itself does not know "folders", so this worker adds what a web server does:
//   /                      -> /index.html
//   /games/multiply/       -> /games/multiply/index.html
//   /games/multiply        -> 301 /games/multiply/   (so that relative links inside the page keep working)
// Everything else is the object with that key. Range and conditional requests (ETag) are passed on to R2.
// No dependencies: the few Cloudflare types that are needed are declared here.

interface R2HttpMetadata { contentType?: string; cacheControl?: string; contentEncoding?: string; contentLanguage?: string; contentDisposition?: string }
interface R2Object { key: string; size: number; httpEtag: string; httpMetadata?: R2HttpMetadata; writeHttpMetadata(headers: Headers): void }
interface R2ObjectBody extends R2Object { body: ReadableStream }
interface R2Bucket {
	get(key: string, options?: { range?: Headers; onlyIf?: Headers }): Promise<R2Object | R2ObjectBody | null>;
	head(key: string): Promise<R2Object | null>;
}
interface Env { BUCKET: R2Bucket }

const NOT_FOUND = "404 not found\n";

function keyFor(pathname: string): string | null {
	let path: string;
	try {
		path = decodeURIComponent(pathname);
	} catch (e) {
		return null;
	}
	if (path.split("/").some(part => part === ".." || part === ".")) return null;
	return path.replace(/^\/+/, "");
}

function isBody(o: R2Object | R2ObjectBody): o is R2ObjectBody {
	return "body" in o && !!(o as R2ObjectBody).body;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		if (request.method !== "GET" && request.method !== "HEAD") {
			return new Response("method not allowed\n", { status: 405, headers: { Allow: "GET, HEAD" } });
		}
		const url = new URL(request.url);
		const key = keyFor(url.pathname);
		if (key === null) return new Response("bad request\n", { status: 400 });

		let objectKey = key;
		if (key === "" || key.endsWith("/")) {
			objectKey = key + "index.html";
		} else if (!/\.[^/]+$/.test(key.split("/").pop() as string) && (await env.BUCKET.head(key + "/index.html"))) {
			// a folder requested without the slash: redirect, relative URLs of the page resolve against the folder
			url.pathname = url.pathname + "/";
			return Response.redirect(url.toString(), 301);
		}

		const isHead = request.method === "HEAD";
		const object = isHead ? await env.BUCKET.head(objectKey) : await env.BUCKET.get(objectKey, { range: request.headers, onlyIf: request.headers });
		if (!object) return new Response(isHead ? null : NOT_FOUND, { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });

		const headers = new Headers();
		object.writeHttpMetadata(headers);
		headers.set("ETag", object.httpEtag);
		headers.set("Accept-Ranges", "bytes");
		headers.set("X-Content-Type-Options", "nosniff");

		if (isHead) {
			headers.set("Content-Length", String(object.size));
			return new Response(null, { status: 200, headers });
		}
		if (!isBody(object)) {
			// a conditional request that matched: nothing to send
			return new Response(null, { status: 304, headers });
		}
		const ranged = request.headers.has("Range") && (object as unknown as { range?: unknown }).range !== undefined;
		return new Response(object.body, { status: ranged ? 206 : 200, headers });
	},
};

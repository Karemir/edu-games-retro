import type { URLRequest } from "./URLRequest.js";

export function navigateToURL(request: URLRequest, window_: string = null): void {
	window.open(request.url, window_ || "_self");
}

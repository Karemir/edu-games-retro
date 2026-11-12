const start = Date.now();

export function getTimer(): number {
	return Date.now() - start;
}

export function setTimeout(closure: Function, delay: number, ...args: any[]): number {
	return window.setTimeout(() => closure(...args), delay);
}

export function clearTimeout(id: number): void {
	window.clearTimeout(id);
}

export function setInterval(closure: Function, delay: number, ...args: any[]): number {
	return window.setInterval(() => closure(...args), delay);
}

export function clearInterval(id: number): void {
	window.clearInterval(id);
}

import assert from "node:assert/strict";

// SharedObject data written without flush() must still reach localStorage (Flash saved on close).
export default async ({ ev, sleep, goto }) => {
	await goto("/");
	await sleep(500);
	await ev("localStorage.clear(); 'ok'");
	const run = (code) => ev(`(async () => { const { SharedObject } = await import('/common/dist/flash/net/SharedObject.js'); ${code} })()`);
	await run(`SharedObject.getLocal('autoA').data.count = 41; return 'set';`);
	await sleep(1300);
	assert.equal(await ev("localStorage.getItem('SharedObject:autoA')"), '{"count":41}', "written by the periodic flush");
	await run(`SharedObject.getLocal('autoB').data.n = 7; window.dispatchEvent(new Event('pagehide')); return 'ok';`);
	assert.equal(await ev("localStorage.getItem('SharedObject:autoB')"), '{"n":7}', "written when the page is closed");
	// survives a reload, and later changes are picked up too
	await goto("/");
	await sleep(500);
	assert.equal(await run(`return SharedObject.getLocal('autoA').data.count;`), 41, "read back after a reload");
	await run(`SharedObject.getLocal('autoA').data.count = 42; return 'ok';`);
	await sleep(1300);
	assert.equal(await ev("localStorage.getItem('SharedObject:autoA')"), '{"count":42}', "changes are saved again");
};

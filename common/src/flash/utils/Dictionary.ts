/** Property bag with string keys. PORT: the object keys (identity) of AS3's Dictionary are not supported; the originals use strings. */
export class Dictionary {
	[key: string]: any;

	constructor(weakKeys: boolean = false) {}
}

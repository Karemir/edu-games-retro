export class ByteArray {
	public data: Uint8Array;
	public position: number = 0;
	/** PORT: link to the AssetLoader entry this array was embedded from (lets Loader reuse the preload decode). */
	public asset: any = null;

	constructor(data: Uint8Array = new Uint8Array(0)) {
		this.data = data;
	}

	public get length(): number { return this.data.length; }
	public get bytesAvailable(): number { return this.data.length - this.position; }

	public readUTFBytes(length: number): string {
		const s = new TextDecoder("utf-8").decode(this.data.subarray(this.position, this.position + length));
		this.position += length;
		return s;
	}

	public readByte(): number { return (this.data[this.position++] << 24) >> 24; }
	public readUnsignedByte(): number { return this.data[this.position++]; }
}

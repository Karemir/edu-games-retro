/** Vertical metrics of an embedded font, in em. Flash lays embedded fonts out with the font's win ascent/descent and line gap. */
export interface FontMetrics {
	ascent: number;
	descent: number;
	leading: number;
}

const registry: { [fontName: string]: FontMetrics } = {};

export function setFontMetrics(fontName: string, metrics: FontMetrics): void {
	registry[fontName] = metrics;
}

export function getFontMetrics(fontName: string): FontMetrics | null {
	return registry[fontName] || null;
}

/** Reads head.unitsPerEm, OS/2 winAscent/winDescent and hhea.lineGap from a TrueType/OpenType file. */
export function parseFontMetrics(buffer: ArrayBuffer): FontMetrics | null {
	const v = new DataView(buffer);
	const tables: { [tag: string]: number } = {};
	const n = v.getUint16(4);
	for (let i = 0; i < n; i++) {
		const o = 12 + i * 16;
		tables[String.fromCharCode(v.getUint8(o), v.getUint8(o + 1), v.getUint8(o + 2), v.getUint8(o + 3))] = v.getUint32(o + 8);
	}
	if (!tables["head"] || !tables["hhea"] || !tables["OS/2"]) return null;
	const upm = v.getUint16(tables["head"] + 18);
	return {
		ascent: v.getUint16(tables["OS/2"] + 74) / upm,
		descent: v.getUint16(tables["OS/2"] + 76) / upm,
		leading: v.getInt16(tables["hhea"] + 8) / upm,
	};
}

export class Font {
	public fontName: string = "";
	public fontStyle: string = "regular";
	public fontType: string = "embedded";

	/** PORT: the AssetLoader already registered the face with the browser (document.fonts) during preload. */
	public static registerFont(font: Function): void {}
	public static enumerateFonts(enumerateDeviceFonts: boolean = false): Font[] { return []; }
}

export class Capabilities {
	public static readonly isDebugger: boolean = false;
	public static readonly playerType: string = "PlugIn";
	public static readonly os: string = navigator.platform;
	public static readonly language: string = navigator.language.slice(0, 2);
	public static readonly version: string = "WEB 11,8,0,0";
}

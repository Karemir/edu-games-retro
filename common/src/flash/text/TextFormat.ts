export class TextFormat {
	public font: string;
	public size: any;
	public color: any;
	public bold: any;
	public italic: any;
	public underline: any;
	public url: string;
	public target: string;
	public align: string;
	public leftMargin: any;
	public rightMargin: any;
	public indent: any;
	public leading: any;
	public letterSpacing: any;

	constructor(font: string = null, size: any = null, color: any = null, bold: any = null, italic: any = null, underline: any = null,
		url: string = null, target: string = null, align: string = null, leftMargin: any = null, rightMargin: any = null, indent: any = null, leading: any = null) {
		this.font = font;
		this.size = size;
		this.color = color;
		this.bold = bold;
		this.italic = italic;
		this.underline = underline;
		this.url = url;
		this.target = target;
		this.align = align;
		this.leftMargin = leftMargin;
		this.rightMargin = rightMargin;
		this.indent = indent;
		this.leading = leading;
	}
}

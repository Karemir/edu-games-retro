/**
 * VERSION: 0.6
 * DATE: 1/6/2010
 * AS3
 * UPDATES AND DOCUMENTATION AT: http://blog.greensock.com
 **/
import type { DisplayObjectContainer } from "@edugames/common/flash/display/DisplayObjectContainer.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { Matrix } from "@edugames/common/flash/geom/Matrix.js";
import { Point } from "@edugames/common/flash/geom/Point.js";
import type { Rectangle } from "@edugames/common/flash/geom/Rectangle.js";
import { TextField } from "@edugames/common/flash/text/TextField.js";
import { TextFieldAutoSize } from "@edugames/common/flash/text/TextFieldAutoSize.js";
import type { TextFormat } from "@edugames/common/flash/text/TextFormat.js";
import { TextFormatAlign } from "@edugames/common/flash/text/TextFormatAlign.js";
import type { TextLineMetrics } from "@edugames/common/flash/text/TextLineMetrics.js";
/**
 * SplitTextField makes it easy to break apart a TextField so that each character, word, or line 
 * is in its own TextField, making complex animation simple. When you create a SplitTextField, it 
 * seamlessly replaces the source TextField with itself (a Sprite) containing these multiple TextFields, 
 * all conveniently stored in a <b><code>textFields</code></b> array that you can, for example, 
 * feed to a <code>TweenMax.allFrom()</code> or loop through to create unique tweens for each character, 
 * word or line. The SplitTextField keeps the same scale/rotation/position as the source TextField, 
 * and you can optionally offset the registration point by a certain number of pixels on its local 
 * x- or y-axis, which can be useful if, for example, you want to be able to scale the whole 
 * SplitTextField from its center instead of its upper left corner. Use an onComplete in your
 * tween to call the SplitTextField's <code>deactivate()</code> or <code>destroy()</code> method 
 * which will swap the original TextField back into place. <br /><br />
 * 
 * @example Example AS3 code:<listing version="3.0">
import com.greensock.text.SplitTextField;
import com.greensock.TweenMax;
import com.greensock.easing.Elastic;
import com.greensock.plugins.~~;
import flash.geom.Point;

//split myTextField1 by characters (the default type of split)
var stf1:SplitTextField = new SplitTextField(myTextField1);

//tween each character down from 100 pixels above while fading in, and offset the start times by 0.05 seconds
TweenMax.allFrom(stf1.textFields, 1, {y:"-100", autoAlpha:0, ease:Elastic.easeOut}, 0.05);

//split myTextField2 by words
var stf2:SplitTextField = new SplitTextField(myTextField2, SplitTextField.TYPE_WORDS);

//explode the words outward using the physics2D feature of TweenLite/Max
TweenPlugin.activate([Physics2DPlugin]);
var i:int = stf2.textFields.length;
var explodeOrigin:Point = new Point(stf2.width ~~ 0.4, stf2.height + 100);
while (i--) {
	var angle:Number = Math.atan2(stf2.textFields[i].y - explodeOrigin.y, stf2.textFields[i].x - explodeOrigin.x) ~~ 180 / Math.PI;
	TweenMax.to(stf2.textFields[i], 2, {physics2D:{angle:angle, velocity:Math.random() ~~ 200 + 150, gravity:400}, scaleX:Math.random() ~~ 4 - 2, scaleY:Math.random() ~~ 4 - 2, rotation:Math.random() ~~ 100 - 50, autoAlpha:0, delay:1 + Math.random()});
}

//split myTextField3 by lines
var stf3:SplitTextField = new SplitTextField(myTextField3, SplitTextField.TYPE_LINES);

//slide each line in from the right, fading it in over 1 second and staggering the start times by 0.5 seconds. Then swap the original TextField back in.
TweenMax.allFrom(stf3.textFields, 1, {x:"200", autoAlpha:0, onComplete:stf3.deactivate}, 0.5);

</listing>
 * 
 * <b>NOTES / LIMITATIONS</b><br />
 * <ul>
 * 		<li>Does not recognize "Auto kern" feature in Flash.</li>
 * 		<li>Positioning may be incorrect when non-standard anti-aliasing is used (like "anti-alias for readability"). Even with standard anti-aliasing, depending on the specific font you use positioning may be <i>slightly</i> off.</li>
 * 		<li>Does not work with htmlText</li>
 * 		<li>To improve performance, mouseChildren is set to false by default (you're welcome to set it to true if you need the TextFields to receive MouseEvents)</li>
 * 		<li>To avoid some bugs in the way Flash renders TextFields, when creating TextField instances
 * 			dynamically make sure you set the various properties of the TextField <b>BEFORE</b> adding
 * 			the actual text. For example, set the <code>width, height, embedFonts, autoSize, multiline,</code> and 
 * 			other properties before setting the <code>text</code> property.</li>
 * 		<li>Not intended for use in Flex (use FlexSplitTextField instead)</li>
 * </ul><br />
 * 
 * SplitTextField is a <a href="http://blog.greensock.com/club/">Club GreenSock</a> membership benefit. 
 * You must have a valid membership to use this class without violating the terms of use. Visit 
 * <a href="http://blog.greensock.com/club/">http://blog.greensock.com/club/</a> to sign up or get more details. <br /><br />
 * 
 * <b>Copyright 2009, GreenSock. All rights reserved.</b> This work is subject to the terms in <a href="http://www.greensock.com/terms_of_use.html">http://www.greensock.com/terms_of_use.html</a> or for corporate Club GreenSock members, the software agreement that was issued with the corporate membership.
 * 
 * @author Jack Doyle, jack@greensock.com
 */	
export class SplitTextField extends Sprite {
	/** @private **/
	public static readonly version: number = 0.6;
	/** Split type: characters **/
	public static readonly TYPE_CHARACTERS: string = "characters";
	/** Split type: words **/
	public static readonly TYPE_WORDS: string = "words";
	/** Split type: lines **/
	public static readonly TYPE_LINES: string = "lines";
	
	/** @private **/
	private static readonly _propNames: any[] = ["embedFonts","alpha","antiAliasType","blendMode","filters","focusRect","gridFitType","mouseEnabled","sharpness","selectable","textColor","thickness"];
	
	/** @private **/
	private _splitType: string;
	/** @private **/
	private _regOffsetX: number;
	/** @private **/
	private _regOffsetY: number;
	/** @private **/
	private _source: TextField;
	
	/** Array of TextFields resulting from the split (one for each character, word, or line based on the splitType) **/
	public textFields: any[];
	
	/**
	 * Constructor.
	 * 
	 * @param source The source TextField that should be split apart. Remember, this TextField will be replaced in the display list with the SplitTextField (which is essentially a Sprite containing the various resulting TextFields).
	 * @param splitType Determines the way in which the TextField is split apart - either by characters, words, or lines. Use the <code>TYPE_CHARACTERS, TYPE_WORDS,</code> and <code>TYPE_LINES</code> constants.
	 * @param regOffsetX To offset the registration point by a certain number of pixels along its x-axis (according to the SplitTextField's internal coordinate system), use regOffsetX.
	 * @param regOffsetY To offset the registration point by a certain number of pixels along its y-axis (according to the SplitTextField's internal coordinate system), use regOffsetY.
	 */
	constructor(source: TextField = null, splitType: string = "characters", regOffsetX: number = 0, regOffsetY: number = 0) {
		super();
		this._source = source;
		this._splitType = splitType;
		this._regOffsetX = regOffsetX;
		this._regOffsetY = regOffsetY;
		this.mouseChildren = false;
		this.textFields = [];
		if (source) {
			this.update();
		}
	}
	
	/**
	 * This static method can be used to split apart any TextField and place the resulting
	 * TextFields into any DisplayObjectContainer. It provides the core functionality of the 
	 * SplitTextField class, but can be used apart from any instance thereof as well. 
	 * 
	 * @param source The source TextField that should be split apart. Remember, this TextField will be replaced in the display list with the SplitTextField (which is essentially a Sprite containing the various resulting TextFields).
	 * @param splitType Determines the way in which the TextField is split apart - either by characters, words, or lines. Use the <code>TYPE_CHARACTERS, TYPE_WORDS,</code> and <code>TYPE_LINES</code> constants.
	 * @param container The DisplayObjectContainer into which the new TextFields should be placed.
	 * @param offset Determines the offset x/y of the new TextFields. By default, the TextFields will be positioned in the container as though the container's registration point was aligned perfectly with the source TextField's. The source TextField's scale, rotation, and x/y coordinates will have no effect whatsoever. 
	 * @return Array of TextFields resulting from the split.
	 */
	public static split(source: TextField, spitType: string = "characters", container: DisplayObjectContainer = null, offset: Point = null): any[] {
		if (container == null) {
			container = source.parent;
		}
		if (offset == null) {
			offset = new Point(0,0);
		}
		let index: number = (source.parent == container) ? source.parent.getChildIndex(source) : container.numChildren;
		let segments: any[];
		let cnt: number = 0;
		let linesTotal: number = source.numLines;
		let bounds: Rectangle = source.getBounds(source); //TextFields created in the Flash IDE usually have a -2 pixel offset, dynamically-created ones have a 0 pixel offset, and on the Mac, they can vary wildly! So we getBounds() to figure out how to compensate.
		let y: number = bounds.y + offset.y;
		let fields: any[] = [];
		let format: TextFormat, tf: TextField, x: number, line: number, i: number, j: number, l: number, text: string, totalSegments: number, charOffset: number, lineMetrics: TextLineMetrics, ascentDiff: number;
		
		for (line = 0; line < linesTotal; line++) {
			
			text = source.getLineText(line);
			charOffset = source.getLineOffset(line);
			lineMetrics = source.getLineMetrics(line);
			
			if (source.text.length <= charOffset) { //sometimes Flash adds an extra line to the end unnecessarily
				continue;
			}
			
			//There are bugs in TextField.getCharBoundaries() that incorrectly returned null results occassionally, so we must figure it out using the align of the line.
			format = source.getTextFormat(charOffset, charOffset + 1);
			if (format.align == "left") {
				x = bounds.x + offset.x;
			} else if (format.align == "center") {
				x = bounds.x + offset.x - 2 + (source.width - lineMetrics.width) * 0.5;
			} else {
				x = bounds.x + offset.x - 4 + (source.width - lineMetrics.width);
			}
			
			if (spitType == SplitTextField.TYPE_CHARACTERS) {
				segments = text.split("");
			} else if (spitType == SplitTextField.TYPE_WORDS) {
				segments = text.split(" ").join("~#$ ~#$").split("~#$");
			} else {
				segments = [text];
			}
			totalSegments = segments.length;
			
			for (i = 0; i < totalSegments; i++) {
				if (segments[i].length == 0) {
					continue;
				}
				tf = new TextField();
				
				j = SplitTextField._propNames.length;
				while (j--) {
					(tf as any)[SplitTextField._propNames[j]] = (source as any)[SplitTextField._propNames[j]];
				}
				tf.autoSize = TextFieldAutoSize.LEFT;
				tf.selectable = tf.multiline = tf.wordWrap = false;
				tf.text = segments[i];
				
				l = segments[i].length;
				for (j = 0; j < l; j++) {
					format = source.getTextFormat(charOffset, charOffset + 1);
					charOffset += 1;
					format.align = TextFormatAlign.LEFT;
					tf.setTextFormat(format, j, j + 1);
				}
				
				tf.x = x;
				tf.y = y;
				ascentDiff = lineMetrics.ascent - tf.getLineMetrics(0).ascent; //if different formatting is used on the same line (for example, a 50px letter next to a 12px letter), we must adjust the y position to make the baselines match.
				if (ascentDiff) {
					tf.y += ascentDiff;
				}
				x += tf.textWidth;
				if (segments[i] != " ") {
					fields[cnt++] = tf;
				}
			}
			
			y += lineMetrics.height;
			
			
		}
		
		i = fields.length;
		while (i--) {
			container.addChildAt(fields[i] as TextField, index);
		}
		if (source.parent) {
			source.parent.removeChild(source);
		}
		
		return fields;
	}
	
	/** When a SplitTextField is activated, it takes the place of the source TextField in the display list. **/
	public activate(): void {
		this.activated = true;
	}
	
	/** 
	 * When a SplitTextField is deactivated, it swaps the source TextField back into the display list. 
	 * This makes it simple to animate the SplitTextField's contents with TweenLite/Max and then use 
	 * an onComplete to call deactivate() which will swap the original (source) TextField back into place.
	 **/
	public deactivate(): void {
		this.activated = false;
	}
	
	/** 
	 * Deactivates the SplitTextField (swapping the original TextField back into place) and 
	 * deletes all child TextFields that resulted from the split operation, and nulls references to 
	 * the source so that it's eligible for garbage collection. 
	 **/
	public destroy(): void {
		this.activated = false;
		this.clear();
		this._source = null;
	}
	
	/** @private **/
	private update(): void {
		this.clear();
		if (this._source.parent) {
			var p: DisplayObjectContainer = this._source.parent;
			p.addChildAt(this, p.getChildIndex(this._source));
			p.removeChild(this._source);
		}
		var m: Matrix = this._source.transform.matrix;
		if (this._regOffsetX != 0 || this._regOffsetY != 0) {
			var point: Point = m.transformPoint(new Point(this._regOffsetX, this._regOffsetY));
			m.tx = point.x;
			m.ty = point.y;
		}
		this.transform.matrix = m;
		this.textFields = SplitTextField.split(this._source, this._splitType, this, new Point(-this._regOffsetX, -this._regOffsetY));
	}
	
	/** @private **/
	private clear(): void {
		var i: number = this.textFields.length;
		while (i--) {
			this.removeChild(this.textFields[i]);
		}
		this.textFields = [];
	}
	
	/** The source TextField that gets split apart. **/
	public get source(): TextField {
		return this._source;
	}
	public set source(tf: TextField) {
		this._source = tf;
		this.update();
	}
	
	/** Determines the way in which the source TextField is split apart - either by characters, words, or lines. Use the <code>TYPE_CHARACTERS, TYPE_WORDS,</code> and <code>TYPE_LINES</code> constants. **/
	public get splitType(): string {
		return this._splitType;
	}
	public set splitType(type: string) {
		this._splitType = type;
		this.update();
	}
	
	/** To offset the registration point by a certain number of pixels along its x-axis (according to the SplitTextField's internal coordinate system), use regOffsetX. **/
	public get regOffsetX(): number {
		return this._regOffsetX;
	}
	public set regOffsetX(x: number) {
		this._regOffsetX = x;
		this.update();
	}
	
	/** To offset the registration point by a certain number of pixels along its y-axis (according to the SplitTextField's internal coordinate system), use regOffsetY. **/
	public get regOffsetY(): number {
		return this._regOffsetY;
	}
	public set regOffsetY(y: number) {
		this._regOffsetY = y;
		this.update();
	}
	
	/** When a SplitTextField is activated, it replaces the source TextField in the display list. When it is deactivated, it swaps the source TextField back into place **/
	public get activated(): boolean {
		return Boolean(this.parent != null);
	}
	public set activated(b: boolean) {
		if (this._source == null) {
			return;
		}
		if (this._source.parent && b) {
			this._source.parent.addChildAt(this, this._source.parent.getChildIndex(this._source));
			this._source.parent.removeChild(this._source);
		} else if (this.parent && !b) {
			this.parent.addChildAt(this._source, this.parent.getChildIndex(this));
			this.parent.removeChild(this);
		}
	}

}

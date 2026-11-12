import { embed } from "@edugames/common/AssetLoader.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { Event } from "@edugames/common/flash/events/Event.js";
import { MouseEvent } from "@edugames/common/flash/events/MouseEvent.js";
import type { Class } from "@edugames/common/flash/utils/Class.js";
import { ByteArray } from "@edugames/common/flash/utils/ByteArray.js";
import { Brick } from "./Brick.js";
import { Character } from "./Character.js";

/** 
 * ...
 * @author Michal Perzak
 */
export class GameLevel extends Sprite {
	private static levelData: Class = embed("Assets/Levels.txt", { mimeType: "application/octet-stream" });
	
	public bricks: Brick[]; // PORT: Vector.<Brick>
	public brickGrid: any[];
	public startBrick: Brick;
	public player: Sprite;
	
	public movesFor3Stars: number;
	public movesFor2Stars: number;		
	public moveDir: number = 0; // PORT: int default
	
	public static readonly LEVEL_SIZE_X: number = 11;
	public static readonly LEVEL_SIZE_Y: number = 11;
	
	/**
	 * Builds a new level
	 * @param	levelId Id of the level to build
	 */
	constructor(levelId: number) {
		super();
		let data: any[] = this.ReadLevelData(levelId);
		
		this.bricks = [];
		this.brickGrid = new Array();
		for (var i: number = 0; i < GameLevel.LEVEL_SIZE_Y; ++i) {
			this.brickGrid[i] = new Array();
		}
		
		for (var lx: number = 0; lx < GameLevel.LEVEL_SIZE_X; ++lx) {
			for (var ly: number = 0; ly < GameLevel.LEVEL_SIZE_Y; ++ly) {
				var b: Brick = new Brick(data[lx][ly]);
				b.indexX = lx;
				b.indexY = ly;
				this.brickGrid[ly][lx] = b;
				this.bricks.push(b);
				this.addChild(b);
				
				if (data[lx][ly] == Brick.DATA_START_BRICK) {
					this.startBrick = b;
					this.moveDir = 0;
				}
				if (data[lx][ly] == Brick.DATA_START_BRICK_LEFT) {
					this.startBrick = b;
					this.moveDir = 2; //BL
				}
				if (data[lx][ly] == Brick.DATA_START_BRICK_RIGHT) {
					this.startBrick = b;
					this.moveDir = 0; // TR
				}
				if (data[lx][ly] == Brick.DATA_START_BRICK_UP) {
					this.startBrick = b;
					this.moveDir = 3; // TL
				}
				if (data[lx][ly] == Brick.DATA_START_BRICK_DOWN) {
					this.startBrick = b;
					this.moveDir = 1; // BR
				}
			}
		}
		
		var baseBrick: Brick = this.brickGrid[0][0];
		baseBrick.x = 25;
		baseBrick.y = 250;
		for (lx = 0; lx < GameLevel.LEVEL_SIZE_X; ++lx) {
			for (ly = 0; ly < GameLevel.LEVEL_SIZE_Y; ++ly) {
				var curBrick: Brick = this.brickGrid[lx][ly];
				if (ly > 0) curBrick.SetNorth(this.brickGrid[lx][ly - 1]);
				if (ly < GameLevel.LEVEL_SIZE_Y - 1) curBrick.SetSouth(this.brickGrid[lx][ly + 1]);
				if (lx > 0) curBrick.SetWest(this.brickGrid[lx - 1][ly]);
				if (lx < GameLevel.LEVEL_SIZE_X -1) curBrick.SetEast(this.brickGrid[lx + 1][ly]);
			}
		}
		
		for (let animBrick of this.bricks) {
			animBrick.AnimateIn();
		}
		
		this.UpdateBrickDepths();
	}
	
	public GetStartDirection(): number {
		return this.moveDir;
	}
	
	public AddBrick(b: Brick): void {
		this.addChild(b);
		this.bricks.push(b);
	}
	
	public SetPlayer(player: Sprite): void {
		this.player = player;
		this.addChild(player);
		this.UpdateBrickDepths();
	}
	
	public UpdateBrickDepths(): void {
		var list: Sprite[] = []; // PORT: Vector.<Sprite>
		list = list.concat(this.bricks);
		if(this.player){
			list.push(this.player);
		}
		
		list = list.sort(this.BrickComparer);
		var i: number = 0;
		for (let b of list) {
			this.setChildIndex(b, i++);
		}
	}
	
	private BrickComparer(b1: Sprite, b2: Sprite): number {
		var b1y: number = b1.y;
		var b2y: number = b2.y;
		if (b1 instanceof Character) {
			b1y += 10;
		}
		if (b2 instanceof Character) {
			b2y += 10;
		}
		
		if (b1y < b2y)
			return -1;
		if (b1y == b2y)
			return b1.x - b2.x;
		return 1;
	}
	
	/**
	 * Reads level data from file
	 * @param	levelId
	 * @return array[SIZE][SIZE] with literal data
	 */
	private ReadLevelData(levelId: number): any[] {
		var b: ByteArray = new GameLevel.levelData();
		var s: string = b.readUTFBytes(b.length);
		
		var pattern: string = "^" + levelId + "%.*%" + levelId;
		var exp: RegExp = new RegExp(pattern, "sm");
		
		var results: any[] = s.match(exp);
		if (!results || results.length == 0) {
			throw new Error("No such level: " + levelId);
		}
		var lvlstring: string = results[0];
		lvlstring = lvlstring.replace(/\r\n/g, '');
		var datastart: number = lvlstring.indexOf("%") + 1;
		var movesstring: string = lvlstring.substr(datastart + GameLevel.LEVEL_SIZE_X * GameLevel.LEVEL_SIZE_Y, 4);
		lvlstring = lvlstring.substr(datastart, GameLevel.LEVEL_SIZE_X * GameLevel.LEVEL_SIZE_Y);

		var retval: any[] = new Array();
		var idx: number = 0;
		for (var lx: number = 0; lx < GameLevel.LEVEL_SIZE_X; ++lx) {
			retval.push(new Array());
			for (var ly: number = 0; ly < GameLevel.LEVEL_SIZE_Y; ++ly) {
				retval[lx].push(lvlstring.charAt(idx));
				idx++;
			}
		}
		
		this.movesFor3Stars = Number(movesstring.substr(0, 2)) | 0; // PORT: int()
		this.movesFor2Stars = Number(movesstring.substr(2, 2)) | 0; // PORT: int()
		
		return retval;
	}
	
	public static GetLevelsCount(): number {
		var b: ByteArray = new GameLevel.levelData();
		var s: string = b.readUTFBytes(b.length);
		
		var pattern: string = "%[0-9]+";
		var exp: RegExp = new RegExp(pattern, "g");
		
		var results: any[] = s.match(exp);
		return results.length;
	}
}

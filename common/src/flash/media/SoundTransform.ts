export class SoundTransform {
	public volume: number;
	public pan: number;

	constructor(vol: number = 1, panning: number = 0) {
		this.volume = vol;
		this.pan = panning;
	}
}

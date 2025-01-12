import CanvasEffect from '../CanvasEffect';
import Triangle from './Triangle';
import * as validate from '../CanvasEffect/validate';
import * as Delaunator from 'delaunator';
import OpenSimplexNoise from 'open-simplex-noise';

export interface Config {
	container: string | Element;
	width: any;
	height: any;
	seed?: number;
	color?: [number, number, number, number];
	mouse?: boolean;
	max?: number;
	stroke?: {
		color?: [number, number, number, number];
		width?: number;
	}
}

export default class Polygonal extends CanvasEffect<Config> {
	private apex: number;
	private complexity: number;
	private light: [number, number, number];
	private mouse: boolean;
	private seed: number;
	private simplex: OpenSimplexNoise;
	private triangles: Array<Triangle>;
	constructor(config: Config) {
		super(config);
		this.apex = this.getApexHeight();
		this.light = this.getLightSource(this.apex);
		this.mouse = true;
		this.seed = 16000;
		this.init();
	}
	protected init(): void {
		if (validate.number(this.config.seed)) {
			this.complexity = this.getComplexity(this.config.seed);
		} else {
			this.complexity = this.getComplexity(this.seed);
		}
		this.mouse = validate.boolean(this.config.mouse) ? this.config.mouse : this.mouse;
		this.simplex = new OpenSimplexNoise(Date.now());
		this.triangles = [];
		this.generate()
		if (this.mouse) {
			this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this), false);
		}		
		super.init();
	}
	protected update(): void {
		for (let i = 0; i < this.triangles.length; i++) {
			this.triangles[i].update(this.light);
		}
	}
	protected render(): void {
		super.render();
		for (let i = 0; i < this.triangles.length; i++) {
			this.triangles[i].render();
		}
	}
	private generate(): void {
		let points: number[][] = [];
		const pad = (this.canvas.width+this.canvas.height)/10;
		const cw = Math.floor(this.canvas.width+pad*2);
		const ch = Math.floor(this.canvas.height+pad*2);
		const iy = ch/Math.round(Math.sqrt((ch*this.complexity)/cw));
		const ix = cw/Math.round(this.complexity/Math.sqrt((ch*this.complexity)/cw));
		const h = this.apex;
		for (let y = -pad; y < this.canvas.height+pad; y+=iy) {
			for (let x = -pad; x < this.canvas.width+pad; x+=ix) {
				const px = this.getRandomArbitrary(x,x+ix);
				const py = this.getRandomArbitrary(y,y+iy);
				const pz = ((this.simplex.noise2D(px, py)+1)/2)*h;
				points.push([px, py, pz]);
			}
		}
		points = this.triangulate(points);
		for (let i = 0, j = 0; j < points.length; i++, j+=3) {
			this.triangles[i] = new Triangle(this.ctx, this.light, points[j], points[j+1], points[j+2]);
			this.triangles[i].init(this.config);
		}
	}
	private triangulate(points: number[][]): Array<[number, number]> {
		const d = new Delaunator(points).triangles;
		const t = [];
		for (var i = 0; i < d.length; i ++) {
			t.push(points[d[i]]);
		}
		return t;
	}
	private getLightSource(height): [number, number, number] {
		return [
			this.canvas.width/2,
			this.canvas.height/2,
			height
		];
	}
	private getApexHeight(): number {
		return (this.canvas.height+this.canvas.width)/2;
	}
	private getComplexity(seed: number): number {
		return Math.floor(this.canvas.width*this.canvas.height/seed);
	}
	private getRandomArbitrary(max: number, min: number): number {
		return Math.random()*(max-min)+min;
	}
	private getCenteroid(a, b, c): [number, number] {
		return [
			(a[0]+b[0]+c[0])/3,
			(a[1]+b[1]+c[1])/3
		];
	}
	private getMousePosition(e: MouseEvent): [number, number] {
		const rect: ClientRect = this.canvas.getBoundingClientRect();
		return [e.clientX-rect.left, e.clientY-rect.top];
	}
	private onMouseMove(e: MouseEvent): void {
		const pos = this.getMousePosition(e);
		this.light = [pos[0], pos[1], this.light[2]];
	}
}

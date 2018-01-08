export interface Config {
    color?: [number, number, number, number];
    radius?: [number, number];
    velocity?: [number, number];
}
export default class Point {
    private ctx;
    private pos;
    private cw;
    private ch;
    private color;
    private radius;
    private velocity;
    private theta;
    constructor(ctx: CanvasRenderingContext2D, pos: [number, number]);
    init(config: Config): void;
    update(): void;
    render(): void;
    getPosition(): [number, number];
    private getRandomArbitrary(max, min);
    private getRandomTheta();
}

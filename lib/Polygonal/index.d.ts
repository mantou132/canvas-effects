import CanvasEffect from '../CanvasEffect';
export interface Config {
    container: string;
    width: any;
    height: any;
    seed?: number;
    color?: [number, number, number, number];
    mouse?: boolean;
    max?: number;
    stroke?: {
        color?: [number, number, number, number];
        width?: number;
    };
}
export default class Polygonal extends CanvasEffect<Config> {
    private apex;
    private complexity;
    private light;
    private mouse;
    private seed;
    private simplex;
    private triangles;
    constructor(config: Config);
    protected init(): void;
    protected update(): void;
    protected render(): void;
    private generate();
    private triangulate(points);
    private getLightSource(height);
    private getApexHeight();
    private getComplexity(seed);
    private getRandomArbitrary(max, min);
    private getCenteroid(a, b, c);
    private getMousePosition(e);
    private onMouseMove(e);
}

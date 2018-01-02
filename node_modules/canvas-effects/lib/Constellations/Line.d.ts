export interface Config {
    color?: [number, number, number, number];
    fade?: boolean;
    max?: number;
    width?: number;
}
export default class Line {
    private ctx;
    private a;
    private b;
    private alpha;
    private color;
    private fade;
    private max;
    private width;
    constructor(ctx: CanvasRenderingContext2D);
    init(config: Config): void;
    update(a: any, b: any): void;
    render(): void;
    private getDistance();
}

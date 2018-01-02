export interface Config {
    container: string;
    width: any;
    height: any;
}
export default abstract class CanvasEffect<T extends Config> {
    protected readonly config: T;
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    private requestId;
    private delay;
    private fps;
    private timer;
    constructor(config: T);
    protected init(): void;
    protected abstract update(): void;
    protected render(): void;
    private main();
    private debounce();
    private resize();
    private clear();
    private createCanvas();
    private hasValidDimensions(w, h);
    private setCanvasSize();
}

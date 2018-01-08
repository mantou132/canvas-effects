import CanvasEffect from '../CanvasEffect';
import { Config as PointConfig } from './Point';
import { Config as LineConfig } from './Line';
export interface Config {
    container: string;
    width: any;
    height: any;
    seed?: number;
    point?: PointConfig;
    line?: LineConfig;
}
export default class Constellations extends CanvasEffect<Config> {
    private complexity;
    private lines;
    private points;
    private seed;
    constructor(config: Config);
    protected init(): void;
    protected update(): void;
    protected render(): void;
    private generate();
    private getComplexity(seed);
}

export default class OpenSimplexNoise {
    private lookup2D;
    private lookup3D;
    private lookup4D;
    private perm;
    private perm2D;
    private perm3D;
    private perm4D;
    constructor(clientSeed: number);
    noise2D(x: number, y: number): number;
    noise3D(x: number, y: number, z: number): number;
    noise4D(x: number, y: number, z: number, w: number): number;
    private initialize();
}

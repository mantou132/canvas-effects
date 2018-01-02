"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var Contribution2 = /** @class */ (function () {
    function Contribution2(multiplier, xsb, ysb) {
        this.dx = -xsb - multiplier * constants_1.SQUISH_2D;
        this.dy = -ysb - multiplier * constants_1.SQUISH_2D;
        this.xsb = xsb;
        this.ysb = ysb;
    }
    return Contribution2;
}());
var Contribution3 = /** @class */ (function () {
    function Contribution3(multiplier, xsb, ysb, zsb) {
        this.dx = -xsb - multiplier * constants_1.SQUISH_3D;
        this.dy = -ysb - multiplier * constants_1.SQUISH_3D;
        this.dz = -zsb - multiplier * constants_1.SQUISH_3D;
        this.xsb = xsb;
        this.ysb = ysb;
        this.zsb = zsb;
    }
    return Contribution3;
}());
var Contribution4 = /** @class */ (function () {
    function Contribution4(multiplier, xsb, ysb, zsb, wsb) {
        this.dx = -xsb - multiplier * constants_1.SQUISH_4D;
        this.dy = -ysb - multiplier * constants_1.SQUISH_4D;
        this.dz = -zsb - multiplier * constants_1.SQUISH_4D;
        this.dw = -wsb - multiplier * constants_1.SQUISH_4D;
        this.xsb = xsb;
        this.ysb = ysb;
        this.zsb = zsb;
        this.wsb = wsb;
    }
    return Contribution4;
}());
function shuffleSeed(seed) {
    var newSeed = new Uint32Array(1);
    newSeed[0] = seed[0] * 1664525 + 1013904223;
    return newSeed;
}
var OpenSimplexNoise = /** @class */ (function () {
    function OpenSimplexNoise(clientSeed) {
        this.initialize();
        this.perm = new Uint8Array(256);
        this.perm2D = new Uint8Array(256);
        this.perm3D = new Uint8Array(256);
        this.perm4D = new Uint8Array(256);
        var source = new Uint8Array(256);
        for (var i = 0; i < 256; i++)
            source[i] = i;
        var seed = new Uint32Array(1);
        seed[0] = clientSeed;
        seed = shuffleSeed(shuffleSeed(shuffleSeed(seed)));
        for (var i = 255; i >= 0; i--) {
            seed = shuffleSeed(seed);
            var r = new Uint32Array(1);
            r[0] = (seed[0] + 31) % (i + 1);
            if (r[0] < 0)
                r[0] += i + 1;
            this.perm[i] = source[r[0]];
            this.perm2D[i] = this.perm[i] & 0x0e;
            this.perm3D[i] = (this.perm[i] % 24) * 3;
            this.perm4D[i] = this.perm[i] & 0xfc;
            source[r[0]] = source[i];
        }
    }
    OpenSimplexNoise.prototype.noise2D = function (x, y) {
        var stretchOffset = (x + y) * constants_1.STRETCH_2D;
        var _a = [x + stretchOffset, y + stretchOffset], xs = _a[0], ys = _a[1];
        var _b = [Math.floor(xs), Math.floor(ys)], xsb = _b[0], ysb = _b[1];
        var squishOffset = (xsb + ysb) * constants_1.SQUISH_2D;
        var _c = [x - (xsb + squishOffset), y - (ysb + squishOffset)], dx0 = _c[0], dy0 = _c[1];
        var _d = [xs - xsb, ys - ysb], xins = _d[0], yins = _d[1];
        var inSum = xins + yins;
        var hashVals = new Uint32Array(4);
        hashVals[0] = xins - yins + 1;
        hashVals[1] = inSum;
        hashVals[2] = inSum + yins;
        hashVals[3] = inSum + xins;
        var hash = hashVals[0] |
            (hashVals[1] << 1) |
            (hashVals[2] << 2) |
            (hashVals[3] << 4);
        var c = this.lookup2D[hash];
        var value = 0.0;
        while (typeof c !== 'undefined') {
            var _e = [dx0 + c.dx, dy0 + c.dy], dx = _e[0], dy = _e[1];
            var attn = 2 - dx * dx - dy * dy;
            if (attn > 0) {
                var _f = [xsb + c.xsb, ysb + c.ysb], px = _f[0], py = _f[1];
                var i = this.perm2D[(this.perm[px & 0xff] + py) & 0xff];
                var valuePart = constants_1.gradients2D[i] * dx + constants_1.gradients2D[i + 1] * dy;
                attn *= attn;
                value += attn * attn * valuePart;
            }
            c = c.next;
        }
        return value * constants_1.NORM_2D;
    };
    OpenSimplexNoise.prototype.noise3D = function (x, y, z) {
        var stretchOffset = (x + y + z) * constants_1.STRETCH_3D;
        var _a = [
            x + stretchOffset,
            y + stretchOffset,
            z + stretchOffset
        ], xs = _a[0], ys = _a[1], zs = _a[2];
        var _b = [Math.floor(xs), Math.floor(ys), Math.floor(zs)], xsb = _b[0], ysb = _b[1], zsb = _b[2];
        var squishOffset = (xsb + ysb + zsb) * constants_1.SQUISH_3D;
        var _c = [
            x - (xsb + squishOffset),
            y - (ysb + squishOffset),
            z - (zsb + squishOffset)
        ], dx0 = _c[0], dy0 = _c[1], dz0 = _c[2];
        var _d = [xs - xsb, ys - ysb, zs - zsb], xins = _d[0], yins = _d[1], zins = _d[2];
        var inSum = xins + yins + zins;
        var hashVals = new Uint32Array(7);
        hashVals[0] = yins - zins + 1;
        hashVals[1] = xins - yins + 1;
        hashVals[2] = xins - zins + 1;
        hashVals[3] = inSum;
        hashVals[4] = inSum + zins;
        hashVals[5] = inSum + yins;
        hashVals[6] = inSum + xins;
        var hash = hashVals[0] |
            (hashVals[1] << 1) |
            (hashVals[2] << 2) |
            (hashVals[3] << 3) |
            (hashVals[4] << 5) |
            (hashVals[5] << 7) |
            (hashVals[6] << 9);
        var c = this.lookup3D[hash];
        var value = 0.0;
        while (typeof c !== 'undefined') {
            var _e = [dx0 + c.dx, dy0 + c.dy, dz0 + c.dz], dx = _e[0], dy = _e[1], dz = _e[2];
            var attn = 2 - dx * dx - dy * dy - dz * dz;
            if (attn > 0) {
                var _f = [xsb + c.xsb, ysb + c.ysb, zsb + c.zsb], px = _f[0], py = _f[1], pz = _f[2];
                var i = this.perm3D[(this.perm[(this.perm[px & 0xff] + py) & 0xff] + pz) & 0xff];
                var valuePart = constants_1.gradients3D[i] * dx +
                    constants_1.gradients3D[i + 1] * dy +
                    constants_1.gradients3D[i + 2] * dz;
                attn *= attn;
                value += attn * attn * valuePart;
            }
            c = c.next;
        }
        return value * constants_1.NORM_3D;
    };
    OpenSimplexNoise.prototype.noise4D = function (x, y, z, w) {
        var stretchOffset = (x + y + z + w) * constants_1.STRETCH_4D;
        var _a = [
            x + stretchOffset,
            y + stretchOffset,
            z + stretchOffset,
            w + stretchOffset
        ], xs = _a[0], ys = _a[1], zs = _a[2], ws = _a[3];
        var _b = [
            Math.floor(xs),
            Math.floor(ys),
            Math.floor(zs),
            Math.floor(ws)
        ], xsb = _b[0], ysb = _b[1], zsb = _b[2], wsb = _b[3];
        var squishOffset = (xsb + ysb + zsb + wsb) * constants_1.SQUISH_4D;
        var dx0 = x - (xsb + squishOffset);
        var dy0 = y - (ysb + squishOffset);
        var dz0 = z - (zsb + squishOffset);
        var dw0 = w - (wsb + squishOffset);
        var _c = [xs - xsb, ys - ysb, zs - zsb, ws - wsb], xins = _c[0], yins = _c[1], zins = _c[2], wins = _c[3];
        var inSum = xins + yins + zins + wins;
        var hashVals = new Uint32Array(11);
        hashVals[0] = zins - wins + 1;
        hashVals[1] = yins - zins + 1;
        hashVals[2] = yins - wins + 1;
        hashVals[3] = xins - yins + 1;
        hashVals[4] = xins - zins + 1;
        hashVals[5] = xins - wins + 1;
        hashVals[6] = inSum;
        hashVals[7] = inSum + wins;
        hashVals[8] = inSum + zins;
        hashVals[9] = inSum + yins;
        hashVals[10] = inSum + xins;
        var hash = hashVals[0] |
            (hashVals[1] << 1) |
            (hashVals[2] << 2) |
            (hashVals[3] << 3) |
            (hashVals[4] << 4) |
            (hashVals[5] << 5) |
            (hashVals[6] << 6) |
            (hashVals[7] << 8) |
            (hashVals[8] << 11) |
            (hashVals[9] << 14) |
            (hashVals[10] << 17);
        var c = this.lookup4D[hash];
        var value = 0.0;
        while (typeof c !== 'undefined') {
            var _d = [dx0 + c.dx, dy0 + c.dy, dz0 + c.dz, dw0 + c.dw], dx = _d[0], dy = _d[1], dz = _d[2], dw = _d[3];
            var attn = 2 - dx * dx - dy * dy - dz * dz - dw * dw;
            if (attn > 0) {
                var _e = [
                    xsb + c.xsb,
                    ysb + c.ysb,
                    zsb + c.zsb,
                    wsb + c.wsb
                ], px = _e[0], py = _e[1], pz = _e[2], pw = _e[3];
                var i = this.perm4D[(this.perm[(this.perm[(this.perm[px & 0xff] + py) & 0xff] + pz) & 0xff] +
                    pw) &
                    0xff];
                var valuePart = constants_1.gradients4D[i] * dx +
                    constants_1.gradients4D[i + 1] * dy +
                    constants_1.gradients4D[i + 2] * dz +
                    constants_1.gradients4D[i + 3] * dw;
                attn *= attn;
                value += attn * attn * valuePart;
            }
            c = c.next;
        }
        return value * constants_1.NORM_4D;
    };
    OpenSimplexNoise.prototype.initialize = function () {
        var contributions2D = [];
        for (var i = 0; i < constants_1.p2D.length; i += 4) {
            var baseSet = constants_1.base2D[constants_1.p2D[i]];
            var previous = null;
            var current = null;
            for (var k = 0; k < baseSet.length; k += 3) {
                current = new Contribution2(baseSet[k], baseSet[k + 1], baseSet[k + 2]);
                if (previous === null)
                    contributions2D[i / 4] = current;
                else
                    previous.next = current;
                previous = current;
            }
            current.next = new Contribution2(constants_1.p2D[i + 1], constants_1.p2D[i + 2], constants_1.p2D[i + 3]);
        }
        this.lookup2D = [];
        for (var i = 0; i < constants_1.lookupPairs2D.length; i += 2) {
            this.lookup2D[constants_1.lookupPairs2D[i]] = contributions2D[constants_1.lookupPairs2D[i + 1]];
        }
        var contributions3D = [];
        for (var i = 0; i < constants_1.p3D.length; i += 9) {
            var baseSet = constants_1.base3D[constants_1.p3D[i]];
            var previous = null;
            var current = null;
            for (var k = 0; k < baseSet.length; k += 4) {
                current = new Contribution3(baseSet[k], baseSet[k + 1], baseSet[k + 2], baseSet[k + 3]);
                if (previous === null)
                    contributions3D[i / 9] = current;
                else
                    previous.next = current;
                previous = current;
            }
            current.next = new Contribution3(constants_1.p3D[i + 1], constants_1.p3D[i + 2], constants_1.p3D[i + 3], constants_1.p3D[i + 4]);
            current.next.next = new Contribution3(constants_1.p3D[i + 5], constants_1.p3D[i + 6], constants_1.p3D[i + 7], constants_1.p3D[i + 8]);
        }
        this.lookup3D = [];
        for (var i = 0; i < constants_1.lookupPairs3D.length; i += 2) {
            this.lookup3D[constants_1.lookupPairs3D[i]] = contributions3D[constants_1.lookupPairs3D[i + 1]];
        }
        var contributions4D = [];
        for (var i = 0; i < constants_1.p4D.length; i += 16) {
            var baseSet = constants_1.base4D[constants_1.p4D[i]];
            var previous = null;
            var current = null;
            for (var k = 0; k < baseSet.length; k += 5) {
                current = new Contribution4(baseSet[k], baseSet[k + 1], baseSet[k + 2], baseSet[k + 3], baseSet[k + 4]);
                if (previous === null)
                    contributions4D[i / 16] = current;
                else
                    previous.next = current;
                previous = current;
            }
            current.next = new Contribution4(constants_1.p4D[i + 1], constants_1.p4D[i + 2], constants_1.p4D[i + 3], constants_1.p4D[i + 4], constants_1.p4D[i + 5]);
            current.next.next = new Contribution4(constants_1.p4D[i + 6], constants_1.p4D[i + 7], constants_1.p4D[i + 8], constants_1.p4D[i + 9], constants_1.p4D[i + 10]);
            current.next.next.next = new Contribution4(constants_1.p4D[i + 11], constants_1.p4D[i + 12], constants_1.p4D[i + 13], constants_1.p4D[i + 14], constants_1.p4D[i + 15]);
        }
        this.lookup4D = [];
        for (var i = 0; i < constants_1.lookupPairs4D.length; i += 2) {
            this.lookup4D[constants_1.lookupPairs4D[i]] = contributions4D[constants_1.lookupPairs4D[i + 1]];
        }
    };
    return OpenSimplexNoise;
}());
exports.default = OpenSimplexNoise;

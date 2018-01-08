"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var CanvasEffect_1 = require("../CanvasEffect");
var Triangle_1 = require("./Triangle");
var validate = require("../CanvasEffect/validate");
var Delaunator = require("delaunator");
var open_simplex_noise_1 = require("open-simplex-noise");
var Polygonal = /** @class */ (function (_super) {
    __extends(Polygonal, _super);
    function Polygonal(config) {
        var _this = _super.call(this, config) || this;
        _this.apex = _this.getApexHeight();
        _this.light = _this.getLightSource(_this.apex);
        _this.mouse = true;
        _this.seed = 16000;
        _this.init();
        return _this;
    }
    Polygonal.prototype.init = function () {
        if (validate.number(this.config.seed)) {
            this.complexity = this.getComplexity(this.config.seed);
        }
        else {
            this.complexity = this.getComplexity(this.seed);
        }
        this.mouse = validate.boolean(this.config.mouse) ? this.config.mouse : this.mouse;
        this.simplex = new open_simplex_noise_1.default(Date.now());
        this.triangles = [];
        this.generate();
        if (this.mouse) {
            this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        }
        _super.prototype.init.call(this);
    };
    Polygonal.prototype.update = function () {
        for (var i = 0; i < this.triangles.length; i++) {
            this.triangles[i].update(this.light);
        }
    };
    Polygonal.prototype.render = function () {
        _super.prototype.render.call(this);
        for (var i = 0; i < this.triangles.length; i++) {
            this.triangles[i].render();
        }
    };
    Polygonal.prototype.generate = function () {
        var points = [];
        var pad = (this.canvas.width + this.canvas.height) / 10;
        var cw = Math.floor(this.canvas.width + pad * 2);
        var ch = Math.floor(this.canvas.height + pad * 2);
        var iy = ch / Math.round(Math.sqrt((ch * this.complexity) / cw));
        var ix = cw / Math.round(this.complexity / Math.sqrt((ch * this.complexity) / cw));
        var h = this.apex;
        for (var y = -pad; y < this.canvas.height + pad; y += iy) {
            for (var x = -pad; x < this.canvas.width + pad; x += ix) {
                var px = this.getRandomArbitrary(x, x + ix);
                var py = this.getRandomArbitrary(y, y + iy);
                var pz = ((this.simplex.noise2D(px, py) + 1) / 2) * h;
                points.push([px, py, pz]);
            }
        }
        points = this.triangulate(points);
        for (var i = 0, j = 0; j < points.length; i++, j += 3) {
            this.triangles[i] = new Triangle_1.default(this.ctx, this.light, points[j], points[j + 1], points[j + 2]);
            this.triangles[i].init(this.config);
        }
    };
    Polygonal.prototype.triangulate = function (points) {
        var d = new Delaunator(points).triangles;
        var t = [];
        for (var i = 0; i < d.length; i++) {
            t.push(points[d[i]]);
        }
        return t;
    };
    Polygonal.prototype.getLightSource = function (height) {
        return [
            this.canvas.width / 2,
            this.canvas.height / 2,
            height
        ];
    };
    Polygonal.prototype.getApexHeight = function () {
        return (this.canvas.height + this.canvas.width) / 2;
    };
    Polygonal.prototype.getComplexity = function (seed) {
        return Math.floor(this.canvas.width * this.canvas.height / seed);
    };
    Polygonal.prototype.getRandomArbitrary = function (max, min) {
        return Math.random() * (max - min) + min;
    };
    Polygonal.prototype.getCenteroid = function (a, b, c) {
        return [
            (a[0] + b[0] + c[0]) / 3,
            (a[1] + b[1] + c[1]) / 3
        ];
    };
    Polygonal.prototype.getMousePosition = function (e) {
        var rect = this.canvas.getBoundingClientRect();
        return [e.clientX - rect.left, e.clientY - rect.top];
    };
    Polygonal.prototype.onMouseMove = function (e) {
        var pos = this.getMousePosition(e);
        this.light = [pos[0], pos[1], this.light[2]];
    };
    return Polygonal;
}(CanvasEffect_1.default));
exports.default = Polygonal;

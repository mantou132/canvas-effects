import { Constellations, Polygonal } from "canvas-effects"

const c = new Constellations({
	container: "#constellations",
	width: "100%",
	height: "100%",
	point: {
		color: [255,255,255,1]
	},
	line: {
		color: [255,255,255,1]
	}
});

const p = new Polygonal({
	container: "#polygonal",
	width: "100%",
	height: "100%",
	color: [255, 255, 255, 1],
	mouse: true
})
import Canvas from './core/canvas.mjs';
import Grid from './components/grid.mjs';

const RESOLUTION = 10

const canvas = new Canvas(document.getElementsByTagName('canvas')[0]);
const grid = new Grid({ canvas, size: RESOLUTION, style: 'rgba(0,0,0, 0.1)' });

const { x: { count: xCount }, y: { count: yCount }  } = grid.getCells();
const point = {
    x: Math.floor(xCount / 2),
    y: Math.floor(yCount / 2),
}

canvas.setRenderer(function Render() {
    const { context } = canvas;
    canvas.clear();
    grid.render();
    const { x, y } = grid.getPoint(point)
    context.fillStyle = 'red';
    context.fillRect(x, y, RESOLUTION, RESOLUTION);
});

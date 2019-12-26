import Canvas from './core/canvas.mjs';
import Grid from './components/grid.mjs';

const canvas = new Canvas(document.getElementsByTagName('canvas')[0]);

const grid = new Grid({ canvas, size: 10, style: 'rgba(0,0,0, 0.1)' });

canvas.setRenderer(function Render() {
    const { context, element } = canvas;
    canvas.clear();
    grid.render();
    context.fillStyle = 'red';
    context.fillRect(element.width / 2, element.height / 2, 10, 10);
});

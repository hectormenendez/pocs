import Canvas from './canvas.mjs';
import { Particles, ParticleCreate } from './particle.mjs';

const { canvas, context } = new Canvas(document.getElementsByTagName('canvas')[0]);

canvas.setLoop(function Draw() {
    Particles.push(ParticleCreate(canvas));
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (Particles.length > canvas.height) {
        Particles.shift();
    }
    Particles.forEach(({ x, y, color }) => {
        context.fillStyle = color;
        context.fillRect(x.pos, y.pos, x.size, y.size);
        x.pos += x.vel;
        y.pos -= y.vel;
    });
});

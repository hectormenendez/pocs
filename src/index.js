const Canvas = document.getElementsByTagName('canvas')[0];

Canvas.width = window.innerWidth;
Canvas.height = window.innerHeight;

const Context = Canvas.getContext('2d');

const Particles = [];

function randHex(len) {
    const min = Math.pow(16, len - 1);
    const max = Math.pow(16, len) - 1;
    let r = (Math.floor(Math.random() * (max - min + 1)) + min).toString(16);
    while (r.length < len) {
        r += randHex(0);
    }
    return r;
}
function ParticleCreate(canvas) {
    const size = 7;
    return {
        color: `#${randHex(8)}`,
        x: {
            // pos: canvas.width / 2,
            pos: 0,
            vel: Math.random(),
            size,
        },
        y: {
            // pos: canvas.width / 2,
            pos: canvas.height - size,
            vel: Math.random(),
            size,
        },
    };
}

function Draw() {
    Particles.push(ParticleCreate(Canvas));
    // Context.clearRect(0, 0, Canvas.width, Canvas.height);
    if (Particles.length > Canvas.height) {
        Particles.shift();
    }
    Particles.forEach(({ x, y, color }) => {
        Context.fillStyle = color;
        Context.fillRect(x.pos, y.pos, x.size, y.size);
        x.pos += x.vel;
        y.pos -= y.vel;
    });

    window.requestAnimationFrame(Draw);
}

window.requestAnimationFrame(Draw);

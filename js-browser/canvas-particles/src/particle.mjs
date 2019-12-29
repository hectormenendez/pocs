
import { Hex } from './utils.mjs';

export const Particles = [];

export function ParticleCreate(canvas) {
    const size = Math.round(Math.random() * 10);
    return {
        color: `#${Hex()}`,
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

import { ToFloat, Assignator } from '../core/utils.mjs';

export default class Grid {
    constructor(params) {
        Assignator({ params, parent: this, required: ['canvas', 'size'] });
        // TODO: Should this be calculated every render?
        this.coordinates = this.getLines();
    }

    getCells() {
        const { element } = this.canvas;
        const x = {
            count: Math.floor(element.width / this.size),
            shift: ToFloat((element.width % this.size) / 2),
        };
        const y = {
            count: Math.floor(element.height / this.size),
            shift: ToFloat((element.height % this.size) / 2),
        };

        return { x, y };
    }

    getLines() {
        const { element } = this.canvas;
        const { x, y } = this.getCells();
        const shifted = ({ count, shift }) =>
            [...Array(count + 1).keys()].map((i) => ToFloat(this.size * i + shift));
        return {
            vertical: shifted(x).map((pos) => ({
                ini: [pos, y.shift],
                end: [pos, element.height - y.shift],
            })),
            horizontal: shifted(y).map((pos) => ({
                ini: [x.shift, pos],
                end: [element.width - x.shift, pos],
            })),
        };
    }

    getPoint({ x, y }) {
        const { vertical, horizontal } = this.getLines();
        return {
            x: vertical[x].ini[0],
            y: horizontal[y].ini[1],
        };
    }

    render() {
        const { context } = this.canvas;
        const { horizontal, vertical } = this.coordinates;
        [horizontal, vertical].forEach((coordinates) =>
            coordinates.forEach(({ ini, end }) => {
                context.beginPath();
                context.moveTo(...ini);
                context.lineTo(...end);
                context.strokeStyle = this.style;
                context.stroke();
            }),
        );
    }
}

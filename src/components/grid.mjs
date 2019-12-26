import { ToFloat, Assignator } from '../core/utils.mjs';

export default class Grid {
    constructor(params) {
        Assignator({ params, parent: this, required: ['canvas', 'size']});
        // TODO: Should this be calculated every render?
        this.coordinates = this.getCoordinates();
    }

    getCoordinates() {
        const { element } = this.canvas;
        const x = {
            count: Math.floor(element.width / this.size),
            shift: ToFloat((element.width % this.size) / 2),
        };
        const y = {
            count: Math.floor(element.height / this.size),
            shift: ToFloat((element.height % this.size) / 2),
        };

        const shifted = ({ count, shift }) =>
            [...Array(count + 1).keys()].map((i) => ToFloat(this.size * i + shift));

        return {
            x,
            y,
            vertical: shifted(x).map((pos) => [
                [pos, y.shift],
                [pos, element.height - y.shift],
            ]),
            horizontal: shifted(y).map((pos) => [
                [x.shift, pos],
                [element.width - x.shift, pos],
            ]),
        };
    }

    render() {
        const { context } = this.canvas;
        const { horizontal, vertical } = this.coordinates;
        [horizontal, vertical].forEach((coordinates) =>
            coordinates.forEach(([from, to]) => {
                context.beginPath();
                context.moveTo(...from);
                context.lineTo(...to);
                context.strokeStyle = this.style;
                context.stroke();
            }),
        );
    }
}

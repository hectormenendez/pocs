export default class Canvas {
    static CONTEXT = '2d';

    constructor(element) {
        // The canvas should use the whole screen.
        element.setAttribute('width', window.innerWidth);
        element.setAttribute('height', window.innerHeight);
        // Setup the core properties
        this.element = element;
        this.context = element.getContext(Canvas.CONTEXT);
    }

    /**
     * Sets a function to be called whenever a frame is available to render.
     *
     * @param {Function} renderer - A function to be called on every frame.
     * @returns {void} This functions does not return.
     */
    setRenderer(renderer) {
        const type = typeof renderer;
        if (type !== 'function') {
            throw new TypeError(`Expecting {renderer} to be a function, got: ${type}`);
        }
        const wrapper = () => {
            renderer.call(this);
            window.requestAnimationFrame(wrapper);
        };
        window.requestAnimationFrame(wrapper);
    }

    /** Clears the canvas */
    clear() {
        const { width, height } = this.element;
        this.context.clearRect(0, 0, width, height);
    }
}

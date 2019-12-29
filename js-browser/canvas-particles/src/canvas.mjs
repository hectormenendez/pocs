const CONTEXT = '2d';
const FRAMER = window.requestAnimationFrame;

function Wrapper(callback) {
    callback.call(this);
    FRAMER(Wrapper.bind(this, callback));
};

export default function Canvas(canvas) {
    /* eslint-disable no-param-reassign */
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.setLoop = (callback) => FRAMER(Wrapper.bind(canvas, callback));
    const context = canvas.getContext(CONTEXT);
    return { canvas, context };
    /* eslint-enable no-param-reassign */
}

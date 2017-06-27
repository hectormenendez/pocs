class Game {

    constructor(settings={}){
        // extend the settings if necessary
        this.settings = Object.assign({}, Game.settings, settings);
        // instantiate elements
        this.canvas = new Canvas();
        this.snake = new Snake();
        this.target = new Target();
        // setup keys
        this.keys = [
            { code:37, value:() => ({ x:-1, y:0  }) },
            { code:38, value:() => ({ x:0 , y:-1 }) },
            { code:39, value:() => ({ x:1 , y:0  }) },
            { code:40, value:() => ({ x:0 , y:1  }) }
        ];
        document.addEventListener('keydown', this.onKey.bind(this));
        // setup
        this.snake.setup(this.canvas);
        this.target.setup(this.canvas);
        this.setup();
    }

    static get settings(){
        return Object.freeze({
            framerate: 10,
            difficulty: 1.03
        });
    }

    setup(){
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(this.main.bind(this), 1000/this.settings.framerate);
    }

    main(){
        // detect collision of snake and target
        if (
            this.snake.position.x == this.target.position.x &&
            this.snake.position.y == this.target.position.y
        ){
            // set a new position for the target
            this.target.setup(this.canvas);
            // increase the difficulty by increasing the framerate
            this.settings.framerate *= this.settings.difficulty;
            this.setup();
        }
        // Paint all elements on canvas
        this.canvas.update();
        this.snake.update(this.canvas);
        this.target.update(this.canvas);
    }

    onKey(e){
        const keys = this.keys.map(x => x.code);
        // ignore, if key pressed is not an arrow
        if (!keys.includes(e.keyCode)) return;
        // set the direction based upon the currently pressed key
        this.snake.direction = this.keys[keys.indexOf(e.keyCode)].value();
    }


}

// using the grid system, this si not really necesary,
// but i'm keeping this here for future reference.
function areBoxesColliding(box1, box2){
    return !(
        (box1.pos.y + box1.size < box2.pos.y) ||
        (box1.pos.x + box1.size < box2.pos.x) ||
        (box1.pos.y > box2.pos.y + box2.size) ||
        (box1.pos.x > box2.pos.x + box2.size)
    );
}

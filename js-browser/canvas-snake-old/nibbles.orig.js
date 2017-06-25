document.addEventListener("DOMContentLoaded", () => {
    // this will be the game instance
    const game = {};
    // The keys used on the game
    game.keys = {
        arrows:[
            { key:37, val:{ x:-1, y:0  }}, // Left
            { key:38, val:{ x:0 , y:-1 }}, // Up
            { key:39, val:{ x:1 , y:0  }}, // Right
            { key:40, val:{ x:0 , y:1  }}, // Down
        ]
    };

    // The initial game settings
    game.settings = {
        framerate:10,
        difficulty: 1.03,
        size: 10,
        style: {
            canvas:'black',
            snake: 'lime',
            target: 'tomato'
        }
    };
    // Setup canvas initial properties
    game.canvas = document.getElementsByTagName('canvas')[0];
    game.canvas.height = window.innerHeight;
    game.canvas.width  = window.innerWidth;
    game.context = game.canvas.getContext('2d');
    // The initial snake properties
    game.snake = {
        // the size in pixels for the snake's tail
        size: game.settings.size,
        // the current direction for the snake
        dir:{ x:0, y:0 },
        // the current position of the snake's head (middle of the screen)
        pos:{
            x: Math.floor(game.canvas.width/2),
            y: Math.floor(game.canvas.height/2)
        },
        tail:[]
    };
    // the initial target properties
    game.target = {
        size: game.settings.size,
        pos: {
            x: Math.floor((Math.random() * game.canvas.width) +1),
            y: Math.floor((Math.random() * game.canvas.height) +1)
        }
    };
    setup.call(game);
    document.addEventListener('keydown', onKey.bind(game));
});

function setup(){
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(main.bind(this), 1000/this.settings.framerate);
    console.log(1000/this.settings.framerate)
}

function main(){
    // Set the snake.pos based upon the current direction
    this.snake.pos.x += this.snake.dir.x * this.snake.size;
    this.snake.pos.y += this.snake.dir.y * this.snake.size;
    // if the snake gets out of bounds, make it appear on the opposite side
    if (this.snake.pos.x <= 0) this.snake.pos.x = this.canvas.width - this.snake.size;
    if (this.snake.pos.x >= this.canvas.width) this.snake.pos.x = 0;
    if (this.snake.pos.y <= 0) this.snake.pos.y = this.canvas.height - this.snake.size;
    if (this.snake.pos.y >= this.canvas.height) this.snake.pos.y = 0;
    // If the snake head touches a target:
    if (areBoxesColliding(this.snake, this.target)){
        // set a new target position
        this.target.pos.x = Math.floor((Math.random() * this.canvas.width) +1);
        this.target.pos.y = Math.floor((Math.random() * this.canvas.height) +1);
        // speedup framerate to increase difficulty
        this.settings.framerate *= this.settings.difficulty;
        setup.call(this);
    };
    paint.call(this);
}

function paint(){
    // re paint the background on every frame
    paintRect.call(this, this.settings.style.canvas, {
        pos: { x:0, y:0 },
        width: this.canvas.width,
        height: this.canvas.height
    });
    // paint the snake
    paintRect.call(this, this.settings.style.snake, this.snake);
    // paint the target
    paintRect.call(this, this.settings.style.target, this.target);
}

function paintRect(style, figure){
    this.context.fillStyle = style;
    const {x,y} = figure.pos;
    let width, height;
    if (figure.size) width = height = figure.size;
    else ({ width, height } = figure);
    this.context.fillRect(x, y, width, height);
}

function areBoxesColliding(box1, box2){
    return !(
        (box1.pos.y + box1.size < box2.pos.y) ||
        (box1.pos.x + box1.size < box2.pos.x) ||
        (box1.pos.y > box2.pos.y + box2.size) ||
        (box1.pos.x > box2.pos.x + box2.size)
    );
}

function onKey(e){
    const keys = this.keys.arrows.map(x => x.key);
    // ignore, if key pressed is not an arrow
    if (!keys.includes(e.keyCode)) return false;
    // set the direction based upon the currently pressed key
    this.snake.dir = this.keys.arrows[keys.indexOf(e.keyCode)].val;
}

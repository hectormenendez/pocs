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
            x: Math.floor(canvas.width/2),
            y: Math.floor(canvas.height/2)
        },
        tail:[]
    };
    // the initial target properties
    game.target = {
        size: game.settings.size,
        pos: {
            x: Math.floor((Math.random() * canvas.width) +1),
            y: Math.floor((Math.random() * canvas.height) +1)
        }
    };
    setInterval(main.bind(game), 1000/game.settings.framerate);
    document.addEventListener('keydown', onKey.bind(game));
});

function main(){
    // Set the snake.pos based upon the current direction
    this.snake.pos.x += this.snake.dir.x * this.snake.size;
    this.snake.pos.y += this.snake.dir.y * this.snake.size;
    // if the snake gets out of bounds, make it appear on the opposite side
    if (this.snake.pos.x <= 0) this.snake.pos.x = this.canvas.width - this.snake.size;
    if (this.snake.pos.x >= this.canvas.width) this.snake.pos.x = 0;
    if (this.snake.pos.y <= 0) this.snake.pos.y = this.canvas.height - this.snake.size;
    if (this.snake.pos.y >= this.canvas.height) this.snake.pos.y = 0;
    paint.call(this);
}

function paint(){
    // re paint the background on every frame
    this.context.fillStyle = this.settings.style.canvas;
    this.context.fillRect(0,0, this.canvas.width, this.canvas.height);
    // paint the snake
    this.context.fillStyle = this.settings.style.snake;
    this.context.fillRect(
        this.snake.pos.x,
        this.snake.pos.y,
        this.snake.size,
        this.snake.size
    );
    // paint the target
    this.context.fillStyle = this.settings.style.target;
    this.context.fillRect(
        this.target.pos.x,
        this.target.pos.y,
        this.target.size,
        this.target.size
    );
}

function onKey(e){
    const keys = this.keys.arrows.map(x => x.key);
    // ignore, if key pressed is not an arrow
    if (!keys.includes(e.keyCode)) return false;
    // set the direction based upon the currently pressed key
    this.snake.dir = this.keys.arrows[keys.indexOf(e.keyCode)].val;
}

class Snake {

    constructor(settings={}){
        this.settings = Object.assign({}, Snake.settings, settings);
        // The direction the snake is heading
        this.direction = { x:0, y:0 };
        // The position of the head of the snake
        this.position = null;
        // The path the snake is leaving behind
        this.tail = [];
    }

    static get settings(){
        return Object.freeze({
            color: 'lime'
        });
    }

    setup(canvas){
         this.position = {
            x: Math.floor(canvas.grid.x.length / 2),
            y: Math.floor(canvas.grid.y.length / 2)
        };
    }

    update(canvas){
        // advance the snake according to current direction
        this.position.x += this.direction.x;
        this.position.y += this.direction.y;
        // if the snake gets out of bounds, make it appear on the opposite side.
        if (this.position.x < 0) this.position.x = canvas.grid.x.length;
        if (this.position.y < 0) this.position.y = canvas.grid.y.length;
        if (this.position.x > canvas.grid.x.length) this.position.x = 0;
        if (this.position.y > canvas.grid.y.length) this.position.y = 0;
        // paint the whole snake
        canvas.context.fillStyle = this.settings.color;
        [this.position]
            .concat(this.tail)
            .forEach(grid => {
                const {x,y} = canvas.getPosition(grid);
                canvas.context.fillRect(x, y, canvas.grid.size, canvas.grid.size);
            });
    }

}

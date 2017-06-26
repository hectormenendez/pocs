class Snake {

    constructor(settings={}){
        this.settings = Object.assign({}, Snake.settings, settings);
        // The direction the snake is heading
        this.direction = { x:0, y:0 };
        // Each array item will be a part of the snake containing its position on the grid
        this.body = [];
    }

    static get settings(){
        return Object.freeze({
            color: 'lime'
        });
    }

    update(canvas){
        // move the head of the snake
        this.body = this.body.map((grid, i) => {
            if (i > 0) return false; // TODO;
            // Configure the position for the head of the snake
            else {
                // advance the snake according to current direction
                grid.x += this.direction.x;
                grid.y += this.direction.y;
                // if the snake gets out of bounds, make it appear on the opposite side.
                if (grid.x < 0) grid.x = canvas.grid.x.length;
                if (grid.y < 0) grid.y = canvas.grid.y.length;
                if (grid.x > canvas.grid.x.length) grid.x = 0;
                if (grid.y > canvas.grid.y.length) grid.y = 0;
            }
            return grid;
        });
        canvas.context.fillStyle = this.settings.color;
        this.body.forEach(grid => {
            const {x,y} = canvas.getPosition(grid);
            canvas.context.fillRect(x, y, canvas.grid.size, canvas.grid.size);
        });
    }

}

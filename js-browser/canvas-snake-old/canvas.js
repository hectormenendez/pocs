class Canvas {

    constructor(settings){
        this.settings = Object.assign({}, Canvas.settings, settings);
        this.element = document.querySelector('canvas');
        this.context = this.element.getContext('2d');
        this.grid = { x:[], y:[], size:this.settings.size };
        this.setup();
    }

    static get settings(){
        return Object.freeze({
            color: '#444',
            size: 10
        });
    }

    setup(){
        const w = window.innerWidth;
        const h = window.innerHeight;
        // determine the orientation
        this.orientation = (w > h? 'landscape' : (w < h? 'portrait' : 'square'));
        this.ratio = w / h;
        // Create a virtual grid on canvas
        for (let i=0; i < Math.floor(w / this.grid.size); i++)
            this.grid.x.push(i * this.grid.size);
        for (let i=0; i < Math.floor(h / this.grid.size); i++)
            this.grid.y.push(i * this.grid.size);
        // determine canvas size from the grid
        this.element.width = this.grid.size * this.grid.x.length;
        this.element.height = this.grid.size * this.grid.y.length;
    }

    update(){
        this.context.fillStyle = this.settings.color;
        this.context.fillRect(0, 0, this.element.width, this.element.height);
    }

    getPosition({x, y}){
        if (x && !y) return this.grid.x[x];
        if (y && !x) return this.grid.y[y];
        return {
            x: this.grid.x[x],
            y: this.grid.y[y]
        };
    }

}

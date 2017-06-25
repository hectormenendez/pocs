class Canvas {

    constructor(settings){
        this.settings = Object.assign({}, Canvas.settings, settings);
        this.element = document.querySelector('canvas');
        this.context = this.element.getContext('2d');
        this.setup();
    }

    static get settings(){
        return Object.freeze({
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
        this.grid = { x:[], y:[] };
        for (let i=0; i < Math.floor(w / this.settings.size); i++)
            this.grid.x.push(i*this.settings.size);
        for (let i=0; i < Math.floor(h / this.settings.size); i++)
            this.grid.y.push(i*this.settings.size);
        // determine canvas size from the grid
        this.element.width = this.settings.size * this.grid.x.length;
        this.element.height = this.settings.size * this.grid.y.length;
    }
}

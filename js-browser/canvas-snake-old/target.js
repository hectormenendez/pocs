class Target {

    constructor(settings){
        this.settings = Object.assign({}, Target.settings, settings);
        this.position = null;
    }

    static get settings(){
        return Object.freeze({
            color: 'tomato'
        });
    }

    setup(canvas){
        this.position = {
            x: Math.round(Math.random() * canvas.grid.x.length),
            y: Math.round(Math.random() * canvas.grid.y.length)
        };
    }

    update(canvas, move=false){
        const {x,y} = canvas.getPosition(this.position);
        canvas.context.fillStyle = this.settings.color;
        canvas.context.fillRect(x, y, canvas.grid.size, canvas.grid.size);
    }
}

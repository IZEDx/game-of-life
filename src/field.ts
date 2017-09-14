

export default class Cell{
    private ctx;
    posX;
    posY;
    alive;

    constructor(ctx : CanvasRenderingContext2D, posX : number, posY : number, alive : boolean = false){
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
        this.alive = alive;
    }


}

export class Position{
    x : number;
    y : number;

    constructor(x : number, y : number){
        this.x = x;
        this.y = y;
    }

    fitToBorders(width : number, height : number) : Position{
        if(this.x >= width)  this.x = this.x % width;
        else if(this.x < 0)  this.x = width - (this.x * -1 % width);

        if(this.y >= height) this.y = this.y % height;
        else if(this.y < 0)  this.y = height - (this.y * -1 % height);

        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);

        return this;
    }
}

export default class Field{
    private field : boolean[][];
    private canvas : HTMLCanvasElement;
    private ctx : CanvasRenderingContext2D;
    private width : number;
    private height : number;

    constructor(canvas : HTMLCanvasElement, width : number = 0, height : number = 0){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.setSize(width, height);
    }

    setSize(width : number, height : number){
        this.width = width;
        this.height = height;
        this.resetField();
    }

    resetField(){
        this.field = [];
        for(let x = 0; x < this.width; x++){
            this.field[x] = [];
            for(let y = 0; y < this.height; y++){
                this.field[x][y] = false;
            }
        }
    }

    setAlive(pos : Position, alive : boolean, sanitize : boolean = true){
        if(sanitize) pos.fitToBorders(this.width, this.height);
        this.field[pos.x][pos.y] = alive;
    }

    isAlive(pos : Position, sanitize : boolean = true) : boolean{
        if(sanitize) pos.fitToBorders(this.width, this.height);
        return this.field[pos.x][pos.y];
    }

    toggleCell(pos : Position){
        pos.fitToBorders(this.width, this.height);
        this.setAlive(pos, !this.isAlive(pos));
    }

    getNeighbours(pos : Position) : Position[]{
        return [
            new Position(pos.x - 1,    pos.y - 1),
            new Position(pos.x,        pos.y - 1),
            new Position(pos.x + 1,    pos.y - 1),
            new Position(pos.x - 1,    pos.y),
            new Position(pos.x + 1,    pos.y),
            new Position(pos.x - 1,    pos.y + 1),
            new Position(pos.x,        pos.y + 1),
            new Position(pos.x + 1,    pos.y + 1),
        ].map((p) => p.fitToBorders(this.width, this.height));
    }

    countAliveNeighbours(pos : Position) : number{
        return this.getNeighbours(pos).filter(pos => this.isAlive(pos)).length;
    }

    forEachAlive(cb : (pos : Position) => void){
        for(let x = 0; x < this.width; x++)
            for(let y = 0; y < this.height; y++)
                if(this.field[x][y])
                    cb(new Position(x, y));
    }

    render(){
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        let cw = this.canvas.width / this.width;
        let ch = this.canvas.height / this.height;

        this.ctx.beginPath();
        this.forEachAlive((pos) => {
            this.ctx.rect(pos.x * cw, pos.y * ch, cw, ch);
        });
        this.ctx.fillStyle = "#AACBAB";
        this.ctx.fill();
    }
}
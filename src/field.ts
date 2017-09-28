import LifeObject from 'lifeobject';

export class Position{
    x : number;
    y : number;

    constructor(x : number, y : number){
        this.x = x;
        this.y = y;
    }

    fitToBorders(width : number, height : number) : Position{
        let x = Math.ceil(this.x);
        let y = Math.ceil(this.y);

        if(x >= width)  x = x % width;
        else if(x < 0)  x = width - (x * -1 % width);

        if(y >= height) y = y % height;
        else if(y < 0)  y = height - (y * -1 % height);

        return new Position(x, y);
    }

    add(xOrPos : number|Position, y? : number) : Position{
        if(typeof xOrPos == "number" && y != null){
            return new Position(this.x + xOrPos, this.y + y);
        }else if(xOrPos instanceof Position){
            return new Position(this.x + xOrPos.x, this.y + xOrPos.y);
        }else{
            return this;
        }
    }

    mul(fac : number){
        return new Position(this.x * fac, this.y * fac);
    }

    sub(pos : Position){
        return this.add(pos.mul(-1));
    }

    ceil() : Position{
        return new Position(Math.ceil(this.x), Math.ceil(this.y));
    }
}

export class Area{
    start : Position;
    end   : Position;

    constructor(v1 : number|Position, v2 : number|Position, v3 : number, v4?: number){
        if(typeof v1 != "number" && typeof v2 != "number"){
            this.start = v1;
            this.end = v2;
        }else if(typeof v1 != "number" && typeof v2 == "number"){
            this.start = v1;
            this.end = new Position(v2 as number, v3);
        }else if(typeof v1 == "number" && typeof v2 == "number" && typeof v3 == "number" && typeof v4 == "number"){
            this.start = new Position(v1, v2);
            this.end = new Position(v3, v4);
        }
    }

    fitToBorders(width : number, height : number) : Area{
        this.start.fitToBorders(width,height);
        this.end.fitToBorders(width,height);
        return this;
    }

    forEachPos(cb : (pos : Position) => void){
        for(let y = this.start.y; y <= this.end.y; y++){
            for(let x = this.start.x; x <= this.end.y; x++){
                cb(new Position(x, y));
            }
        }
    }
}

export default class Field{
    private field : boolean[][];
    private canvas : HTMLCanvasElement;
    private ctx : CanvasRenderingContext2D;
    private width : number;
    private height : number;
    renderBackground : boolean = true;
    backgroundColor : string = "#000000";
    cellColor : string = "#FFFFFF";
    opacity : number = 1.0;

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

    setAlive(pos : Position, alive : boolean = true){
        pos = pos.fitToBorders(this.width, this.height);
        this.field[pos.x][pos.y] = alive;
    }

    isAlive(pos : Position) : boolean{
        pos = pos.fitToBorders(this.width, this.height);
        return this.field[pos.x][pos.y];
    }

    toggleCell(pos : Position){
        this.setAlive(pos, !this.isAlive(pos));
    }

    setLifeObjectAlive(obj : LifeObject, pos : Position, alive : boolean = true){
        for(let target of obj.aliveCells){
            this.setAlive(pos.add(target), alive);
        }
    }

    toggleLifeObject(obj : LifeObject, pos : Position){
        for(let target of obj.aliveCells){
            this.toggleCell(pos.add(target));
        }
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
        let ga = this.ctx.globalAlpha;
        this.ctx.globalAlpha = this.opacity;
        if(this.renderBackground){
            this.ctx.fillStyle = this.backgroundColor;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        let cw = this.canvas.width / this.width;
        let ch = this.canvas.height / this.height;

        this.ctx.beginPath();
        this.forEachAlive((pos) => {
            this.ctx.rect(pos.x * cw, pos.y * ch, cw, ch);
        });
        this.ctx.fillStyle = this.cellColor;
        this.ctx.fill();
        this.ctx.globalAlpha = ga;
    }

    mouseEventToPosition(event : MouseEvent) : Position{
        return new Position(Math.floor(event.pageX / this.canvas.width * this.width), Math.floor(event.pageY / this.canvas.height * this.height));
    }

    getCenter() : Position{
        return new Position(this.width/2, this.height/2).ceil();
    }
}



import LifeObject from 'lifeobject';
import {Vector} from 'utils';

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

    setAlive(pos : Vector, alive : boolean = true){
        pos = pos.fitToBorders(this.width, this.height);
        this.field[pos.x][pos.y] = alive;
    }

    isAlive(pos : Vector) : boolean{
        pos = pos.fitToBorders(this.width, this.height);
        return this.field[pos.x][pos.y];
    }

    toggleCell(pos : Vector){
        this.setAlive(pos, !this.isAlive(pos));
    }

    setLifeObjectAlive(obj : LifeObject, pos : Vector, alive : boolean = true){
        for(let target of obj.aliveCells){
            this.setAlive(pos.add(target), alive);
        }
    }

    toggleLifeObject(obj : LifeObject, pos : Vector){
        for(let target of obj.aliveCells){
            this.toggleCell(pos.add(target));
        }
    }

    getNeighbours(pos : Vector) : Vector[]{
        return [
            new Vector(pos.x - 1,    pos.y - 1),
            new Vector(pos.x,        pos.y - 1),
            new Vector(pos.x + 1,    pos.y - 1),
            new Vector(pos.x - 1,    pos.y),
            new Vector(pos.x + 1,    pos.y),
            new Vector(pos.x - 1,    pos.y + 1),
            new Vector(pos.x,        pos.y + 1),
            new Vector(pos.x + 1,    pos.y + 1),
        ].map((p) => p.fitToBorders(this.width, this.height));
    }

    countAliveNeighbours(pos : Vector) : number{
        return this.getNeighbours(pos).filter(pos => this.isAlive(pos)).length;
    }

    forEachAlive(cb : (pos : Vector) => void){
        for(let x = 0; x < this.width; x++)
            for(let y = 0; y < this.height; y++)
                if(this.field[x][y])
                    cb(new Vector(x, y));
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

    mouseEventToPosition(event : MouseEvent) : Vector{
        return new Vector(Math.floor(event.pageX / this.canvas.width * this.width), Math.floor(event.pageY / this.canvas.height * this.height));
    }

    getCenter() : Vector{
        return new Vector(this.width/2, this.height/2).ceil();
    }
}



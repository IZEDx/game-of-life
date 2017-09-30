import LifeObject from 'lifeobject';
import {Vector} from 'utils';

/**
 * Field creates a game grid, controls it and renders it to its canvas.
 */
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

    /**
     * Creates a new field.
     * @param {HTMLCanvasElement} canvas Canvas used to draw the grid on.
     * @param {number} [width] Width of the grid in units.
     * @param {number} [height] Height of the grid in units.
     */
    constructor(canvas : HTMLCanvasElement, width : number = 0, height : number = 0){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.setSize(width, height);
    }

    /**
     * Gets the size of the grid.
     * @returns {{width: number, height: number}}
     */
    getSize() : {width : number, height : number}{
        return {width : this.width, height : this.height};
    }

    /**
     * Sets the size of the grid.
     * @param {number} width Width of the grid.
     * @param {number} height Height of the grid.
     */
    setSize(width : number, height : number){
        this.width = width;
        this.height = height;
        this.resetField();
    }

    /**
     * Resets the field.
     */
    resetField(){
        this.field = [];
        for(let x = 0; x < this.width; x++){
            this.field[x] = [];
            for(let y = 0; y < this.height; y++){
                this.field[x][y] = false;
            }
        }
    }

    /**
     * Sets the given position alive or not.
     * @param {Vector} pos Position to set.
     * @param {boolean} [alive] Alive or dead?
     */
    setAlive(pos : Vector, alive : boolean = true){
        pos = pos.fitToBorders(this.width, this.height);
        this.field[pos.x][pos.y] = alive;
    }

    /**
     * Checks if the cell at pos is alive.
     * @param {Vector} pos Position to check.
     * @returns {boolean} Is it alive?
     */
    isAlive(pos : Vector) : boolean{
        pos = pos.fitToBorders(this.width, this.height);
        return this.field[pos.x][pos.y];
    }

    /**
     * Toggles the cell at the given position.
     * @param {Vector} pos
     */
    toggleCell(pos : Vector){
        this.setAlive(pos, !this.isAlive(pos));
    }

    /**
     * Sets the given object at pos alive or not.
     * @param {LifeObject} obj Object to use.
     * @param {Vector} pos Where to set.
     * @param {boolean} [alive] Alive or dead?
     */
    setLifeObjectAlive(obj : LifeObject, pos : Vector, alive : boolean = true){
        for(let target of obj.aliveCells){
            this.setAlive(pos.add(target), alive);
        }
    }

    /**
     * Toggles the given object at pos.
     * @param {LifeObject} [obj] Object to toggle.
     * @param {Vector} pos Where to toggle.
     */
    toggleLifeObject(obj : LifeObject, pos : Vector){
        for(let target of obj.aliveCells){
            this.toggleCell(pos.add(target));
        }
    }

    /**
     * Gets all 8 neighbours of pos fit to the borders.
     * @param {Vector} pos
     * @returns {[Vector,Vector,Vector,Vector,Vector,Vector,Vector,Vector]}
     */
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

    /**
     * Counts alive neighbours of pos
     * @param {number} pos
     * @returns {number} Amount of alive neighbours.
     */
    countAliveNeighbours(pos : Vector) : number{
        return this.getNeighbours(pos).filter(pos => this.isAlive(pos)).length;
    }

    /**
     * Calls fn for each alive position in the field.
     * @param {(pos : Vector) => void} fn
     */
    forEachAlive(fn : (pos : Vector) => void){
        for(let x = 0; x < this.width; x++)
            for(let y = 0; y < this.height; y++)
                if(this.field[x][y])
                    fn(new Vector(x, y));
    }

    /**
     * Renders the field to the canvas.
     */
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

    /**
     * Get corresponding field position of a MouseEvent.
     * @param {MouseEvent} event
     * @returns {Vector} Position of the mouse on the grid.
     */
    mouseEventToPosition(event : MouseEvent) : Vector{
        return new Vector(Math.floor(event.pageX / this.canvas.width * this.width), Math.floor(event.pageY / this.canvas.height * this.height));
    }

    /**
     * Gets the center position of the field.
     * @returns {Vector}
     */
    getCenter() : Vector{
        return new Vector(this.width/2, this.height/2).ceil();
    }
}


export class ListField extends Field{
    private list : Vector[] = [];

    /**
     *
     * @param {HTMLCanvasElement} canvas Canvas used to draw the grid on.
     * @param {number} [width] Width of the grid in units.
     * @param {number} [height] Height of the grid in units.
     */
    constructor(canvas : HTMLCanvasElement, width : number = 0, height : number = 0){
        super(canvas, width, height);
    }

    /**
     * Resets the field.
     */
    resetField(){
        this.list = [];
    }

    /**
     * Sets the given position alive or not.
     * @param {Vector} pos Position to set.
     * @param {boolean} [alive] Alive or dead?
     */
    setAlive(pos : Vector, alive : boolean = true){
        let size = this.getSize();
        pos = pos.fitToBorders(size.width, size.height);
        let idx = this.list.indexOf(pos);
        if(alive && idx == -1){          // Add to list
            this.list.push(pos);
        }else if(!alive && idx >= 0){    // Delete from list
            this.list.splice(idx,idx);
        }
    }

    /**
     * Checks if the cell at pos is alive.
     * @param {Vector} pos Position to check.
     * @returns {boolean} Is it alive?
     */
    isAlive(pos : Vector) : boolean{
        let size = this.getSize();
        pos = pos.fitToBorders(size.width, size.height);
        return this.list.indexOf(pos) >= 0;
    }


    /**
     * Calls fn for each alive position in the field.
     * @param {(pos : Vector) => void} fn
     */
    forEachAlive(fn : (pos : Vector) => void){
        this.list.forEach(pos => fn(pos));
    }
}
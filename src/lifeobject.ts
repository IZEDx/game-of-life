import {Vector, Area} from 'utils';

/**
 * LifeObject resembles a collection of cells that can be used with the ObjectManager to be
 * saved, loaded and spawned by the player or be directly set on a Field.
 * @see {@link ObjectManager}
 * @see {@link Field}
 */
export default class LifeObject extends Area{
    private _aliveCells : Vector[] = [];

    get aliveCells(){ return this._aliveCells; }

    /**
     * Creates a LifeObject
     * @param {Vector[]} aliveCells
     */
    constructor(aliveCells : Vector[]){
        super(0,0,0,0);
        let minPoint = new Vector(999,999);
        let maxPoint = new Vector(0,0);
        for(let pos of aliveCells){
            if(pos.x < minPoint.x) minPoint.x = pos.x;
            if(pos.x > maxPoint.x) maxPoint.x = pos.x;
            if(pos.y < minPoint.y) minPoint.y = pos.y;
            if(pos.y > maxPoint.y) maxPoint.y = pos.y;
            this._aliveCells.push(new Vector(pos.x, pos.y));
        }
        this.start = minPoint;
        this.end = maxPoint;
    }

    /**
     * Centers the object on pos.
     * @param {Vector} pos Position to center the object on.
     * @returns {Vector} New Position to spawn at.
     */
    centerPos(pos : Vector) : Vector{
        return pos.sub(this.start).add(this.width/-2, this.height/-2)
    }

    /**
     * Serializes the object in minimum form.
     * @returns {[{x: number, y: number},{x: number, y: number},{x: number, y: number},{x: number, y: number},{x: number, y: number}]}
     */
    serialize() : Object|Array<any>{
        return this._aliveCells.map(pos => pos.serialize());
    }

    /**
     * Parses a Life1.05 String into a LifeObject
     * @static
     * @param {string} lifeString Life1.05 String
     * @returns {LifeObject}
     */
    static parseLife105(lifeString : string) : LifeObject{
        let aliveCells : Vector[] = [];
        let y = 0;
        let origin = new Vector(0,0);
        for(let line of lifeString.split("\n")){
            let res = line.match(/#P\s+(-?\d+)\s+(-?\d+)/);
            if(res != null) {
                y = 0;
                origin = new Vector(parseInt(res[1]), parseInt(res[2]));
            }
            if(line.substr(0,1) == "#") continue;
            let x = 0;
            for(let char of line.split("")){
                if(char == "*") aliveCells.push(new Vector(origin.x + x, origin.y + y));
                x++;
            }
            y++;
        }

        return new LifeObject(aliveCells);
    }

    /**
     * Parses a Life1.06 String into a LifeObject
     * @static
     * @param {string} lifeString Life1.06 String
     * @returns {LifeObject}
     */
    static parseLife106(lifeString : string) : LifeObject{
        let aliveCells : Vector[] = [];
        for(let line of lifeString.split("\n")){
            if(line.substr(0,1) == "#") continue;
            let res = line.match(/^(\d+)\s+(\d+)$/);
            if(res == null) continue;
            aliveCells.push(new Vector(parseInt(res[1]), parseInt(res[2])));
        }

        return new LifeObject(aliveCells);
    }

    /**
     * Detects the Life1.0[5/6] version of the string and parses it accordingly.
     * @param {string} lifeString Life1.0[5/6] String
     * @returns {LifeObject}
     */
    static parseLife(lifeString : string) : LifeObject{
        if(lifeString.indexOf("#Life 1.06") == 0) return LifeObject.parseLife106(lifeString);
        return LifeObject.parseLife105(lifeString);
    }
}

/**
 * Single dot LifeObject
 * @type {LifeObject}
 */
export const dot = new LifeObject([new Vector(0,0)]);
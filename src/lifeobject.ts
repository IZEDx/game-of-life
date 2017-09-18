import Field, {Position} from 'field';


export default class LifeObject{
    private _aliveCells : Position[] = [];
    private _width : number = 0;
    private _height : number = 0;
    private _origin : Position = new Position(0,0);

    get aliveCells(){ return this._aliveCells; }
    get width(){ return this._width; }
    get height(){ return this._height; }
    get origin(){ return this._origin; }

    constructor(aliveCells : Position[]){
        let minPoint = new Position(999,999);
        let maxPoint = new Position(0,0);
        for(let pos of aliveCells){
            if(pos.x < minPoint.x) minPoint.x = pos.x;
            if(pos.x > maxPoint.x) maxPoint.x = pos.x;
            if(pos.y < minPoint.y) minPoint.y = pos.y;
            if(pos.y > maxPoint.y) maxPoint.y = pos.y;
            this._aliveCells.push(new Position(pos.x, pos.y));
        }
        this._width = maxPoint.x - minPoint.x;
        this._height = maxPoint.y - minPoint.y;
        this._origin = minPoint;
    }

    static parseLife105(lifeString : string) : LifeObject{
        let aliveCells : Position[] = [];
        let y = 0;
        let origin = new Position(0,0);
        for(let line of lifeString.split(/[\n\t]+/g)){
            let res = line.match(/^#P\s+(-?\d+)\s+(-?\d+)\s+$/);
            console.log(line, res);
            if(res != null) {
                y = 0;
                origin = new Position(parseInt(res[1]), parseInt(res[2]));
            }
            if(line.substr(0,1) == "#") continue;
            let x = 0;
            for(let char of line.split("")){
                if(char == "*") aliveCells.push(new Position(origin.x + x, origin.y + y));
                x++;
            }
            y++;
        }

        return new LifeObject(aliveCells);
    }

    static parseLife106(lifeString : string) : LifeObject{
        let aliveCells : Position[] = [];
        for(let line of lifeString.split(/[\n\t]+/g)){
            if(line.substr(0,1) == "#") continue;
            let res = line.match(/^(\d+)\s+(\d+)$/);
            if(res == null) continue;
            aliveCells.push(new Position(parseInt(res[1]), parseInt(res[2])));
        }

        return new LifeObject(aliveCells);
    }

    static parseLife(lifeString : string) : LifeObject{
        if(lifeString.indexOf("#Life 1.06") == 0) return LifeObject.parseLife106(lifeString);
        return LifeObject.parseLife105(lifeString);
    }
}

export const dot = new LifeObject([new Position(0,0)]);
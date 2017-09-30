/**
 * Simple nop, for whenever needed.
 */
export function nop() {}

/**
 * Fetches the content of the given URL using HTTP-GET.
 * @param url {string} URL to fetch.
 * @returns {Promise<string>} Promise containing the result string.
 */
export function get(url : string){
    return new Promise((resolve : (str) => void) =>{
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                resolve(xmlHttp.responseText);
        };
        xmlHttp.open("GET", url, true);
        xmlHttp.send(null);
    });
}

/**
 * Holds methods for easier calculation with the aspect ratio.
 */
export class AspectRatio {
    /**
     * Calculates the height of the window by using the width and the aspect ratio.
     * @param {number} width Width to get height for.
     * @returns {number} Corresponding height.
     */
    static heightFromWidth(width : number){
        return Math.round(window.innerHeight / window.innerWidth * width);
    }
    /**
     * Calculates the width of the window by using the height and the aspect ratio.
     * @param {number} height Height to get width for.
     * @returns {number} Corresponding width.
     */
    static widthFromHeight(height : number){
        return Math.round(window.innerWidth / window.innerHeight * height);
    }
}

/**
 * Vector class to hold x,y and calculate with them.
 * Operations on the Vector always return a new Vector.
 */
export class Vector{
    x : number;
    y : number;

    /**
     * Creates a Vector
     * @constructor
     * @param {number} x x-coordinate
     * @param {number} y y-coordinate
     */
    constructor(x : number, y : number){
        this.x = x;
        this.y = y;
    }

    /**
     * Serializes the Vector into an object containing the x- and y-coordinate.
     * @returns {{x: number, y: number}}
     */
    serialize(){
        return {
            x : this.x,
            y : this.y
        }
    }

    /**
     * Fits the Vector into the given width and height.
     * If either is exceeded or either coordinate is negative, the vector will be re-positioned to the opposite side,
     * until it fits inside the given borders.
     * @param {number} width
     * @param {number} height
     * @returns {Vector}
     */
    fitToBorders(width : number, height : number) : Vector{
        let x = Math.ceil(this.x);
        let y = Math.ceil(this.y);

        if(x >= width)  x = x % width;
        else if(x < 0)  x = width - (x * -1 % width);

        if(y >= height) y = y % height;
        else if(y < 0)  y = height - (y * -1 % height);

        return new Vector(x, y);
    }

    /**
     * Adds either x-,y-coordinates or a Vector to this Vector and returns the sum Vector.
     * @param {number|Vector} xOrVec x-coordinate or vector to add.
     * @param {number} [y] y-coordinate to add, if first parameter was the x-coordinate.
     * @returns {Vector} Resulting Vector.
     */
    add(xOrVec : number|Vector, y? : number) : Vector{
        if(typeof xOrVec == "number" && y != null){
            return new Vector(this.x + xOrVec, this.y + y);
        }else if(xOrVec instanceof Vector){
            return new Vector(this.x + xOrVec.x, this.y + xOrVec.y);
        }else{
            return this;
        }
    }

    /**
     * Multiplies the Vector by a given factor and returns the result.
     * @param {number} fac Factor to multiply the Vector with.
     * @returns {Vector} Resulting Vector.
     */
    mul(fac : number){
        return new Vector(this.x * fac, this.y * fac);
    }

    /**
     * Subtracts one Vector from the other and returns the result.
     * @param {Vector} vec Vector to be substracted.
     * @returns {Vector} Resulting Vector.
     */
    sub(vec : Vector){
        return this.add(vec.mul(-1));
    }

    /**
     * Rounds the Vector's coordinates to the nearest whole.
     * @returns {Vector} Resulting Vector.
     */
    ceil() : Vector{
        return new Vector(Math.ceil(this.x), Math.ceil(this.y));
    }
}

/**
 * Area class providing corners defining the area and it's size.
 */
export class Area{
    private _start : Vector;
    private _end   : Vector;
    private _width : number;
    private _height : number;

    get start() { return this._start };
    get end() { return this._end };
    get width() { return this._width };
    get height() { return this._height };

    set start(pos : Vector){
        this._start = pos;
        this.calculateSize();
    }
    set end(pos : Vector){
        this._end = pos;
        this.calculateSize();
    }

    /**
     * @constructor
     * @param {number|Vector} v1 Either x1 or v1.
     * @param {number|Vector} v2 Either y1, x2 or v2.
     * @param {number} [v3] Either x2 or y2
     * @param {number} [v4] y2
     */
    constructor(v1 : number|Vector, v2 : number|Vector, v3? : number, v4?: number){
        if(typeof v1 != "number" && typeof v2 != "number"){
            this._start = v1;
            this._end = v2;
        }else if(typeof v1 != "number" && typeof v2 == "number"){
            this._start = v1;
            this._end = new Vector(v2 as number, v3);
        }else if(typeof v1 == "number" && typeof v2 == "number" && typeof v3 == "number" && typeof v4 == "number"){
            this._start = new Vector(v1, v2);
            this._end = new Vector(v3, v4);
        }
        this.calculateSize();
    }

    /**
     * Serializes the Area
     * @returns {{start: {x: number, y: number}, end: {x: number, y: number}, width: number, height: number}}
     */
    serialize() : Object|Array<any>{
        return {
            start : this._start.serialize(),
            end : this._end.serialize(),
            width : this.width,
            height : this.height
        }
    }

    /**
     * Updates the width and height based on the start and end vector.
     */
    calculateSize(){
        this._width = Math.sqrt(Math.pow(this._start.x - this._end.x, 2));
        this._height = Math.sqrt(Math.pow(this._start.y - this._end.y, 2));
    }

    /**
     * Fits the area to the given width and height
     * @see {@link Vector.serialize}
     * @param {number} width
     * @param {number} height
     * @returns {Area}
     */
    fitToBorders(width : number, height : number) : Area{
        this._start.fitToBorders(width,height);
        this._end.fitToBorders(width,height);
        return this;
    }

    /**
     * Calls fn for each Position in the Area
     * @param {(pos : Vector) => void} fn
     */
    forEachPos(fn : (pos : Vector) => void){
        for(let y = this._start.y; y <= this._end.y; y++){
            for(let x = this._start.x; x <= this._end.y; x++){
                fn(new Vector(x, y));
            }
        }
    }
}
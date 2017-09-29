
export function nop() {}

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

export function checkForModals(){
    $(".modal").each(function(){
        let modal = $(this);
        modal.children(".content").children(".header").children(".modal-close").on("click", () => modal.hide());
    });
    $(".modal-toggle").each(function(){
        let btn = $(this);
        btn.on("click", () => {
            let hidden = $(btn.attr("ref")).css('display') == "none";
            $(".modal").each(function(){
                $(this).hide();
            });
            if(hidden){
                $(btn.attr("ref")).show();
            }else{
                $(btn.attr("ref")).hide();
            }
        });
    });
}

export class AspectRatio {
    static heightFromWidth(width : number){
        return Math.round(window.innerHeight / window.innerWidth * width);
    }
    static widthFromHeight(height : number){
        return Math.round(window.innerWidth / window.innerHeight * height);
    }
}

export class Vector{
    x : number;
    y : number;

    constructor(x : number, y : number){
        this.x = x;
        this.y = y;
    }

    serialize(){
        return {
            x : this.x,
            y : this.y
        }
    }

    fitToBorders(width : number, height : number) : Vector{
        let x = Math.ceil(this.x);
        let y = Math.ceil(this.y);

        if(x >= width)  x = x % width;
        else if(x < 0)  x = width - (x * -1 % width);

        if(y >= height) y = y % height;
        else if(y < 0)  y = height - (y * -1 % height);

        return new Vector(x, y);
    }

    add(xOrVec : number|Vector, y? : number) : Vector{
        if(typeof xOrVec == "number" && y != null){
            return new Vector(this.x + xOrVec, this.y + y);
        }else if(xOrVec instanceof Vector){
            return new Vector(this.x + xOrVec.x, this.y + xOrVec.y);
        }else{
            return this;
        }
    }

    mul(fac : number){
        return new Vector(this.x * fac, this.y * fac);
    }

    sub(vec : Vector){
        return this.add(vec.mul(-1));
    }

    ceil() : Vector{
        return new Vector(Math.ceil(this.x), Math.ceil(this.y));
    }
}

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

    constructor(v1 : number|Vector, v2 : number|Vector, v3 : number, v4?: number){
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

    serialize() : Object|Array<any>{
        return {
            start : this._start.serialize(),
            end : this._end.serialize(),
            width : this.width,
            height : this.height
        }
    }

    calculateSize(){
        this._width = Math.sqrt(Math.pow(this._start.x - this._end.x, 2));
        this._height = Math.sqrt(Math.pow(this._start.y - this._end.y, 2));
    }

    fitToBorders(width : number, height : number) : Area{
        this._start.fitToBorders(width,height);
        this._end.fitToBorders(width,height);
        return this;
    }

    forEachPos(cb : (pos : Vector) => void){
        for(let y = this._start.y; y <= this._end.y; y++){
            for(let x = this._start.x; x <= this._end.y; x++){
                cb(new Vector(x, y));
            }
        }
    }
}
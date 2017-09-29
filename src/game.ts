import Field from 'field';
import {nop} from 'utils';


export default class Game{
    private _field : Field;
    private _ghostField : Field;
    private _timer : number;
    private _survive = [2,3];
    private _born = [3];
    private _generation = 0;
    private _population = 0;
    private _running : boolean;
    private _interval = 1;
    private _speed = 100;
    private _tickCounter = 0;

    onStateChange : (running : boolean) => void = nop;
    onGenerationChange : (generation : number) => void = nop;
    onPopulationChange : (population : number) => void = nop;
    onSpeedChange : (speed : number) => void = nop;
    onRuleChange : (rule : string) => void = nop;

    constructor(canvas : HTMLCanvasElement, width : number = 0, height : number = 0){
        this._field = new Field(canvas, width, height);
        this._ghostField = new Field(canvas, width, height);
        this._ghostField.opacity = 0.5;
        this._ghostField.renderBackground = false;
        this._ghostField.cellColor = "#66ee66";
        this.speed = 25;
    }

    set rule(sbrule : string){
        let res = /^(\d*)\/(\d*)$/g.exec(sbrule);
        if(res == null) return;
        this._survive   = res[1].split("").map(s => parseInt(s));
        this._born      = res[2].split("").map(s => parseInt(s));

        this.onRuleChange(sbrule);
    }
    get rule(){
        return this._survive.join() + "/" + this._born.join();
    }

    tick(){
        this._tickCounter++;
        if(this._tickCounter % this._interval == 0){
            this.next();
        }
    }

    set running(run : boolean){
        this._running = run;
        this.onStateChange(run);

        if(run){
            this._tickCounter = 0;
            this._timer = setInterval(this.tick.bind(this), 10);
        }else{
            clearInterval(this._timer);
        }
    }
    get running() : boolean{
        return this._running;
    }


    set generation(gen : number){
        this._generation = gen;
        this.onGenerationChange(gen);
    }
    get generation() : number{
        return this._generation;
    }


    set population(pop : number){
        this._population = pop;
        this.onPopulationChange(pop);
    }
    get population() : number{
        return this._population;
    }


    set speed(speed : number){
        this._speed = speed;
        this._interval = Math.round(100 / Math.sqrt(this.speed)) - 9;
        this.onSpeedChange(speed);
    }
    get speed() : number{
        return this._speed;
    }


    get field() : Field{
        return this._field;
    }
    get ghostField() : Field{
        return this._ghostField;
    }

    invertRule(){
        let survive = [];
        let born = [];
        for(let i = 0; i <= 8; i++){
            if(this._survive.indexOf(i) < 0)    survive.push(i);
            if(this._born.indexOf(i) < 0)       born.push(i);
        }
        this._survive = survive;
        this._born = born;

        this.onRuleChange(this._survive.join("")+"/"+this._born.join(""));
    }

    next(){
        let cellsToToggle = [];
        let pop = 0;

        this._field.forEachAlive((pos) => {
            let c = this._field.countAliveNeighbours(pos);
            pop++;

            if(this._survive.indexOf(c) == -1) cellsToToggle.push(pos);

            this._field.getNeighbours(pos).filter(nb => !this._field.isAlive(nb)).forEach(nb => {
                let nbc = this._field.countAliveNeighbours(nb);
                if(this._born.indexOf(nbc) != -1) cellsToToggle.push(nb);
            });
        });

        for(let pos of cellsToToggle){
            this._field.toggleCell(pos);
        }

        this.generation++;
        this.population = pop;
        this.render();
    }


    render(){
        this._field.render();
        this._ghostField.render();
    }

    reset(){
        this.generation = 0;
        this.population = 0;
        this._field.resetField();
        this.running = false;
        this.render();
    }
}
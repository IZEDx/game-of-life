import Field from 'field';
import {nop} from 'utils';

export default class Game{
    private _field : Field;
    private _timer : number;
    private _survive : number[] = [2,3];
    private _born : number[] = [3];
    private _generation : number = 0;
    private _population : number = 0;
    private _running : boolean;
    private _interval : number = 50;

    onStateChange : (running : boolean) => void = nop;
    onGenerationChange : (generation : number) => void = nop;
    onPopulationChange : (population : number) => void = nop;
    onIntervalChange : (interval : number) => void = nop;
    onRuleChange : (rule : string) => void = nop;

    constructor(field : Field){
        this._field = field;
    }

    set rule(sbrule : string){
        if(/^\d*\/\d*$/g.test(sbrule)){
            let parts = sbrule.split("/");
            this._survive   = parts[0].split("").map(s => parseInt(s));
            this._born      = parts[1].split("").map(s => parseInt(s));
            this.onRuleChange(sbrule);
        }
    }
    get rule(){
        return this._survive.join() + "/" + this._born.join();
    }


    set running(run : boolean){
        this._running = run;
        this.onStateChange(run);

        if(run){
            this._timer = setInterval(this.next.bind(this), this._interval);
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


    set interval(interval : number){
        this._interval = interval;
        if(this._running){
            clearInterval(this._timer);
            this._timer = setInterval(this.next.bind(this), this._interval);
        }
        this.onIntervalChange(interval);
    }
    get interval() : number{
        return this._interval;
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
    }


    reset(){
        this.generation = 0;
        this.population = 0;
        this._field.resetField();
        this.running = false;
        this.render();
    }
}
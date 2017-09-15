import Field from 'field';

export default class Game{
    private field : Field;
    private generation : number = 0;
    private population : number = 0;
    private timer : number;
    private running : boolean;
    private survive : number[];
    private revive : number[];
    private stateChange = (generation : number, population : number) => {};

    constructor(field : Field){
        this.field = field;
        this.survive = [2,3];
        this.revive = [3];
    }

    setRules(survive : number[], revive : number[]){
        this.survive = survive;
        this.revive = revive;
    }

    next(){
        this.generation++;

        let cellsToToggle = [];
        let pop = 0;

        this.field.forEachAlive((pos) => {
            let c = this.field.countAliveNeighbours(pos);
            pop++;

            if(this.survive.indexOf(c) == -1) cellsToToggle.push(pos);

            this.field.getNeighbours(pos).filter(nb => !this.field.isAlive(nb)).forEach(nb => {
                let nbc = this.field.countAliveNeighbours(nb);
                if(this.revive.indexOf(nbc) != -1) cellsToToggle.push(nb);
            });
        });

        this.population = pop;

        this.stateChange(this.generation, this.population);

        for(let pos of cellsToToggle){
            this.field.toggleCell(pos);
        }

        this.render();
    }

    render(){
        this.field.render();
    }

    start(interval : number){
        this.timer = setInterval(this.next.bind(this), interval);
        this.running = true;
    }

    stop(){
        clearInterval(this.timer);
        this.running = false;
    }

    isRunning(){
        return this.running;
    }

    reset(){
        this.generation = 0;
        this.population = 0;
        this.field.resetField();
        this.stateChange(this.generation, this.population);
        this.render();
    }

    onStateChange(callback : (generation : number, population : number) => void){
        this.stateChange = callback;
    }
}
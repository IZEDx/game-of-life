import Field from 'field';

export default class Game{
    private field : Field;
    private generation : number = 0;
    private timer : number;
    private running : boolean;

    constructor(field : Field){
        this.field = field;
    }

    next(){
        this.generation++;

        let cellsToToggle = [];

        this.field.forEachAlive((pos) => {
            let c = this.field.countAliveNeighbours(pos);

            if(c < 2 || c > 3){
                cellsToToggle.push(pos);
            }

            this.field.getNeighbours(pos).filter(nb => !this.field.isAlive(nb)).forEach(nb => {
                let nbc = this.field.countAliveNeighbours(nb);
                if(nbc == 3) cellsToToggle.push(nb);
            });
        });

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
        this.field.resetField();
        this.render();
    }
}
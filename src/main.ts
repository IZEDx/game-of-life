import Field, {Position as Pos} from 'field';
import Game from 'game';
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const width = 250;
const height = Math.round(window.innerHeight / window.innerWidth * width);
const field = new Field(canvas, width, height);
const game = new Game(field);

field.toggleCell(new Pos(10, 5));
field.toggleCell(new Pos(11, 5));
field.toggleCell(new Pos(12, 5));
field.toggleCell(new Pos(12, 4));
field.toggleCell(new Pos(11, 3));

function canvasClick(event){
    let pos = new Pos(Math.floor(event.pageX / canvas.width * width), Math.floor(event.pageY / canvas.height * height));
    field.toggleCell(pos);
    game.population++;
    game.render();
}

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    game.render();
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas, false);
canvas.addEventListener('click', canvasClick, false);


const startStopButton   = document.getElementById("startStopButton");
const nextStepButton    = document.getElementById("nextStepButton");
const resetButton       = document.getElementById("resetButton");
const generationText    = document.getElementById("generation");
const populationText    = document.getElementById("population");

startStopButton.onclick = () => game.running = !game.running;
nextStepButton.onclick  = () => game.next();
resetButton.onclick     = () => game.reset();

game.onPopulationChange = (pop) => populationText.innerText = pop.toString();
game.onGenerationChange = (gen) => generationText.innerText = gen.toString();
game.onStateChange      = (run) => startStopButton.innerHTML = '<i class="fa fa-' + (run ? 'pause' : 'play') + '" aria-hidden="true"></i>';


import Field, {Position as Pos} from 'field';
import Game from 'game';
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const width = 100;
const height = Math.round(window.innerHeight / window.innerWidth * width);
const field = new Field(canvas, width, height);
const game = new Game(field);

field.toggleCell(new Pos(10, 5));
field.toggleCell(new Pos(11, 5));
field.toggleCell(new Pos(12, 5));
field.toggleCell(new Pos(12, 4));
field.toggleCell(new Pos(11, 3));

canvas.addEventListener('click', function(event) {
    let pos = new Pos(Math.floor(event.pageX / canvas.width * width), Math.floor(event.pageY / canvas.height * height));
    field.toggleCell(pos);
    game.render();
}, false);

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    game.render();
}
window.addEventListener("resize", resizeCanvas, false);
resizeCanvas();



const startStopButton = document.getElementById("startStopButton");
startStopButton.onclick = function(){
    if(game.isRunning()){
        game.stop();
        startStopButton.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
    }else{
        game.start(100);
        startStopButton.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>';
    }
};


const nextStepButton = document.getElementById("nextStepButton");
nextStepButton.onclick = function(){
    if(!game.isRunning()){
        game.next();
    }
};


const resetButton = document.getElementById("resetButton");
resetButton.onclick = function(){
    game.reset();
};
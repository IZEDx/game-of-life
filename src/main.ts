import {Position} from 'field';
import Game from 'game';
import LifeObject, {dot} from 'lifeobject';
import {get} from 'utils';
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const width = 250;
const height = Math.round(window.innerHeight / window.innerWidth * width);
const game = new Game(canvas, width, height);
let selectedObject : LifeObject = dot;

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    game.render();
}

function canvasClick(event : MouseEvent){
    let pos = game.field.mouseEventToPosition(event);
    game.field.toggleLifeObject(selectedObject, pos
        .add(-selectedObject.origin.x, -selectedObject.origin.y)
        .add(selectedObject.width/-2, selectedObject.height/-2));
    game.render();
}

function canvasMouseMove(event : MouseEvent){
    let pos = game.ghostField.mouseEventToPosition(event);
    game.ghostField.resetField();
    game.ghostField.setLifeObjectAlive(selectedObject, pos
        .add(-selectedObject.origin.x, -selectedObject.origin.y)
        .add(selectedObject.width/-2, selectedObject.height/-2));
    game.render();
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas, false);
canvas.addEventListener('click', canvasClick, false);
canvas.addEventListener('mousemove', canvasMouseMove, false);


const startStopButton   = document.getElementById("startStopButton")as HTMLButtonElement;
const nextStepButton    = document.getElementById("nextStepButton") as HTMLButtonElement;
const resetButton       = document.getElementById("resetButton")    as HTMLButtonElement;
const generationText    = document.getElementById("generation")     as HTMLSpanElement;
const populationText    = document.getElementById("population")     as HTMLSpanElement;
const speedSlider       = document.getElementById("speedSlider")    as HTMLInputElement;
const spawnButtons      = document.getElementsByClassName("btn-spawn") as HTMLCollectionOf<HTMLButtonElement>;

startStopButton.onclick     = () => game.running = !game.running;
nextStepButton.onclick      = () => game.next();
resetButton.onclick         = () => game.reset();
speedSlider.oninput         = (ev) => game.interval = parseInt(speedSlider.value);
for(let i = 0; i < spawnButtons.length; i++){
    spawnButtons.item(i).onclick = () =>
        get(spawnButtons.item(i).getAttribute("ref")).then( str => {
            selectedObject = LifeObject.parseLife(str);
            game.ghostField.resetField();
            game.ghostField.setLifeObjectAlive(selectedObject,
                new Position(width/2 - selectedObject.width/2, height/2 - selectedObject.height/2)
                .add(-selectedObject.origin.x, -selectedObject.origin.y));
            game.render();
        });
}

game.onPopulationChange = (pop) => populationText.innerText = pop.toString();
game.onGenerationChange = (gen) => generationText.innerText = gen.toString();
game.onStateChange      = (run) => startStopButton.innerHTML = '<i class="fa fa-' + (run ? 'pause' : 'play') + '" aria-hidden="true"></i>';

get("./assets/objects/startscreen.life").then(str => {
    let obj = LifeObject.parseLife(str);
    game.ghostField.resetField();
    game.ghostField.setLifeObjectAlive(obj,
        new Position(width/2 - obj.width/2, height/2 - obj.height/2)
            .add(-obj.origin.x, -obj.origin.y));
    game.field.setLifeObjectAlive(obj,
        new Position(width/2 - obj.width/2, height/2 - obj.height/2)
            .add(-obj.origin.x, -obj.origin.y));
    game.render();
});
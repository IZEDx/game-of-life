import Game from "game";
import {checkForModals, get, AspectRatio} from "utils";
import * as $ from "jquery";
import ObjectManager from "object-manager";
import LifeObject, {dot} from 'lifeobject';

const width         = 400;
const height        = AspectRatio.heightFromWidth(width);

const canvas        = document.getElementById("canvas") as HTMLCanvasElement;
const game          = new Game(canvas, width, height);
const objectManager = new ObjectManager(canvas, game, "#objectList");

window["gameOfLife"] = game;
window["objectManager"] = objectManager;

canvas.addEventListener('click', objectManager.canvasClick.bind(objectManager), false);
canvas.addEventListener('mousemove', objectManager.canvasMouseMove.bind(objectManager), false);
canvas.addEventListener('mousedown', objectManager.canvasMouseDown.bind(objectManager), false);
canvas.addEventListener('mouseup', objectManager.canvasMouseUp.bind(objectManager), false);
window.addEventListener('mouseup', objectManager.windowMouseUp.bind(objectManager), false);

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    game.render();
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas, false);

game.onPopulationChange = (pop) => $("#population").text(pop.toString());
game.onGenerationChange = (gen) => $("#generation").text(gen.toString());
game.onStateChange      = (run) => $("#startStopButton").html(`<i class="fa fa-${run ? "pause" : "play"}" aria-hidden="true"></i>`);

$("#startStopButton")   .on("click", () => game.running = !game.running);
$("#nextStepButton")    .on("click", () => game.next());
$("#resetButton")       .on("click", () => game.reset());
$("#speedSlider")       .on("input", function() { game.speed = $(this).val() as number });
$("#singleDotButton")   .on("click", () => objectManager.switchTo(dot));


// Modals
checkForModals();

// Startscreen

get("./dist/objects/startscreen.life").then(str => {
    let obj = LifeObject.parseLife(str);
    game.ghostField .resetField();
    game.ghostField .setLifeObjectAlive(obj, obj.centerPos(game.ghostField.getCenter()));
    game.field      .setLifeObjectAlive(obj, obj.centerPos(game.ghostField.getCenter()));
    game.render();
});
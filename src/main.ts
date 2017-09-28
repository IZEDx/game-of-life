import Game from 'game';
import {spawnStartscreen, checkForModals} from 'utils';
import * as $ from "jquery";
import ObjectManager from "object-manager";

const width         = 400;
const height        = Math.round(window.innerHeight / window.innerWidth * width);

const canvas        = document.getElementById("canvas") as HTMLCanvasElement;
const game          = new Game(canvas, width, height);
const objectManager = new ObjectManager(canvas, game, "#objectList");

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    game.render();
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas, false);


game.onPopulationChange = (pop) => $("#population").text(pop.toString());
game.onGenerationChange = (gen) => $("#generation").text(gen.toString());
game.onStateChange      = (run) => $("#startStopButton").html(`<i class="fa fa-${run ? 'pause' : 'play'}" aria-hidden="true"></i>`);

$("#startStopButton")   .on("click", () => game.running = !game.running);
$("#nextStepButton")    .on("click", () => game.next());
$("#resetButton")       .on("click", () => game.reset());
$("#speedSlider")       .on("input", function() { game.speed = $(this).val() as number });
$("#singleDotButton")   .on("click", () => objectManager.switchTo("Dot"));


// Modals
checkForModals();

// Startscreen
spawnStartscreen(game);

window["gameOfLife"] = game;
window["objectManager"] = objectManager;
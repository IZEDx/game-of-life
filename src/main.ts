import Game from "game";
import {AspectRatio} from "utils";
import * as $ from "jquery";
import ObjectManager from "object-manager";
import LifeObject, {dot} from 'lifeobject';

/**
 * Entry Point
 */

// Set game dimensions
const width         = 400;
const height        = AspectRatio.heightFromWidth(width);

// Initialize important stuff
const canvas        = document.getElementById("canvas") as HTMLCanvasElement;
const game          = new Game(canvas, width, height);
const objectManager = new ObjectManager(game, "#objectList");

// Export for console fiddling
window["gameOfLife"] = game;
window["objectManager"] = objectManager;

// Pipe Events to the objectManager
canvas.addEventListener('click',        objectManager.canvasClick.bind(objectManager), false);
canvas.addEventListener('mousemove',    objectManager.canvasMouseMove.bind(objectManager), false);
canvas.addEventListener('mousedown',    objectManager.canvasMouseDown.bind(objectManager), false);
canvas.addEventListener('mouseup',      objectManager.canvasMouseUp.bind(objectManager), false);
window.addEventListener('mouseup',      objectManager.windowMouseUp.bind(objectManager), false);

// Resize canvas on screensize change (Does not update the field resolution)
function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    game.render();
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas, false);

// Some dom elements
const el = {
    startStopButton: $("#startStopButton"),
    nextStepButton: $("#nextStepButton"),
    resetButton: $("#resetButton"),
    singleDotButton: $("#singleDotButton"),
    speedSlider: $("#speedSlider"),
    textInput: $("#text"),
    nameInput: $("#name"),
    importButton: $("#importButton"),
    population: $("#population"),
    generation: $("#generation")
}

// Update dom elements on game events
game.onPopulationChange = (pop) => el.population.text(pop.toString());
game.onGenerationChange = (gen) => el.generation.text(gen.toString());
game.onStateChange      = (run) => el.startStopButton.html(`<i class="fa fa-${run ? "pause" : "play"}" aria-hidden="true"></i>`);

// Update the game and objectManager on dom events
el.startStopButton  .on("click", () => game.running = !game.running);
el.nextStepButton   .on("click", () => game.next());
el.resetButton      .on("click", () => game.reset());
el.speedSlider      .on("input", function() { game.speed = $(this).val() as number });
el.singleDotButton  .on("click", () => objectManager.switchTo(dot));
el.importButton     .on("click", () => {
    if(el.nameInput.val().toString() == "" || el.textInput.val().toString() == "") return alert("No field can be empty.");
    objectManager.importString(el.nameInput.val().toString(), el.textInput.val().toString());
    $("#addObjectModal").hide();
    $("#objectManagerModal").hide();
});

// Initialize Modal functionality
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

// Spawn Startscreen
const startScreenCode = `
************************************************
..................................................
.******...********...******...*******...********..
**....**.....**.....**....**..**....**.....**.....
**...........**.....**....**..**....**.....**.....
.******......**.....********..*******......**.....
......**.....**.....**....**..**....**.....**.....
**....**.....**.....**....**..**....**.....**.....
.******......**.....**....**..**....**.....**.....
..................................................
************************************************
 `;

let startScreen = LifeObject.parseLife(startScreenCode);
game.ghostField .resetField();
game.ghostField .setLifeObjectAlive(startScreen, startScreen.centerPos(game.ghostField.getCenter()));
game.field      .setLifeObjectAlive(startScreen, startScreen.centerPos(game.ghostField.getCenter()));

// Render the game for the first time. (Maybe not, but at least first render with startscreen)
game.render();
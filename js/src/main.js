define(["require", "exports", "field", "game"], function (require, exports, field_1, game_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var canvas = document.getElementById("canvas");
    var width = 250;
    var height = Math.round(window.innerHeight / window.innerWidth * width);
    var field = new field_1.default(canvas, width, height);
    var game = new game_1.default(field);
    field.toggleCell(new field_1.Position(10, 5));
    field.toggleCell(new field_1.Position(11, 5));
    field.toggleCell(new field_1.Position(12, 5));
    field.toggleCell(new field_1.Position(12, 4));
    field.toggleCell(new field_1.Position(11, 3));
    function canvasClick(event) {
        var pos = new field_1.Position(Math.floor(event.pageX / canvas.width * width), Math.floor(event.pageY / canvas.height * height));
        field.toggleCell(pos);
        game.population++;
        game.render();
    }
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        game.render();
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, false);
    canvas.addEventListener('click', canvasClick, false);
    var startStopButton = document.getElementById("startStopButton");
    var nextStepButton = document.getElementById("nextStepButton");
    var resetButton = document.getElementById("resetButton");
    var generationText = document.getElementById("generation");
    var populationText = document.getElementById("population");
    var speedSlider = document.getElementById("speedSlider");
    startStopButton.onclick = function () { return game.running = !game.running; };
    nextStepButton.onclick = function () { return game.next(); };
    resetButton.onclick = function () { return game.reset(); };
    speedSlider.oninput = function (ev) { return game.interval = parseInt(speedSlider.value); };
    game.onPopulationChange = function (pop) { return populationText.innerText = pop.toString(); };
    game.onGenerationChange = function (gen) { return generationText.innerText = gen.toString(); };
    game.onStateChange = function (run) { return startStopButton.innerHTML = '<i class="fa fa-' + (run ? 'pause' : 'play') + '" aria-hidden="true"></i>'; };
});
//# sourceMappingURL=main.js.map
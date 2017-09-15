define(["require", "exports", "field", "game"], function (require, exports, field_1, game_1) {
    "use strict";
    exports.__esModule = true;
    var canvas = document.getElementById("canvas");
    var width = 250;
    var height = Math.round(window.innerHeight / window.innerWidth * width);
    var field = new field_1["default"](canvas, width, height);
    var game = new game_1["default"](field);
    field.toggleCell(new field_1.Position(10, 5));
    field.toggleCell(new field_1.Position(11, 5));
    field.toggleCell(new field_1.Position(12, 5));
    field.toggleCell(new field_1.Position(12, 4));
    field.toggleCell(new field_1.Position(11, 3));
    var generationText = document.getElementById("generation");
    var populationText = document.getElementById("population");
    canvas.addEventListener('click', function (event) {
        var pos = new field_1.Position(Math.floor(event.pageX / canvas.width * width), Math.floor(event.pageY / canvas.height * height));
        field.toggleCell(pos);
        populationText.innerText = (parseInt(populationText.innerText) + 1).toString();
        game.render();
    }, false);
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        game.render();
    }
    window.addEventListener("resize", resizeCanvas, false);
    resizeCanvas();
    game.onStateChange(function (generation, population) {
        generationText.innerText = generation.toString();
        populationText.innerText = population.toString();
    });
    var startStopButton = document.getElementById("startStopButton");
    startStopButton.onclick = function () {
        if (game.isRunning()) {
            game.stop();
            startStopButton.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
        }
        else {
            game.start(50);
            startStopButton.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>';
        }
    };
    var nextStepButton = document.getElementById("nextStepButton");
    nextStepButton.onclick = function () {
        if (!game.isRunning()) {
            game.next();
        }
    };
    var resetButton = document.getElementById("resetButton");
    resetButton.onclick = function () {
        game.reset();
    };
});
//# sourceMappingURL=main.js.map
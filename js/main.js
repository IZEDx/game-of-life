define(["require", "exports", "field", "game", "lifeobject", "utils"], function (require, exports, field_1, game_1, lifeobject_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var canvas = document.getElementById("canvas");
    var width = 1000;
    var height = Math.round(window.innerHeight / window.innerWidth * width);
    var game = new game_1.default(canvas, width, height);
    var selectedObject = lifeobject_1.dot;
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        game.render();
    }
    function canvasClick(event) {
        var pos = game.field.mouseEventToPosition(event);
        game.field.toggleLifeObject(selectedObject, pos
            .add(-selectedObject.origin.x, -selectedObject.origin.y)
            .add(selectedObject.width / -2, selectedObject.height / -2));
        game.render();
    }
    function canvasMouseMove(event) {
        var pos = game.ghostField.mouseEventToPosition(event);
        game.ghostField.resetField();
        game.ghostField.setLifeObjectAlive(selectedObject, pos
            .add(-selectedObject.origin.x, -selectedObject.origin.y)
            .add(selectedObject.width / -2, selectedObject.height / -2));
        if (game.speed < 75 || !game.running)
            game.render();
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, false);
    canvas.addEventListener('click', canvasClick, false);
    canvas.addEventListener('mousemove', canvasMouseMove, false);
    var startStopButton = document.getElementById("startStopButton");
    var nextStepButton = document.getElementById("nextStepButton");
    var resetButton = document.getElementById("resetButton");
    var generationText = document.getElementById("generation");
    var populationText = document.getElementById("population");
    var speedSlider = document.getElementById("speedSlider");
    var spawnButtons = document.getElementsByClassName("btn-spawn");
    startStopButton.onclick = function () { return game.running = !game.running; };
    nextStepButton.onclick = function () { return game.next(); };
    resetButton.onclick = function () { return game.reset(); };
    speedSlider.oninput = function (ev) { return game.speed = parseInt(speedSlider.value); };
    var _loop_1 = function (i) {
        spawnButtons.item(i).onclick = function () {
            return utils_1.get(spawnButtons.item(i).getAttribute("ref")).then(function (str) {
                selectedObject = lifeobject_1.default.parseLife(str);
                game.ghostField.resetField();
                game.ghostField.setLifeObjectAlive(selectedObject, new field_1.Position(width / 2 - selectedObject.width / 2, height / 2 - selectedObject.height / 2)
                    .add(-selectedObject.origin.x, -selectedObject.origin.y));
                game.render();
            });
        };
    };
    for (var i = 0; i < spawnButtons.length; i++) {
        _loop_1(i);
    }
    game.onPopulationChange = function (pop) { return populationText.innerText = pop.toString(); };
    game.onGenerationChange = function (gen) { return generationText.innerText = gen.toString(); };
    game.onStateChange = function (run) { return startStopButton.innerHTML = '<i class="fa fa-' + (run ? 'pause' : 'play') + '" aria-hidden="true"></i>'; };
    utils_1.get("./assets/objects/startscreen.life").then(function (str) {
        var obj = lifeobject_1.default.parseLife(str);
        game.ghostField.resetField();
        game.ghostField.setLifeObjectAlive(obj, new field_1.Position(width / 2 - obj.width / 2, height / 2 - obj.height / 2)
            .add(-obj.origin.x, -obj.origin.y));
        game.field.setLifeObjectAlive(obj, new field_1.Position(width / 2 - obj.width / 2, height / 2 - obj.height / 2)
            .add(-obj.origin.x, -obj.origin.y));
        game.render();
    });
});
//# sourceMappingURL=main.js.map
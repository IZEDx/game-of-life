define(["require", "exports", "game", "utils", "jquery", "object-manager", "lifeobject"], function (require, exports, game_1, utils_1, $, object_manager_1, lifeobject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var width = 400;
    var height = utils_1.AspectRatio.heightFromWidth(width);
    var canvas = document.getElementById("canvas");
    var game = new game_1.default(canvas, width, height);
    var objectManager = new object_manager_1.default(canvas, game, "#objectList");
    window["gameOfLife"] = game;
    window["objectManager"] = objectManager;
    canvas.addEventListener('click', objectManager.canvasClick.bind(objectManager), false);
    canvas.addEventListener('mousemove', objectManager.canvasMouseMove.bind(objectManager), false);
    canvas.addEventListener('mousedown', objectManager.canvasMouseDown.bind(objectManager), false);
    canvas.addEventListener('mouseup', objectManager.canvasMouseUp.bind(objectManager), false);
    window.addEventListener('mouseup', objectManager.windowMouseUp.bind(objectManager), false);
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        game.render();
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, false);
    game.onPopulationChange = function (pop) { return $("#population").text(pop.toString()); };
    game.onGenerationChange = function (gen) { return $("#generation").text(gen.toString()); };
    game.onStateChange = function (run) { return $("#startStopButton").html("<i class=\"fa fa-" + (run ? "pause" : "play") + "\" aria-hidden=\"true\"></i>"); };
    $("#startStopButton").on("click", function () { return game.running = !game.running; });
    $("#nextStepButton").on("click", function () { return game.next(); });
    $("#resetButton").on("click", function () { return game.reset(); });
    $("#speedSlider").on("input", function () { game.speed = $(this).val(); });
    $("#singleDotButton").on("click", function () { return objectManager.switchTo(lifeobject_1.dot); });
    utils_1.checkForModals();
    utils_1.get("./dist/objects/startscreen.life").then(function (str) {
        var obj = lifeobject_1.default.parseLife(str);
        game.ghostField.resetField();
        game.ghostField.setLifeObjectAlive(obj, obj.centerPos(game.ghostField.getCenter()));
        game.field.setLifeObjectAlive(obj, obj.centerPos(game.ghostField.getCenter()));
        game.render();
    });
});
//# sourceMappingURL=main.js.map
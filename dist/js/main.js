define(["require", "exports", "game", "utils", "jquery", "object-manager"], function (require, exports, game_1, utils_1, $, object_manager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var width = 400;
    var height = Math.round(window.innerHeight / window.innerWidth * width);
    var canvas = document.getElementById("canvas");
    var game = new game_1.default(canvas, width, height);
    var objectManager = new object_manager_1.default(canvas, game, "#objectList");
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        game.render();
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, false);
    game.onPopulationChange = function (pop) { return $("#population").text(pop.toString()); };
    game.onGenerationChange = function (gen) { return $("#generation").text(gen.toString()); };
    game.onStateChange = function (run) { return $("#startStopButton").html("<i class=\"fa fa-" + (run ? 'pause' : 'play') + "\" aria-hidden=\"true\"></i>"); };
    $("#startStopButton").on("click", function () { return game.running = !game.running; });
    $("#nextStepButton").on("click", function () { return game.next(); });
    $("#resetButton").on("click", function () { return game.reset(); });
    $("#speedSlider").on("input", function () { game.speed = $(this).val(); });
    $("#singleDotButton").on("click", function () { return objectManager.switchTo("Dot"); });
    utils_1.checkForModals();
    utils_1.spawnStartscreen(game);
    window["gameOfLife"] = game;
    window["objectManager"] = objectManager;
});
//# sourceMappingURL=main.js.map
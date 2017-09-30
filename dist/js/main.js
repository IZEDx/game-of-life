define(["require", "exports", "game", "utils", "jquery", "object-manager", "lifeobject"], function (require, exports, game_1, utils_1, $, object_manager_1, lifeobject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var width = 400;
    var height = utils_1.AspectRatio.heightFromWidth(width);
    var canvas = document.getElementById("canvas");
    var game = new game_1.default(canvas, width, height);
    var objectManager = new object_manager_1.default(game, "#objectList");
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
    var el = {
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
    };
    game.onPopulationChange = function (pop) { return el.population.text(pop.toString()); };
    game.onGenerationChange = function (gen) { return el.generation.text(gen.toString()); };
    game.onStateChange = function (run) { return el.startStopButton.html("<i class=\"fa fa-" + (run ? "pause" : "play") + "\" aria-hidden=\"true\"></i>"); };
    el.startStopButton.on("click", function () { return game.running = !game.running; });
    el.nextStepButton.on("click", function () { return game.next(); });
    el.resetButton.on("click", function () { return game.reset(); });
    el.speedSlider.on("input", function () { game.speed = $(this).val(); });
    el.singleDotButton.on("click", function () { return objectManager.switchTo(lifeobject_1.dot); });
    el.importButton.on("click", function () {
        if (el.nameInput.val().toString() == "" || el.textInput.val().toString() == "")
            return alert("No field can be empty.");
        objectManager.importString(el.nameInput.val().toString(), el.textInput.val().toString());
        $("#addObjectModal").hide();
        $("#objectManagerModal").hide();
    });
    $(".modal").each(function () {
        var modal = $(this);
        modal.children(".content").children(".header").children(".modal-close").on("click", function () { return modal.hide(); });
    });
    $(".modal-toggle").each(function () {
        var btn = $(this);
        btn.on("click", function () {
            var hidden = $(btn.attr("ref")).css('display') == "none";
            $(".modal").each(function () {
                $(this).hide();
            });
            if (hidden) {
                $(btn.attr("ref")).show();
            }
            else {
                $(btn.attr("ref")).hide();
            }
        });
    });
    var startScreenCode = "\n************************************************\n..................................................\n.******...********...******...*******...********..\n**....**.....**.....**....**..**....**.....**.....\n**...........**.....**....**..**....**.....**.....\n.******......**.....********..*******......**.....\n......**.....**.....**....**..**....**.....**.....\n**....**.....**.....**....**..**....**.....**.....\n.******......**.....**....**..**....**.....**.....\n..................................................\n************************************************\n ";
    var startScreen = lifeobject_1.default.parseLife(startScreenCode);
    game.ghostField.resetField();
    game.ghostField.setLifeObjectAlive(startScreen, startScreen.centerPos(game.ghostField.getCenter()));
    game.field.setLifeObjectAlive(startScreen, startScreen.centerPos(game.ghostField.getCenter()));
    game.render();
});
//# sourceMappingURL=main.js.map
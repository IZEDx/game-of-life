define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var Game = (function () {
        function Game(field) {
            this.generation = 0;
            this.field = field;
        }
        Game.prototype.next = function () {
            var _this = this;
            this.generation++;
            var cellsToToggle = [];
            this.field.forEachAlive(function (pos) {
                var c = _this.field.countAliveNeighbours(pos);
                if (c < 2 || c > 3) {
                    cellsToToggle.push(pos);
                }
                _this.field.getNeighbours(pos).filter(function (nb) { return !_this.field.isAlive(nb); }).forEach(function (nb) {
                    var nbc = _this.field.countAliveNeighbours(nb);
                    if (nbc == 3)
                        cellsToToggle.push(nb);
                });
            });
            for (var _i = 0, cellsToToggle_1 = cellsToToggle; _i < cellsToToggle_1.length; _i++) {
                var pos = cellsToToggle_1[_i];
                this.field.toggleCell(pos);
            }
            this.render();
        };
        Game.prototype.render = function () {
            this.field.render();
        };
        Game.prototype.start = function (interval) {
            this.timer = setInterval(this.next.bind(this), interval);
            this.running = true;
        };
        Game.prototype.stop = function () {
            clearInterval(this.timer);
            this.running = false;
        };
        Game.prototype.isRunning = function () {
            return this.running;
        };
        Game.prototype.reset = function () {
            this.generation = 0;
            this.field.resetField();
            this.render();
        };
        return Game;
    }());
    exports["default"] = Game;
});
//# sourceMappingURL=game.js.map
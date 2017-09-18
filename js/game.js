define(["require", "exports", "field", "utils"], function (require, exports, field_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Game = (function () {
        function Game(canvas, width, height) {
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            this._survive = [2, 3];
            this._born = [3];
            this._generation = 0;
            this._population = 0;
            this._interval = 50;
            this._tickCounter = 0;
            this.onStateChange = utils_1.nop;
            this.onGenerationChange = utils_1.nop;
            this.onPopulationChange = utils_1.nop;
            this.onIntervalChange = utils_1.nop;
            this.onRuleChange = utils_1.nop;
            this._field = new field_1.default(canvas, width, height);
            this._ghostField = new field_1.default(canvas, width, height);
            this._ghostField.opacity = 0.5;
            this._ghostField.renderBackground = false;
            this._ghostField.cellColor = "#66ee66";
        }
        Object.defineProperty(Game.prototype, "rule", {
            get: function () {
                return this._survive.join() + "/" + this._born.join();
            },
            set: function (sbrule) {
                var res = /^(\d*)\/(\d*)$/g.exec(sbrule);
                if (res == null)
                    return;
                this._survive = res[1].split("").map(function (s) { return parseInt(s); });
                this._born = res[2].split("").map(function (s) { return parseInt(s); });
                this.onRuleChange(sbrule);
            },
            enumerable: true,
            configurable: true
        });
        Game.prototype.tick = function () {
            this._tickCounter++;
            if (this._tickCounter % (Math.round(100 / Math.sqrt(this._interval)) - 9) == 0) {
                this.next();
            }
        };
        Object.defineProperty(Game.prototype, "running", {
            get: function () {
                return this._running;
            },
            set: function (run) {
                this._running = run;
                this.onStateChange(run);
                if (run) {
                    this._tickCounter = 0;
                    this._timer = setInterval(this.tick.bind(this), 10);
                }
                else {
                    clearInterval(this._timer);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "generation", {
            get: function () {
                return this._generation;
            },
            set: function (gen) {
                this._generation = gen;
                this.onGenerationChange(gen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "population", {
            get: function () {
                return this._population;
            },
            set: function (pop) {
                this._population = pop;
                this.onPopulationChange(pop);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "interval", {
            get: function () {
                return this._interval;
            },
            set: function (interval) {
                this._interval = interval;
                this.onIntervalChange(interval);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "field", {
            get: function () {
                return this._field;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "ghostField", {
            get: function () {
                return this._ghostField;
            },
            enumerable: true,
            configurable: true
        });
        Game.prototype.invertRule = function () {
            var survive = [];
            var born = [];
            for (var i = 0; i <= 8; i++) {
                if (this._survive.indexOf(i) < 0)
                    survive.push(i);
                if (this._born.indexOf(i) < 0)
                    born.push(i);
            }
            this._survive = survive;
            this._born = born;
            this.onRuleChange(this._survive.join("") + "/" + this._born.join(""));
        };
        Game.prototype.next = function () {
            var _this = this;
            var cellsToToggle = [];
            var pop = 0;
            this._field.forEachAlive(function (pos) {
                var c = _this._field.countAliveNeighbours(pos);
                pop++;
                if (_this._survive.indexOf(c) == -1)
                    cellsToToggle.push(pos);
                _this._field.getNeighbours(pos).filter(function (nb) { return !_this._field.isAlive(nb); }).forEach(function (nb) {
                    var nbc = _this._field.countAliveNeighbours(nb);
                    if (_this._born.indexOf(nbc) != -1)
                        cellsToToggle.push(nb);
                });
            });
            for (var _i = 0, cellsToToggle_1 = cellsToToggle; _i < cellsToToggle_1.length; _i++) {
                var pos = cellsToToggle_1[_i];
                this._field.toggleCell(pos);
            }
            this.generation++;
            this.population = pop;
            this.render();
        };
        Game.prototype.render = function () {
            this._field.render();
            this._ghostField.render();
        };
        Game.prototype.reset = function () {
            this.generation = 0;
            this.population = 0;
            this._field.resetField();
            this.running = false;
            this.render();
        };
        return Game;
    }());
    exports.default = Game;
});
//# sourceMappingURL=game.js.map
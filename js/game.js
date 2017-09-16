define(["require", "exports", "utils"], function (require, exports, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Game = (function () {
        function Game(field) {
            this._survive = [2, 3];
            this._born = [3];
            this._generation = 0;
            this._population = 0;
            this._interval = 50;
            this.onStateChange = utils_1.nop;
            this.onGenerationChange = utils_1.nop;
            this.onPopulationChange = utils_1.nop;
            this.onIntervalChange = utils_1.nop;
            this.onRuleChange = utils_1.nop;
            this._field = field;
        }
        Object.defineProperty(Game.prototype, "rule", {
            get: function () {
                return this._survive.join() + "/" + this._born.join();
            },
            set: function (sbrule) {
                if (/^\d*\/\d*$/g.test(sbrule)) {
                    var parts = sbrule.split("/");
                    this._survive = parts[0].split("").map(function (s) { return parseInt(s); });
                    this._born = parts[1].split("").map(function (s) { return parseInt(s); });
                    this.onRuleChange(sbrule);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "running", {
            get: function () {
                return this._running;
            },
            set: function (run) {
                this._running = run;
                this.onStateChange(run);
                if (run) {
                    this._timer = setInterval(this.next.bind(this), this._interval);
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
                if (this._running) {
                    clearInterval(this._timer);
                    this._timer = setInterval(this.next.bind(this), this._interval);
                }
                this.onIntervalChange(interval);
            },
            enumerable: true,
            configurable: true
        });
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
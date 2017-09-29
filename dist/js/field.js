define(["require", "exports", "utils"], function (require, exports, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Field = (function () {
        function Field(canvas, width, height) {
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            this.renderBackground = true;
            this.backgroundColor = "#000000";
            this.cellColor = "#FFFFFF";
            this.opacity = 1.0;
            this.canvas = canvas;
            this.ctx = canvas.getContext("2d");
            this.setSize(width, height);
        }
        Field.prototype.setSize = function (width, height) {
            this.width = width;
            this.height = height;
            this.resetField();
        };
        Field.prototype.resetField = function () {
            this.field = [];
            for (var x = 0; x < this.width; x++) {
                this.field[x] = [];
                for (var y = 0; y < this.height; y++) {
                    this.field[x][y] = false;
                }
            }
        };
        Field.prototype.setAlive = function (pos, alive) {
            if (alive === void 0) { alive = true; }
            pos = pos.fitToBorders(this.width, this.height);
            this.field[pos.x][pos.y] = alive;
        };
        Field.prototype.isAlive = function (pos) {
            pos = pos.fitToBorders(this.width, this.height);
            return this.field[pos.x][pos.y];
        };
        Field.prototype.toggleCell = function (pos) {
            this.setAlive(pos, !this.isAlive(pos));
        };
        Field.prototype.setLifeObjectAlive = function (obj, pos, alive) {
            if (alive === void 0) { alive = true; }
            for (var _i = 0, _a = obj.aliveCells; _i < _a.length; _i++) {
                var target = _a[_i];
                this.setAlive(pos.add(target), alive);
            }
        };
        Field.prototype.toggleLifeObject = function (obj, pos) {
            for (var _i = 0, _a = obj.aliveCells; _i < _a.length; _i++) {
                var target = _a[_i];
                this.toggleCell(pos.add(target));
            }
        };
        Field.prototype.getNeighbours = function (pos) {
            var _this = this;
            return [
                new utils_1.Vector(pos.x - 1, pos.y - 1),
                new utils_1.Vector(pos.x, pos.y - 1),
                new utils_1.Vector(pos.x + 1, pos.y - 1),
                new utils_1.Vector(pos.x - 1, pos.y),
                new utils_1.Vector(pos.x + 1, pos.y),
                new utils_1.Vector(pos.x - 1, pos.y + 1),
                new utils_1.Vector(pos.x, pos.y + 1),
                new utils_1.Vector(pos.x + 1, pos.y + 1),
            ].map(function (p) { return p.fitToBorders(_this.width, _this.height); });
        };
        Field.prototype.countAliveNeighbours = function (pos) {
            var _this = this;
            return this.getNeighbours(pos).filter(function (pos) { return _this.isAlive(pos); }).length;
        };
        Field.prototype.forEachAlive = function (cb) {
            for (var x = 0; x < this.width; x++)
                for (var y = 0; y < this.height; y++)
                    if (this.field[x][y])
                        cb(new utils_1.Vector(x, y));
        };
        Field.prototype.render = function () {
            var _this = this;
            var ga = this.ctx.globalAlpha;
            this.ctx.globalAlpha = this.opacity;
            if (this.renderBackground) {
                this.ctx.fillStyle = this.backgroundColor;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            }
            var cw = this.canvas.width / this.width;
            var ch = this.canvas.height / this.height;
            this.ctx.beginPath();
            this.forEachAlive(function (pos) {
                _this.ctx.rect(pos.x * cw, pos.y * ch, cw, ch);
            });
            this.ctx.fillStyle = this.cellColor;
            this.ctx.fill();
            this.ctx.globalAlpha = ga;
        };
        Field.prototype.mouseEventToPosition = function (event) {
            return new utils_1.Vector(Math.floor(event.pageX / this.canvas.width * this.width), Math.floor(event.pageY / this.canvas.height * this.height));
        };
        Field.prototype.getCenter = function () {
            return new utils_1.Vector(this.width / 2, this.height / 2).ceil();
        };
        return Field;
    }());
    exports.default = Field;
});
//# sourceMappingURL=field.js.map
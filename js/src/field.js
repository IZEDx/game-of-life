define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Position = (function () {
        function Position(x, y) {
            this.x = x;
            this.y = y;
        }
        Position.prototype.fitToBorders = function (width, height) {
            if (this.x >= width)
                this.x = this.x % width;
            else if (this.x < 0)
                this.x = width - (this.x * -1 % width);
            if (this.y >= height)
                this.y = this.y % height;
            else if (this.y < 0)
                this.y = height - (this.y * -1 % height);
            this.x = Math.ceil(this.x);
            this.y = Math.ceil(this.y);
            return this;
        };
        return Position;
    }());
    exports.Position = Position;
    var Field = (function () {
        function Field(canvas, width, height) {
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
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
        Field.prototype.setAlive = function (pos, alive, sanitize) {
            if (sanitize === void 0) { sanitize = true; }
            if (sanitize)
                pos.fitToBorders(this.width, this.height);
            this.field[pos.x][pos.y] = alive;
        };
        Field.prototype.isAlive = function (pos, sanitize) {
            if (sanitize === void 0) { sanitize = true; }
            if (sanitize)
                pos.fitToBorders(this.width, this.height);
            return this.field[pos.x][pos.y];
        };
        Field.prototype.toggleCell = function (pos) {
            pos.fitToBorders(this.width, this.height);
            this.setAlive(pos, !this.isAlive(pos));
        };
        Field.prototype.getNeighbours = function (pos) {
            var _this = this;
            return [
                new Position(pos.x - 1, pos.y - 1),
                new Position(pos.x, pos.y - 1),
                new Position(pos.x + 1, pos.y - 1),
                new Position(pos.x - 1, pos.y),
                new Position(pos.x + 1, pos.y),
                new Position(pos.x - 1, pos.y + 1),
                new Position(pos.x, pos.y + 1),
                new Position(pos.x + 1, pos.y + 1),
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
                        cb(new Position(x, y));
        };
        Field.prototype.render = function () {
            var _this = this;
            this.ctx.fillStyle = "#000000";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            var cw = this.canvas.width / this.width;
            var ch = this.canvas.height / this.height;
            this.ctx.beginPath();
            this.forEachAlive(function (pos) {
                _this.ctx.rect(pos.x * cw, pos.y * ch, cw, ch);
            });
            this.ctx.fillStyle = "#AACBAB";
            this.ctx.fill();
        };
        return Field;
    }());
    exports.default = Field;
});
//# sourceMappingURL=field.js.map
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
        Position.prototype.add = function (x, y) {
            this.x += x;
            this.y += y;
            return this;
        };
        return Position;
    }());
    exports.Position = Position;
});
//# sourceMappingURL=position.js.map
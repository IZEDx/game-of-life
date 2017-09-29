var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "utils"], function (require, exports, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LifeObject = (function (_super) {
        __extends(LifeObject, _super);
        function LifeObject(aliveCells) {
            var _this = _super.call(this, 0, 0, 0, 0) || this;
            _this._aliveCells = [];
            var minPoint = new utils_1.Vector(999, 999);
            var maxPoint = new utils_1.Vector(0, 0);
            for (var _i = 0, aliveCells_1 = aliveCells; _i < aliveCells_1.length; _i++) {
                var pos = aliveCells_1[_i];
                if (pos.x < minPoint.x)
                    minPoint.x = pos.x;
                if (pos.x > maxPoint.x)
                    maxPoint.x = pos.x;
                if (pos.y < minPoint.y)
                    minPoint.y = pos.y;
                if (pos.y > maxPoint.y)
                    maxPoint.y = pos.y;
                _this._aliveCells.push(new utils_1.Vector(pos.x, pos.y));
            }
            _this.start = minPoint;
            _this.end = maxPoint;
            return _this;
        }
        Object.defineProperty(LifeObject.prototype, "aliveCells", {
            get: function () { return this._aliveCells; },
            enumerable: true,
            configurable: true
        });
        LifeObject.prototype.centerPos = function (pos) {
            return pos.sub(this.start).add(this.width / -2, this.height / -2);
        };
        LifeObject.prototype.serialize = function () {
            return this._aliveCells.map(function (pos) { return pos.serialize(); });
        };
        LifeObject.parseLife105 = function (lifeString) {
            var aliveCells = [];
            var y = 0;
            var origin = new utils_1.Vector(0, 0);
            for (var _i = 0, _a = lifeString.split("\n"); _i < _a.length; _i++) {
                var line = _a[_i];
                var res = line.match(/#P\s+(-?\d+)\s+(-?\d+)/);
                if (res != null) {
                    y = 0;
                    origin = new utils_1.Vector(parseInt(res[1]), parseInt(res[2]));
                }
                if (line.substr(0, 1) == "#")
                    continue;
                var x = 0;
                for (var _b = 0, _c = line.split(""); _b < _c.length; _b++) {
                    var char = _c[_b];
                    if (char == "*")
                        aliveCells.push(new utils_1.Vector(origin.x + x, origin.y + y));
                    x++;
                }
                y++;
            }
            return new LifeObject(aliveCells);
        };
        LifeObject.parseLife106 = function (lifeString) {
            var aliveCells = [];
            for (var _i = 0, _a = lifeString.split("\n"); _i < _a.length; _i++) {
                var line = _a[_i];
                if (line.substr(0, 1) == "#")
                    continue;
                var res = line.match(/^(\d+)\s+(\d+)$/);
                if (res == null)
                    continue;
                aliveCells.push(new utils_1.Vector(parseInt(res[1]), parseInt(res[2])));
            }
            return new LifeObject(aliveCells);
        };
        LifeObject.parseLife = function (lifeString) {
            if (lifeString.indexOf("#Life 1.06") == 0)
                return LifeObject.parseLife106(lifeString);
            return LifeObject.parseLife105(lifeString);
        };
        return LifeObject;
    }(utils_1.Area));
    exports.default = LifeObject;
    exports.dot = new LifeObject([new utils_1.Vector(0, 0)]);
});
//# sourceMappingURL=lifeobject.js.map
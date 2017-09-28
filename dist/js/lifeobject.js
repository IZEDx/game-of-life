define(["require", "exports", "field"], function (require, exports, field_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LifeObject = (function () {
        function LifeObject(aliveCells) {
            this._aliveCells = [];
            this._width = 0;
            this._height = 0;
            this._origin = new field_1.Position(0, 0);
            var minPoint = new field_1.Position(999, 999);
            var maxPoint = new field_1.Position(0, 0);
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
                this._aliveCells.push(new field_1.Position(pos.x, pos.y));
            }
            this._width = maxPoint.x - minPoint.x;
            this._height = maxPoint.y - minPoint.y;
            this._origin = minPoint;
        }
        Object.defineProperty(LifeObject.prototype, "aliveCells", {
            get: function () { return this._aliveCells; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LifeObject.prototype, "width", {
            get: function () { return this._width; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LifeObject.prototype, "height", {
            get: function () { return this._height; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LifeObject.prototype, "origin", {
            get: function () { return this._origin; },
            enumerable: true,
            configurable: true
        });
        LifeObject.prototype.save = function (name) {
            window.localStorage.setItem(name, JSON.stringify(this._aliveCells));
        };
        LifeObject.prototype.centerPos = function (pos) {
            return pos.sub(this.origin).add(this.width / -2, this.height / -2);
        };
        LifeObject.load = function (name) {
            var ps = JSON.parse(window.localStorage.getItem(name));
            if (ps == null)
                throw new Error("LifeObject \"" + name + "\" not found.");
            return new LifeObject(ps.map(function (p) { return new field_1.Position(p.x, p.y); }));
        };
        LifeObject.allSavedObjects = function () {
            var os = [];
            for (var i = 0; i < window.localStorage.length; i++)
                os.push(window.localStorage.key(i));
            return os;
        };
        LifeObject.parseLife105 = function (lifeString) {
            var aliveCells = [];
            var y = 0;
            var origin = new field_1.Position(0, 0);
            for (var _i = 0, _a = lifeString.split(/[\r\n]+/g); _i < _a.length; _i++) {
                var line = _a[_i];
                var res = line.match(/^#P\s+(-?\d+)\s+(-?\d+)\s+$/);
                if (res != null) {
                    y = 0;
                    origin = new field_1.Position(parseInt(res[1]), parseInt(res[2]));
                }
                if (line.substr(0, 1) == "#")
                    continue;
                var x = 0;
                for (var _b = 0, _c = line.split(""); _b < _c.length; _b++) {
                    var char = _c[_b];
                    if (char == "*")
                        aliveCells.push(new field_1.Position(origin.x + x, origin.y + y));
                    x++;
                }
                y++;
            }
            return new LifeObject(aliveCells);
        };
        LifeObject.parseLife106 = function (lifeString) {
            var aliveCells = [];
            for (var _i = 0, _a = lifeString.split(/[\r\n]+/g); _i < _a.length; _i++) {
                var line = _a[_i];
                if (line.substr(0, 1) == "#")
                    continue;
                var res = line.match(/^(\d+)\s+(\d+)$/);
                if (res == null)
                    continue;
                aliveCells.push(new field_1.Position(parseInt(res[1]), parseInt(res[2])));
            }
            return new LifeObject(aliveCells);
        };
        LifeObject.parseLife = function (lifeString) {
            if (lifeString.indexOf("#Life 1.06") == 0)
                return LifeObject.parseLife106(lifeString);
            return LifeObject.parseLife105(lifeString);
        };
        return LifeObject;
    }());
    exports.default = LifeObject;
    exports.dot = new LifeObject([new field_1.Position(0, 0)]);
});
//# sourceMappingURL=lifeobject.js.map
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function nop() { }
    exports.nop = nop;
    function get(url) {
        return new Promise(function (resolve) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                    resolve(xmlHttp.responseText);
            };
            xmlHttp.open("GET", url, true);
            xmlHttp.send(null);
        });
    }
    exports.get = get;
    function checkForModals() {
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
    }
    exports.checkForModals = checkForModals;
    var AspectRatio = (function () {
        function AspectRatio() {
        }
        AspectRatio.heightFromWidth = function (width) {
            return Math.round(window.innerHeight / window.innerWidth * width);
        };
        AspectRatio.widthFromHeight = function (height) {
            return Math.round(window.innerWidth / window.innerHeight * height);
        };
        return AspectRatio;
    }());
    exports.AspectRatio = AspectRatio;
    var Vector = (function () {
        function Vector(x, y) {
            this.x = x;
            this.y = y;
        }
        Vector.prototype.serialize = function () {
            return {
                x: this.x,
                y: this.y
            };
        };
        Vector.prototype.fitToBorders = function (width, height) {
            var x = Math.ceil(this.x);
            var y = Math.ceil(this.y);
            if (x >= width)
                x = x % width;
            else if (x < 0)
                x = width - (x * -1 % width);
            if (y >= height)
                y = y % height;
            else if (y < 0)
                y = height - (y * -1 % height);
            return new Vector(x, y);
        };
        Vector.prototype.add = function (xOrVec, y) {
            if (typeof xOrVec == "number" && y != null) {
                return new Vector(this.x + xOrVec, this.y + y);
            }
            else if (xOrVec instanceof Vector) {
                return new Vector(this.x + xOrVec.x, this.y + xOrVec.y);
            }
            else {
                return this;
            }
        };
        Vector.prototype.mul = function (fac) {
            return new Vector(this.x * fac, this.y * fac);
        };
        Vector.prototype.sub = function (vec) {
            return this.add(vec.mul(-1));
        };
        Vector.prototype.ceil = function () {
            return new Vector(Math.ceil(this.x), Math.ceil(this.y));
        };
        return Vector;
    }());
    exports.Vector = Vector;
    var Area = (function () {
        function Area(v1, v2, v3, v4) {
            if (typeof v1 != "number" && typeof v2 != "number") {
                this._start = v1;
                this._end = v2;
            }
            else if (typeof v1 != "number" && typeof v2 == "number") {
                this._start = v1;
                this._end = new Vector(v2, v3);
            }
            else if (typeof v1 == "number" && typeof v2 == "number" && typeof v3 == "number" && typeof v4 == "number") {
                this._start = new Vector(v1, v2);
                this._end = new Vector(v3, v4);
            }
            this.calculateSize();
        }
        Object.defineProperty(Area.prototype, "start", {
            get: function () { return this._start; },
            set: function (pos) {
                this._start = pos;
                this.calculateSize();
            },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(Area.prototype, "end", {
            get: function () { return this._end; },
            set: function (pos) {
                this._end = pos;
                this.calculateSize();
            },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(Area.prototype, "width", {
            get: function () { return this._width; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(Area.prototype, "height", {
            get: function () { return this._height; },
            enumerable: true,
            configurable: true
        });
        ;
        Area.prototype.serialize = function () {
            return {
                start: this._start.serialize(),
                end: this._end.serialize(),
                width: this.width,
                height: this.height
            };
        };
        Area.prototype.calculateSize = function () {
            this._width = Math.sqrt(Math.pow(this._start.x - this._end.x, 2));
            this._height = Math.sqrt(Math.pow(this._start.y - this._end.y, 2));
        };
        Area.prototype.fitToBorders = function (width, height) {
            this._start.fitToBorders(width, height);
            this._end.fitToBorders(width, height);
            return this;
        };
        Area.prototype.forEachPos = function (fn) {
            for (var y = this._start.y; y <= this._end.y; y++) {
                for (var x = this._start.x; x <= this._end.y; x++) {
                    fn(new Vector(x, y));
                }
            }
        };
        return Area;
    }());
    exports.Area = Area;
});
//# sourceMappingURL=utils.js.map
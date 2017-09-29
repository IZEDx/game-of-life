var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "jquery", "lifeobject", "utils", "field"], function (require, exports, $, lifeobject_1, utils_1, field_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ObjectManager = (function () {
        function ObjectManager(canvas, game, listElementSelector) {
            this.selectedObject = lifeobject_1.dot;
            this.drawMode = false;
            this.canvas = canvas;
            this.game = game;
            this.listElement = $(listElementSelector);
            this.reloadButtons();
            this.importObject("Dot", lifeobject_1.dot);
        }
        ObjectManager.prototype.reloadButtons = function () {
            var _this = this;
            ObjectManager.allSavedObjects()
                .filter(function (name) { return _this.listElement.children("[ref=\"" + name + "\"]").length == 0; })
                .forEach(function (name) {
                _this.listElement.append("<button class=\"btn object\" ref=\"" + name + "\"><canvas class=\"preview\"></canvas>" + name + "</button>");
            });
            var mgr = this;
            this.listElement.children().on("click", function () { mgr.switchTo($(this).attr('ref')); });
            this.listElement.children().each(function () {
                var btn = $(this);
                var obj = ObjectManager.loadFromStorage(btn.attr("ref"));
                var canvas = btn.children(".preview").get(0);
                console.log(obj.width, obj.height);
                var field = new field_1.default(canvas, obj.width, obj.height);
                field.toggleLifeObject(obj, obj.start);
                field.renderBackground = false;
                field.render();
            });
        };
        ObjectManager.prototype.canvasClick = function (event) {
        };
        ObjectManager.prototype.canvasMouseDown = function (event) {
            if (this.selectedObject == lifeobject_1.dot || true) {
                this.drawMode = true;
            }
            var pos = this.game.field.mouseEventToPosition(event);
            this.game.field.toggleLifeObject(this.selectedObject, this.selectedObject.centerPos(pos));
            this.game.ghostField.resetField();
            this.game.render();
        };
        ObjectManager.prototype.canvasMouseUp = function (event) {
            this.drawMode = false;
        };
        ObjectManager.prototype.windowMouseUp = function (event) {
            this.canvasMouseUp(event);
        };
        ObjectManager.prototype.canvasMouseMove = function (event) {
            if (this.drawMode) {
                var pos = this.game.field.mouseEventToPosition(event);
                this.game.field.setLifeObjectAlive(this.selectedObject, this.selectedObject.centerPos(pos));
                this.game.render();
            }
            else {
                var pos = this.game.ghostField.mouseEventToPosition(event);
                this.game.ghostField.resetField();
                this.game.ghostField.setLifeObjectAlive(this.selectedObject, this.selectedObject.centerPos(pos));
                if (this.game.speed < 75 || !this.game.running)
                    this.game.render();
            }
        };
        ObjectManager.prototype.switchTo = function (lifeobject) {
            this.selectedObject = lifeobject instanceof lifeobject_1.default ? lifeobject : ObjectManager.loadFromStorage(lifeobject);
            this.game.ghostField.resetField();
            this.game.render();
        };
        ObjectManager.allSavedObjects = function () {
            var os = [];
            for (var i = 0; i < window.localStorage.length; i++)
                os.push(window.localStorage.key(i));
            return os;
        };
        ObjectManager.saveToStorage = function (name, obj) {
            window.localStorage.setItem(name, JSON.stringify(obj.serialize()));
        };
        ObjectManager.loadFromStorage = function (name) {
            var ps = JSON.parse(window.localStorage.getItem(name));
            if (ps == null)
                throw new Error("LifeObject \"" + name + "\" not found in storage.");
            return new lifeobject_1.default(ps.map(function (p) { return new utils_1.Vector(p.x, p.y); }));
        };
        ObjectManager.prototype.importObject = function (name, obj) {
            ObjectManager.saveToStorage(name, obj);
            this.reloadButtons();
        };
        ObjectManager.prototype.importFile = function (name, file) {
            return __awaiter(this, void 0, void 0, function () { var _a, _b, _c, _d; return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = this.importObject;
                        _b = [name];
                        _d = (_c = lifeobject_1.default).parseLife;
                        return [4, utils_1.get(file)];
                    case 1:
                        _a.apply(this, _b.concat([_d.apply(_c, [_e.sent()])]));
                        return [2];
                }
            }); });
        };
        ObjectManager.prototype.importString = function (name, data) { this.importObject(name, lifeobject_1.default.parseLife(data)); };
        ObjectManager.prototype.importArray = function (name, data) { this.importObject(name, new lifeobject_1.default(data)); };
        return ObjectManager;
    }());
    exports.default = ObjectManager;
});
//# sourceMappingURL=object-manager.js.map
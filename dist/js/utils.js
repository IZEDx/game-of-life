define(["require", "exports", "lifeobject"], function (require, exports, lifeobject_1) {
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
    function spawnStartscreen(game) {
        get("./dist/objects/startscreen.life").then(function (str) {
            var obj = lifeobject_1.default.parseLife(str);
            game.ghostField.resetField();
            game.ghostField.setLifeObjectAlive(obj, obj.centerPos(game.ghostField.getCenter()));
            game.field.setLifeObjectAlive(obj, obj.centerPos(game.ghostField.getCenter()));
            game.render();
        });
    }
    exports.spawnStartscreen = spawnStartscreen;
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
});
//# sourceMappingURL=utils.js.map
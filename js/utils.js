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
    function getByClass(str) {
    }
    exports.getByClass = getByClass;
});
//# sourceMappingURL=utils.js.map
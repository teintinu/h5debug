"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@hoda5/extensions");
exports.h5debug = {};
function enableDebug(name, opts) {
    var history = [];
    var m = {
        history: function () {
            return history;
        },
    };
    exports.h5debug[name] = m.mergeObjWith(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (opts && opts.handler) {
            if (opts.handler.apply(opts, args) === false)
                return;
        }
        if (!(opts && opts.disableHistory)) {
            history.push(args
                .map(function (a) { return typeof a === "string" ? a : JSON.stringify(a); })
                .join(""));
        }
        // tslint:disable-next-line:no-console
        if (!(opts && opts.disbleConsole))
            console.log.apply(console, [name].concat(args));
    });
}
exports.enableDebug = enableDebug;
function disableDebug(name) {
    delete exports.h5debug[name];
}
exports.disableDebug = disableDebug;
//# sourceMappingURL=h5debug.js.map
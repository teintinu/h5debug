"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
require("@hoda5/extensions");
exports.h5debug = {};
function enableDebug(name, opts) {
    if (!name)
        throw new Error("Invalid name");
    var history = [];
    var m = {
        clearHistory: function () {
            history = [];
        },
        history: function () {
            return history;
        },
    };
    exports.h5debug[name] = h5lib.mergeObjWith(m, function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (opts && opts.handler) {
            if (opts.handler.apply(opts, args) === false)
                return;
        }
        if (!(opts && opts.disableHistory)) {
            history.push(args.map(function (a) {
                return typeof a === "string" ?
                    a.replace(/"/g, "\uFF02")
                    : JSON.stringify(a, function (k, v) { return typeof v === "string" ? v.replace(/"/g, "\uFF02") : v; })
                        .replace(/"/g, "\uFF02");
            }).join(""));
        }
        // tslint:disable-next-line:no-console
        if (!(opts && opts.disableConsole))
            console.log.apply(console, tslib_1.__spreadArrays([name], args));
    });
}
exports.enableDebug = enableDebug;
function disableDebug(name) {
    delete exports.h5debug[name];
}
exports.disableDebug = disableDebug;
function compareHistory(history, expect) {
    var ih = 0;
    var ie = 0;
    var matches = [];
    while (ih < history.length && ie < expect.length) {
        if (match())
            ie++;
        ih++;
    }
    if (ie < expect.length || ih === 0) {
        if (history.length === 0)
            matches.push("=>NO HISTORY");
        if (expect.length === 0)
            matches.push("=>NO EXPECT");
        else {
            matches.push(["=>not matches: ",
                expect.slice(ie).map(function (e) { return e.toString(); }).join("|"),
            ].join(""));
        }
        return matches;
    }
    return "OK";
    function match() {
        var h = history[ih].replace(/"/g, "\uFF02");
        var e = expect[ie];
        var sr = "";
        if (typeof e === "string") {
            var r1 = h.indexOf(e.replace(/"/g, "\uFF02")) >= 0;
            if (r1)
                sr = e;
        }
        else {
            var nr = new RegExp(e.source.replace(/"/g, "\uFF02"), e.flags);
            if (nr.test(h))
                sr = e.toString();
        }
        if (!sr) {
            matches.push("=>(SKIP) " + h);
            return false;
        }
        var m = ["=>(OK:", sr, ") ", h];
        matches.push(m.join(""));
        return true;
    }
}
exports.compareHistory = compareHistory;
//# sourceMappingURL=h5debug.js.map
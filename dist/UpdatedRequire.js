"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Module = require("module");
var watcher_require_1 = require("watcher-require");
var UpdatedRequire = (function (_super) {
    __extends(UpdatedRequire, _super);
    function UpdatedRequire(notifyCallback, options) {
        var _this = this;
        if (!options) {
            options = {};
        }
        if (!options.methods) {
            options.methods = {
                add: false,
                change: true,
                unlink: false
            };
        }
        _super.call(this, function (changes) {
            var modlist = [];
            if (changes.add) {
                for (var _i = 0, _a = changes.add; _i < _a.length; _i++) {
                    var mod = _a[_i];
                    var wholist = mod.__whoRequired();
                    for (var _b = 0, wholist_1 = wholist; _b < wholist_1.length; _b++) {
                        var who = wholist_1[_b];
                        if (modlist.indexOf(who) < 0) {
                            modlist.push(who);
                        }
                    }
                }
            }
            if (changes.change) {
                for (var _c = 0, _d = changes.change; _c < _d.length; _c++) {
                    var mod = _d[_c];
                    var wholist = mod.__whoRequired();
                    for (var _e = 0, wholist_2 = wholist; _e < wholist_2.length; _e++) {
                        var who = wholist_2[_e];
                        if (modlist.indexOf(who) < 0) {
                            modlist.push(who);
                        }
                    }
                }
            }
            if (changes.unlink) {
                for (var _f = 0, _g = changes.unlink; _f < _g.length; _f++) {
                    var mod = _g[_f];
                    var wholist = mod.__whoRequired();
                    for (var _h = 0, wholist_3 = wholist; _h < wholist_3.length; _h++) {
                        var who = wholist_3[_h];
                        if (modlist.indexOf(who) < 0) {
                            modlist.push(who);
                        }
                    }
                }
            }
            for (var _j = 0, modlist_1 = modlist; _j < modlist_1.length; _j++) {
                var mod = modlist_1[_j];
                _this.unrequire(mod, null, true);
                _this.requireNotify(mod);
            }
        }, options);
        this._notifyCallback = notifyCallback;
        this._updatedTimeouts = {};
    }
    UpdatedRequire.prototype.requireNotify = function (mod) {
        var _this = this;
        clearTimeout(this._updatedTimeouts[mod.filename]);
        this.require(mod.filename);
        var newmod = this.getCachedModule(mod.filename, module);
        if (!newmod.__checkInvalid()) {
            if (this._notifyCallback) {
                this._notifyCallback(mod, newmod);
            }
        }
        else {
            this._updatedTimeouts[mod.filename] = setTimeout(function () { return _this.requireNotify(mod); }, 1000);
        }
    };
    return UpdatedRequire;
}(watcher_require_1.WatcherRequire));
exports.UpdatedRequire = UpdatedRequire;
//# sourceMappingURL=UpdatedRequire.js.map
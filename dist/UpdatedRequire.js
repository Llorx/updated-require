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
                modlist = modlist.concat(changes.add);
            }
            if (changes.change) {
                modlist = modlist.concat(changes.change);
            }
            if (changes.unlink) {
                modlist = modlist.concat(changes.unlink);
            }
            var unrequired = [];
            for (var _i = 0, modlist_1 = modlist; _i < modlist_1.length; _i++) {
                var mod = modlist_1[_i];
                mod.__invalidate();
                var wholist = mod.__whoRequired();
                for (var _a = 0, wholist_1 = wholist; _a < wholist_1.length; _a++) {
                    var who = wholist_1[_a];
                    if (unrequired.indexOf(who) < 0) {
                        unrequired.push(who);
                        _this.unrequire(who);
                        _this.requireNotify(who);
                    }
                }
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
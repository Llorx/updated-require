var Module = require("module");
import { WatcherRequire, WatcherOptions, CustomNodeModule } from "watcher-require";

export class UpdatedRequire extends WatcherRequire {
    _notifyCallback:(oldmodule:CustomNodeModule, newmodule:CustomNodeModule)=>void;
    _updatedTimeouts:any;
    constructor(notifyCallback?:(oldmodule:CustomNodeModule, newmodule:CustomNodeModule)=>void, options?:WatcherOptions) {
        if (!options) {
            options = {};
        }
        if (!options.methods) {
            options.methods = {
                add: false,
                change: true,
                unlink: false
            }
        }
        super((changes) => {
            let modlist:CustomNodeModule[] = [];
            if (changes.add) {
                modlist = modlist.concat(changes.add);
            }
            if (changes.change) {
                modlist = modlist.concat(changes.change);
            }
            if (changes.unlink) {
                modlist = modlist.concat(changes.unlink);
            }
            var unrequired:CustomNodeModule[] = [];
            for (let mod of modlist) {
                let invalidated = mod.__invalidate();
                for (let who of invalidated) {
                    if (unrequired.indexOf(who) < 0 && who.__customRequires.indexOf(this) > -1) {
                        unrequired.push(who);
                        this.unrequire(who);
                        this.requireNotify(who);
                    }
                }
            }
        }, options);
        this._notifyCallback = notifyCallback;
        this._updatedTimeouts = {};
    }
    requireNotify(mod:CustomNodeModule) {
        clearTimeout(this._updatedTimeouts[mod.filename]);
        this.require(mod.filename);
        var newmod = this.getCachedModule(mod.filename, module);
        if (!newmod.__isInvalid()) {
            if (this._notifyCallback) {
                this._notifyCallback(mod, newmod);
            }
        } else {
            this._updatedTimeouts[mod.filename] = setTimeout(() => this.requireNotify(mod), 1000);
        }
    }
}
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
                for (let mod of changes.add) {
                    let wholist = mod.__whoRequired();
                    for (let who of wholist) {
                        if (modlist.indexOf(who) < 0) {
                            modlist.push(who);
                        }
                    }
                }
            }
            if (changes.change) {
                for (let mod of changes.change) {
                    let wholist = mod.__whoRequired();
                    for (let who of wholist) {
                        if (modlist.indexOf(who) < 0) {
                            modlist.push(who);
                        }
                    }
                }
            }
            if (changes.unlink) {
                for (let mod of changes.unlink) {
                    let wholist = mod.__whoRequired();
                    for (let who of wholist) {
                        if (modlist.indexOf(who) < 0) {
                            modlist.push(who);
                        }
                    }
                }
            }
            for (let mod of modlist) {
                this.unrequire(mod, null, true);
                this.requireNotify(mod);
                
            }
        }, options);
        this._notifyCallback = notifyCallback;
        this._updatedTimeouts = {};
    }
    requireNotify(mod:CustomNodeModule) {
        clearTimeout(this._updatedTimeouts[mod.filename]);
        this.require(mod.filename);
        var newmod = this.getCachedModule(mod.filename, module);
        if (!newmod.__checkInvalid()) {
            if (this._notifyCallback) {
                this._notifyCallback(mod, newmod);
            }
        } else {
            this._updatedTimeouts[mod.filename] = setTimeout(() => this.requireNotify(mod), 1000);
        }
    }
}
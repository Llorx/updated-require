var Module = require("module");
import { WatcherRequire, WatcherOptions } from "watcher-require";

export class UpdatedRequire extends WatcherRequire {
    _notifyCallback:(oldmodule:NodeModule, newmodule:NodeModule)=>void;
    _updatedTimeouts:any;
    constructor(notifyCallback?:(oldmodule:NodeModule, newmodule:NodeModule)=>void, options?:WatcherOptions) {
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
            let modlist:NodeModule[] = [];
            if (changes.add) {
                modlist = modlist.concat(changes.add);
                /*for (let mod of changes.add) {
                    let wholist = mod.__whoRequired();
                    for (let who of wholist) {
                        if (modlist.indexOf(who) < 0) {
                            modlist.push(who);
                        }
                    }
                }*/
            }
            if (changes.change) {
                modlist = modlist.concat(changes.change);
                /*for (let mod of changes.change) {
                    let wholist = mod.__whoRequired();
                    for (let who of wholist) {
                        if (modlist.indexOf(who) < 0) {
                            modlist.push(who);
                        }
                    }
                }*/
            }
            if (changes.unlink) {
                modlist = modlist.concat(changes.unlink);
                /*for (let mod of changes.unlink) {
                    let wholist = mod.__whoRequired();
                    for (let who of wholist) {
                        if (modlist.indexOf(who) < 0) {
                            modlist.push(who);
                        }
                    }
                }*/
            }
            var unrequired:NodeModule[] = [];
            for (let mod of modlist) {
                mod.__invalidate();
                let wholist = mod.__whoRequired();
                for (let who of wholist) {
                    if (unrequired.indexOf(who) < 0) {
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
    requireNotify(mod:NodeModule) {
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
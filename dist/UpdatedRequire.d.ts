/// <reference types="node" />
import { WatcherRequire, WatcherOptions } from "watcher-require";
export declare class UpdatedRequire extends WatcherRequire {
    _notifyCallback: (oldmodule: NodeModule, newmodule: NodeModule) => void;
    _updatedTimeouts: any;
    constructor(notifyCallback?: (oldmodule: NodeModule, newmodule: NodeModule) => void, options?: WatcherOptions);
    requireNotify(mod: NodeModule): void;
}

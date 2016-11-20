import { WatcherRequire, WatcherOptions, CustomNodeModule } from "watcher-require";
export declare class UpdatedRequire extends WatcherRequire {
    _notifyCallback: (oldmodule: CustomNodeModule, newmodule: CustomNodeModule) => void;
    _updatedTimeouts: any;
    constructor(notifyCallback?: (oldmodule: CustomNodeModule, newmodule: CustomNodeModule) => void, options?: WatcherOptions);
    requireNotify(mod: CustomNodeModule): void;
}

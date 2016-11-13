import { WatcherRequire, WatcherOptions, CustomNodeModule } from "watcher-require";
export interface UpdatedOptions extends WatcherOptions {
    recursive?: boolean;
}
export declare class UpdatedRequire extends WatcherRequire {
    _notifyCallback: (oldmodule: CustomNodeModule, newmodule: CustomNodeModule) => void;
    _updatedTimeouts: any;
    constructor(notifyCallback?: (oldmodule: CustomNodeModule, newmodule: CustomNodeModule) => void, options?: UpdatedOptions);
    requireNotify(mod: CustomNodeModule): void;
}

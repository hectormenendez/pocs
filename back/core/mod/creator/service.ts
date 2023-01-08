import * as $PATH from "std/path/mod.ts";
import * as $FS from "std/fs/walk.ts";

import { type State } from "x/oak/mod.ts";

import { DEFAULTS_CREATE_SERVICE, type DefaultsCreateService } from "back/core/mod/defaults.ts";
import { Walk } from "back/core/mod/utils.ts";

export type OptCheckerService = Required<DefaultsCreateService> & {
    /** The absolute path for the core project */
    pathCore: string;
    /** The absolute path for the service */
    pathService: string;
    /** The identifier for the project */
    uuid: string;
};

export type RecordCheckerService = {
    CheckerService: () => void;
};

export type OptCreateService = {
    readonly meta: ImportMeta;
    readonly defaults?: DefaultsCreateService;
};

export async function CreatorService<S extends State>(opt: OptCreateService) {
    const { meta, ...rest } = opt;
    const defaults = { ...DEFAULTS_CREATE_SERVICE, ...(rest.defaults || {}) };

    const pathCore = $PATH.resolve($PATH.dirname($PATH.fromFileUrl(import.meta.url)), "../..");
    const pathService = $PATH.dirname($PATH.fromFileUrl(meta.url));
    const uuid = String($PATH.basename(pathService)).toLowerCase();

    // const opts: OptCheckerService = { ...defaults, pathCore, pathService, uuid };
    const pathCheckers = $PATH.join(pathCore, "mod/creator/service");

    const x = await Walk<RecordCheckerService>(pathCheckers, defaults);

    console.log(x);
}

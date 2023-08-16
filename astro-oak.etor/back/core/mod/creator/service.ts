import * as $PATH from "std/path/mod.ts";

import { Application, type State } from "x/oak/mod.ts";

import { DEFAULTS_CREATE_SERVICE, type DefaultsCreateService } from "back/core/mod/defaults.ts";
import { ImportWalked } from "back/core/mod/utils.ts";

export type OptCheckerService = Required<DefaultsCreateService> & {
    /** The absolute path for the core project */
    pathCore: string;
    /** The absolute path for the service */
    pathService: string;
    /** The identifier for the project */
    uuid: string;
};

export type RecordCheckerService = {
    PluginService: <S extends State>(opt: OptCheckerService) => void;
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

    // instantiate the app
    const server = new Application(defaults.optionsServer);

    const optsChecker: OptCheckerService = { ...defaults, pathCore, pathService, uuid };
    const pathPlugins = $PATH.join(pathCore, "mod/creator/service-plugin");

    // run all creator-service plugins
    const walkedPluginService = await ImportWalked<RecordCheckerService>(pathPlugins, defaults);
    for await (const { PluginService } of walkedPluginService) PluginService<S>(optsChecker);
}

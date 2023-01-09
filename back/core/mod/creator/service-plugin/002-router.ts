import * as $PATH from "std/path/mod.ts";
import * as $FS from "std/fs/walk.ts";

import { Router, type State } from "x/oak/mod.ts";

import { Capitalize } from "back/core/mod/utils.ts";
import { OptCheckerService } from "back/core/mod/creator/service.ts";
import { Halt } from "back/core/mod/utils.ts";
import { type Endpoint } from "back/core/mod/defaults.ts";

/** Make sure a endpoints directory exists */
export async function PluginService<S extends State>(opt: OptCheckerService) {
    const {
        ext,
        uuid,
        pathEndpoints,
        optionsWalk,
        optionsRouter,
        propsAvailable,
        propsRequired,
        handler,
        builder,
    } = opt;
    // Create router
    const router = new Router<S>(optionsRouter);

    for await (const item of $FS.walk(pathEndpoints, optionsWalk)) {
        const basename = $PATH.basename(item.name, ext);
        let mod = undefined;
        try {
            mod = await import(item.path);
        } catch (err) {
            Halt(`Could not import ${item.path}: ${err.message}`);
        }

        const typemap = Object.entries(mod).reduce(
            (acc, [key, val]) => ({
                ...acc,
                [key]: typeof val,
            }),
            {} as Record<string, unknown>,
        );

        // Determine the name of the main configuration object
        const nameFn = [
            Capitalize(pathEndpoints.slice(0, -1)),
            Capitalize(uuid),
            Capitalize(basename),
        ].join("");
        if (!typemap[nameFn] || typeof mod[nameFn] !== typemap[nameFn]) {
            Halt(`Expecting a ${typemap[nameFn]} called: ${nameFn}`);
        }

        const endpoint: Endpoint = mod[nameFn];

        // Determine that properties are correctly set
        const propsEndpoint = Object.keys(endpoint);
        if (JSON.stringify(propsRequired) !== JSON.stringify(propsEndpoint)) {
            const exampleRequired = `[${propsRequired.join(", ")}]`;
            const exampleEndpoint = `[${propsEndpoint.join(", ")}]`;
            Halt(`Expecting props: ${exampleRequired} for ${nameFn}. got: ${exampleEndpoint}`);
        }

        // Determine that each property is correctly typed.
        for (const key of propsEndpoint) {
            const checker = propsAvailable[key];
            const prop = endpoint[key as keyof Endpoint];
            if (!checker(prop)) Halt(`Invalid ${nameFn}.${key} value: "${prop}"`);
        }
        builder<S>({ handler, router, endpoint });
    }
}

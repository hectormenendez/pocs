import * as $PATH from "std/path/mod.ts";
import { walk } from "std/fs/walk.ts";

import { Router, type State } from "x/oak/mod.ts";

import { Halt, Capitalize } from "./utils.ts";
import { DEFAULTS_CREATE_SERVICE, type DefaultsCreateService, type Endpoint } from "./defaults.ts";

// import { type RouterMiddleware } from "x/oak/router.ts";

export type OptCreateService = {
    readonly meta: ImportMeta;
    readonly defaults?: DefaultsCreateService;
};

export async function CreateService<S extends State>(opt: OptCreateService) {
    const { meta, ...rest } = opt;
    const defaults = { ...DEFAULTS_CREATE_SERVICE, ...(rest.defaults || {}) };
    const {
        charPlural,
        pathEndpoints,
        optionsWalk,
        optionsRouter,
        propsRequired,
        propsAvailable,
        builder,
        handler,
    } = defaults;

    if (pathEndpoints.charAt(pathEndpoints.length - 1) !== charPlural) {
        Halt(
            `Expecting a plural identifier (like "${charPlural}") for "pathEndpoints Default."`,
            `got: ${pathEndpoints} `,
        );
    }

    const PATH_ROOT = $PATH.dirname($PATH.fromFileUrl(meta.url));
    const EXT = $PATH.extname(meta.url);
    const UUID = String($PATH.basename(PATH_ROOT)).toLowerCase();

    // Determine the root path for instance is correctly defined
    try {
        const stat = await Deno.stat(PATH_ROOT);
        if (!stat.isDirectory) throw new Error("Expecting a Directory");
    } catch (err) {
        const message = err instanceof Error ? err.message : "UNKNOWN";
        Halt(`Invalid root path provided: ${message}`);
    }

    // Make sure a endpoints directory exists
    const PATH_ENDPOINTS = $PATH.join(PATH_ROOT, pathEndpoints);
    try {
        const stat = await Deno.stat(PATH_ENDPOINTS);
        if (!stat.isDirectory) throw new Error("Expecting a valid directory");
    } catch (err) {
        const message = err instanceof Error ? err.message : "UNKNOWN";
        Halt(`Invalid endpoints path provided: ${message}`);
    }

    // Create router
    const router = new Router<S>(optionsRouter);

    for await (const item of walk(PATH_ENDPOINTS, optionsWalk)) {
        const basename = $PATH.basename(item.name, EXT);
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
            Capitalize(UUID),
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

import { type WalkOptions } from "std/fs/walk.ts";

import { type Router, type RouterOptions, type State, hasFlash, FlashServer } from "x/oak/mod.ts";
import { type ApplicationOptions } from "x/oak/application.ts";
import type { ServerRequest } from "x/oak/types.d.ts";

import { HandlerRoute } from "./handler.ts";

export const HTTP_SEP = "/";

export const ROUTE_METHOD = {
    GET: "get",
    POST: "post",
    PUT: "put",
    DELETE: "delete",
} as const;

export type MethodEndpoint = keyof typeof ROUTE_METHOD;

export type PathEndpoint = `${typeof HTTP_SEP}${string}`;

export type HandlerEndpoint = (context: Router) => Promise<unknown> | unknown;

export type Endpoint = {
    method: MethodEndpoint;
    route: PathEndpoint;
    callback: HandlerEndpoint;
};

/** All the defaults used when creating a Service, you can use the `defaults` prop to override them. */
export const DEFAULTS_CREATE_SERVICE = {
    charPlural: "s",
    /** The name to look for endpoints (relative to project root) */
    pathEndpoints: "endpoints" as string,

    /** Determines which properties are required to instantiate a route */
    propsRequired: ["method", "route", "callback"] as string[],

    /** Props that are available to use, the value is a typeguard */
    propsAvailable: {
        /** The property that will determine the method to use for each route */
        method: isMethodRoute,
        /** The property that will contain the address of the current endpoint */
        route: isPathRoute,
        /** The property that will contain the handler function */
        callback: isHandlerRoute,
    } as Record<string, (entry: unknown) => entry is unknown>,

    /** Options to send to the Walk function (the process in charge of finding endpoints) */
    optionsWalk: {
        maxDepth: 1,
        followSymlinks: false,
        includeDirs: false,
        includeFiles: true,
    } as Partial<WalkOptions>,

    /** Options to send to the router: https://deno.land/x/oak@v11.1.0/mod.ts?s=RouterOptions */
    optionsRouter: {
        // Override the default set of methods supported by the router.
        methods: undefined,
        // Only handle routes where the requested path starts with the prefix.
        prefix: undefined,
        // Override the request.url.pathname when matching middleware to run.
        routerPath: undefined,
        // Determines if routes are matched in a case sensitive way. Defaults to false.
        sensitive: true,
        // Determines if routes are matched where the trailing / is not optional. Defaults to false.
        strict: true,
    } as Partial<RouterOptions>,

    /**
     * Options to send to the application consturctor.
     * https://deno.land/x/oak@v11.1.0/application.ts?s=ApplicationOptions
     */
    optionsServer: {
        /**
         * A server constructor to use instead of the default server for receiving requests.
         * When flash is available, uses it. https://deno.land/x/oak@v11.1.0/mod.ts?s=FlashServer
         * NOTE:
         *      - there are some limitations for this.
         *      - FlashServer requires the `--unstable` flag
         */
        serverConstructor: !hasFlash() ? undefined : FlashServer,
        /**
         * Determine how the state from the application should be applied when creating a new context.
         * - clone: (default) context state will be a clone of the application state.
         * - prototype: shallow properties on the context's state will not be reflected
         *              in the application's state
         * - alias: Application's state context's state will be a reference to the same object
         * - empty: context state will have an empty object.
         */
        contextState: "alias",
        /**
         * Used when serializing a JSON response.
         * The replacer will be used with JSON.stringify() to encode any response bodies that need
         * to be converted before sending the response
         */
        jsonBodyReplacer: undefined,
        /**
         * The reviver will be used with JSON.parse() to decode any response bodies that are
         * being converted as JSON.
         */
        jsonBodyReviver: undefined,
        /**
         * An initial set of keys (or instance of {@link KeyStack})
         * to be used for signing cookies produced by the application.
         */
        keys: undefined,
        /**
         * If true any errors handled by the application will be logged to the stderr.
         * If false nothing will be logged. The default is true.
         */
        logErrors: false,
        /** If true proxy headers will be trusted when processing requests. defaults to false. */
        proxy: undefined,
        /* The initial state object for the application, */
        state: undefined,
    } as Partial<ApplicationOptions<unknown, ServerRequest>>,

    builder<S extends State>(router: Router<S>, endpoint: Endpoint) {
        const method = ROUTE_METHOD[endpoint.method as keyof typeof ROUTE_METHOD];
        // TODO: Typings are not being resolved correctly, even though the instantation was valid
        /* eslint-disable @typescript-eslint/ban-ts-comment */
        // deno-lint-ignore ban-ts-comment
        // @ts-ignore
        router[method](endpoint.route, HandlerRoute.bind(endpoint.callback));
        /* eslint-enable @typescript-eslint/ban-ts-comment */
    },
} as const;

/** @see DEFAULTS_CREATE_SERVICE */
export type DefaultsCreateService = {
    [K in keyof typeof DEFAULTS_CREATE_SERVICE]?: typeof DEFAULTS_CREATE_SERVICE[K];
};

/** TypeGuard that makes sure an unknown entry contains one of the enabled Methods */
export function isMethodRoute(entry: unknown): entry is MethodEndpoint {
    if (typeof entry !== "string") return false;
    return Object.keys(ROUTE_METHOD).includes(entry);
}

/** TypeGuard that makes sure an unknown entry is a valid string containing a route */
export function isPathRoute(entry: unknown): entry is PathEndpoint {
    if (typeof entry !== "string") return false;
    if (entry[0] !== HTTP_SEP) return false;
    // TODO: Maybe do a regex to determine the URL is actually valid?
    return true;
}

/** TypeGuard that makes sure an unknown entry is a valid handler function */
export function isHandlerRoute(entry: unknown): entry is HandlerEndpoint {
    if (typeof entry !== "function") return false;
    // TODO: Do further validations to make sure it is a valid function.
    return true;
}

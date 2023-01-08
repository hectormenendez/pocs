import { State } from "x/oak/application.ts";
import { Router } from "x/oak/router.ts";

import { Endpoint, ROUTE_METHOD } from "../defaults.ts";
import { HandlerRoute } from "../handler/route.ts";

export type ArgCreatorRoute<S extends State> = {
    handler: typeof HandlerRoute;
    router: Router<S>;
    endpoint: Endpoint;
};

export function CreatorRoute<S extends State>(arg: ArgCreatorRoute<S>) {
    const { handler, router, endpoint } = arg;
    const method = ROUTE_METHOD[endpoint.method as keyof typeof ROUTE_METHOD];
    // TODO: Typings are not being resolved correctly, even though the instantation was valid
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // deno-lint-ignore ban-ts-comment
    // @ts-ignore
    router[method](endpoint.route, handler.bind(endpoint.callback));
    /* eslint-enable @typescript-eslint/ban-ts-comment */
}

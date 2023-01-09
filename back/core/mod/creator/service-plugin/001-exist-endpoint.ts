import * as $PATH from "std/path/mod.ts";

import { OptCheckerService } from "back/core/mod/creator/service.ts";
import { Halt } from "back/core/mod/utils.ts";

/** Make sure a endpoints directory exists */
export async function PluginService(opt: OptCheckerService) {
    const { pathService, charPlural } = opt;

    // Modify the options reference so the following plugin now about this change.
    const { pathEndpoints } = Object.defineProperty(opt, "pathEndpoints", {
        value: $PATH.join(pathService, opt.pathEndpoints),
    });

    try {
        const stat = await Deno.stat(opt.pathEndpoints);
        if (!stat.isDirectory) throw new Error("Expecting a valid directory");
        if (pathEndpoints.charAt(pathEndpoints.length - 1) !== charPlural) {
            throw new Error(
                [
                    `Expecting a plural identifier (like "${charPlural}") for "pathEndpoints Default."`,
                    `got: ${pathEndpoints} `,
                ].join(" "),
            );
        }
    } catch (err) {
        const message = err instanceof Error ? err.message : "UNKNOWN";
        Halt(`Invalid endpoints path provided: ${message}`);
    }
}

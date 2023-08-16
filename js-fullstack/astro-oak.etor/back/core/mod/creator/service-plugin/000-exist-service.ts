import { OptCheckerService } from "back/core/mod/creator/service.ts";
import { Halt } from "back/core/mod/utils.ts";

/** Determine the root path for instance is correctly defined */
export async function PluginService(opt: OptCheckerService) {
    const { pathService } = opt;
    try {
        const stat = await Deno.stat(pathService);
        if (!stat.isDirectory) throw new Error("Expecting a Directory");
    } catch (err) {
        const message = err instanceof Error ? err.message : "UNKNOWN";
        Halt(`Invalid root path provided: ${message}`);
    }
}

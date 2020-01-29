import PluginAlias from "@rollup/plugin-alias";
import PluginNodeResolve from "@rollup/plugin-node-resolve";
import PluginCommonJS from "@rollup/plugin-commonjs";
import BuiltinModules from "builtin-modules";
import PluginAnalizer from "rollup-plugin-analyzer";

import { dependencies as Deps } from "../package.json";
import Path, { Join, INDEX_JS } from "./path";

const external = [...BuiltinModules, ...Object.keys(Deps)];
console.log('External: ', external);

export default {
    watch: { clearScreen: false },
    input: Join(Path.SRC, INDEX_JS),
    external,
    output: {
        name: "electron",
        file: Join(Path.PUB, INDEX_JS),
        format: "cjs",
        sourcemap: false,
        compact: false,
    },
    plugins: [
        PluginAlias({
            entries: [{ find: "/etc/path", replacement: Join(Path, "etc", "path") }],
        }),
        PluginNodeResolve({
            browser: false,
            mainFields: ["main"],
            preferBuiltins: true,
            modulesOnly: true,
        }),
        PluginCommonJS({
            include: "node_modules/**",
        }),
        PluginAnalizer({ summaryOnly: true }),
    ],
};

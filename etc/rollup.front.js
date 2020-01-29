import PluginJson from "@rollup/plugin-json";
import PluginNodeResolve from "@rollup/plugin-node-resolve";
import PluginCommonJS from "@rollup/plugin-commonjs";
import PluginSvelte from "rollup-plugin-svelte";
import PluginAnalizer from "rollup-plugin-analyzer";

import { Path, Join, SEP, INDEX_CSS, INDEX_JS } from "./path";

const { ROLLUP_WATCH } = process.env;
const SVELTE_NAME = "svelte";
const isProduction = !ROLLUP_WATCH;

export default {
    input: Join(Path.SRC.FRONT, INDEX_JS),
    output: {
        name: "Svelte",
        file: Join(Path.PUB.FRONT, INDEX_JS),
        format: "iife", // immediately invoked function expression
        sourcemap: false,
    },
    plugins: [
        PluginJson(),
        PluginSvelte({
            // run-time checks when not in production
            dev: !isProduction,
            // concatenate all css into an external file.
            css(css) {
                css.write(Join(Path.PUB.FRONT, INDEX_CSS));
            },
        }),
        PluginNodeResolve({
            browser: true,
            preferBuiltins: true,
            modulesOnly: true,
        }),
        PluginCommonJS(),
        PluginAnalizer({ summaryOnly: true }),
    ].concat(
        isProduction
            ? [
                  // TODO: Add production-only plugins here
              ]
            : [
                  // TODO: Add Development-only plugins here
              ],
    ),
    watch: { clearScreen: false },
};

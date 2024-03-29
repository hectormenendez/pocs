import PluginJson from "@rollup/plugin-json";
import PluginNodeResolve from "@rollup/plugin-node-resolve";
import PluginCommonJS from "@rollup/plugin-commonjs";
import PluginSvelte from "rollup-plugin-svelte";
import PluginAnalizer from "rollup-plugin-analyzer";
import PluginTypeScript from "@wessberg/rollup-plugin-ts";
import Preprocess from "svelte-preprocess";

import { Path, Join, INDEX_CSS, INDEX_JS, INDEX_TS } from "./path";
import * as Config from "../svelte-preprocess.config.json";

const { ROLLUP_WATCH } = process.env;
const NAME = "svelte";
const isProduction = !ROLLUP_WATCH;

export default {
    input: Join(Path.SRC.FRONT, INDEX_TS),
    output: {
        sourcemap: true,
        format: "iife", // immediately invoked function expression
        name: "Svelte",
        file: Join(Path.PUB.FRONT, INDEX_JS),
    },
    watch: {
        clearScreen: false,
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
            preprocess: Preprocess(Config),
        }),
        PluginNodeResolve({
            browser: true,
            preferBuiltins: true,
            modulesOnly: true,
            dedupe: (importee) => importee === NAME || importee.startsWith(`${NAME}/`),
        }),
        PluginCommonJS(),
        PluginTypeScript({
            browserslist: false,
        }),
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
};

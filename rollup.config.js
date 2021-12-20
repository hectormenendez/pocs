import $PATH from "path";

import TypeScript from "@rollup/plugin-typescript";
import Svelte from "rollup-plugin-svelte";
import SveltePreprocess from "svelte-preprocess";
import CommonJS from "@rollup/plugin-commonjs";
import Resolve from "@rollup/plugin-node-resolve";
import LiveReload from "rollup-plugin-livereload";
import { terser as Terser } from "rollup-plugin-terser";
import CSS from "rollup-plugin-css-only";
import Copy from "rollup-plugin-copy";
import JSON from "@rollup/plugin-json";
import Alias from "@rollup/plugin-alias";

import ConfigTS from "./@www/tsconfig.json";

const production = !process.env.ROLLUP_WATCH;

export default {
    input: "@www/main.ts",
    output: {
        sourcemap: true,
        format: "iife",
        name: "app",
        file: "dist/bundle.js",
    },
    plugins: [
        JSON(),
        Copy({
            targets: [{ src: "@static/**/*", dest: "dist" }],
        }),
        Svelte({
            preprocess: SveltePreprocess({
                sourceMap: !production,
                scss: { includePaths: ["@www/**/*.scss"] },
            }),
            compilerOptions: {
                // enable run-time checks when not in production
                dev: !production,
            },
        }),
        // If you have external dependencies installed from
        // npm, you'll most likely need these plugins. In
        // some cases you'll need additional configuration -
        // consult the documentation for details:
        // https://github.com/rollup/plugins/tree/master/packages/commonjs
        Resolve({
            browser: true,
            dedupe: ["svelte"],
        }),
        Alias({ entries: typescriptAlias() }),
        CommonJS(),
        TypeScript({
            sourceMap: true,
            inlineSources: !production,
        }),
        // we'll extract any component CSS out into
        // a separate file - better for performance
        CSS({ output: "bundle.css" }),
        // In dev mode, call `npm run start` once
        // the bundle has been generated
        !production && serve(),
        // Watch the distribution directory and refresh the
        // browser on changes when not in production
        !production && LiveReload({ watch: "dist", delay: 200 }),
        // If we're building for production (npm run build
        // instead of npm run dev), minify
        production && Terser({ format: { comments: false } }),
    ],
    watch: {
        clearScreen: false,
    },
};

function typescriptAlias() {
    const { paths } = ConfigTS.compilerOptions;
    const repl = (target) => target.replace("./", "").replace("/*", "");
    const result = Object.entries(paths).map(([key, [value]]) => ({
        replacement: $PATH.resolve(__dirname, repl(value)),
        find: repl(key),
    }));
    return result;
}

function serve() {
    let server;

    function toExit() {
        if (server) server.kill(0);
    }

    return {
        writeBundle() {
            if (server) return;
            server = require("child_process").spawn("npm", ["run", "serve:dev"], {
                stdio: ["ignore", "inherit", "inherit"],
                shell: true,
            });

            process.on("SIGTERM", toExit);
            process.on("exit", toExit);
        },
    };
}

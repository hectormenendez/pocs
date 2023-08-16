import { defineConfig } from "astro/config";
import Svelte from "@astrojs/svelte";
import Compress from "astro-compress";

const PATH_OUT = "./dist";

// https://astro.build/config
export default defineConfig({
    output: "static",
    site: "https://etor.dev",
    outDir: PATH_OUT,
    integrations: [Svelte(), Compress({ path: PATH_OUT })],
});

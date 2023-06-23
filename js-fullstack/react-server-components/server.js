// core modules
import * as $HTTP from "http";
import * as $FS from "fs/promises";

// package.json modules
import React from "react";
import EscapeHTML from "escape-html";

// local modules
import { JSX2HTML } from "./utils/jsx2html.js"
import { Page } from "./components/Page.js";

try {
    const server = $HTTP.createServer(ServerCreate);
    const PORT = 9999;
    console.log(`Listening on port: ${PORT}`);
    await server.listen(PORT);
}  catch (err) {
    console.error(err);
}


async function ServerCreate(_request, response) {
    response.setHeader("Content-Type", "text/html");
    const { html: article } = await ArticleFetch();
    const html = JSX2HTML(<Page article={article} author="Hector Menendez" />);
    response.end(html);
}

/** @typedef {{raw: string; html: string}} ArticleContent */
/** @returns {Promise<ArticleContent>} */
async function ArticleFetch() {
    const raw = await $FS.readFile("./server.txt", "utf-8");
    return { raw, html: EscapeHTML(raw) };
}
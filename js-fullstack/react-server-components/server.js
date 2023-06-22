// core modules
import * as $HTTP from "http";
import * as $FS from "fs/promises";

// package.json modules
import React from "react"; // needed for the JSX to work 
import EscapeHTML from "escape-html";

// local modules
import { JSX2HTML } from "./utils/jsx2html.js"

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

    const html = JSX2HTML(
        <html>
            <head>
                <title>My Blog</title>
            </head>
            <body>
                <nav>
                    <a href="/">Home</a>
                    <hr />
                </nav>
                <article>{article}</article>
                <footer>
                    <hr />
                    <p><i>(c) Hector Menendez, {new Date().getFullYear()}</i></p>
                </footer>
            </body>
        </html>
    );

    response.end(html);
}

/** @typedef {{raw: string; html: string}} ArticleContent */
/** @returns {Promise<ArticleContent>} */
async function ArticleFetch() {
    const raw = await $FS.readFile("./server.txt", "utf-8");
    return { raw, html: EscapeHTML(raw) };
}



   
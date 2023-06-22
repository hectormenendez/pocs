import * as $HTTP from "http";
import * as $FS from "fs/promises";

import EscapeHTML from "escape-html";

try {
    const server = $HTTP.createServer(ServerCreate);
    await server.listen(9999);
}  catch (err) {
    console.error(err);
}

async function ServerCreate(_request, response) {
    response.setHeader("Content-Type", "text/html");
    response.end(await Layout());

}

/** @typedef {{raw: string; html: string}} ArticleContent */

/** @returns {Promise<ArticleContent>} */
async function ArticleFetch() {
    const raw = await $FS.readFile("./server.txt", "utf-8");
    return { raw, html: EscapeHTML(raw) };

}

async function LayoutArticle() {
    const { html } = await ArticleFetch();
    return `<article>${html}</article>`;
}

/** @param {string} author  */
async function LayoutFooter(author) {
    return `
        <footer>
            <hr />
            <p><i>(c) ${author}, ${new Date().getFullYear()}</i></p>
        </footer>
    `;
}

async function Layout() {
    const article = await LayoutArticle();
    const footer = await LayoutFooter("Hector Menendez");
    return `
        <html>
            <head>
                <title>My Blog</title>
            </head>
            <body>
                <nav>
                    <a href="/">Home</a>
                    <hr />
                </nav>
                ${article}
                ${footer}
            </body>
        </html>
    `;
}


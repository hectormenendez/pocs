import React from "react"; // needed for the JSX to work

import { Footer } from "./Footer.js";

/**
 * @param {Object} param0
 * @param {string} param0.article
 * @param {string} param0.author
 */
export function Page({ article, author }) {
    return (
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
                <Footer author={author} />
            </body>
        </html>

    )
}
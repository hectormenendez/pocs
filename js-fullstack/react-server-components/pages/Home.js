/**
 * @typedef {{ slug: string; content: string }} Article
 */

import React from "react";

/**
 * @param {Object} opt
 * @param {Article[]} opt.articles
 */
export function Home({ articles }) {
    return (
        <article>
            <header>
                <h2>My Blog</h2>
            </header>
            <ul>
                {articles.map(({ slug, content }) => (
                    <li key={slug}>
                        <h3>{slug}</h3>
                        <p>{content}</p>
                    </li>
                ))}
            </ul>
        </article>
    )
}

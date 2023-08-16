/**
 * @typedef {{ slug: string; content: string }} Article
 */

import React from "react";

import { ArticlesFetch } from "../handlers/article.js";
import { URL_SEGMENT } from "../config.js";
import { Layout } from "../components/Layout/index.js";

export async function Home() {
    const articles = await ArticlesFetch();
    return (
        <Layout children={
            <article>
                <header>
                    <h2>Articles</h2>
                </header>
                <ul>
                    {articles.map(({ slug, content }) => (
                        <li key={slug}>
                            <a href={`${URL_SEGMENT.ARTICLES}/${slug}`}>{slug}</a>
                        </li>
                    ))}
                </ul>
            </article>
        } />
    )
}

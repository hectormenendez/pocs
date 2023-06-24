import React from "react";

import { URL_SEGMENT_BLOG } from "../config.js";
import { ArticleGet } from "../handlers/article.js";


/**
 * @param {Object} props
 * @param {string} props.slug
 */
export async function Article({ slug }) {
    const href = `${URL_SEGMENT_BLOG}/${slug}`;
    const article = await ArticleGet(slug);
    // this should never happen because of the router. this is just a type resolver.
    if (!article) return null;
    const { content } = article;

    return (
        <article>
            <header>
                <h2>
                    <a href={href}>{slug}</a>
                </h2>
            </header>
            <section>{content}</section>
        </article>
    );
}
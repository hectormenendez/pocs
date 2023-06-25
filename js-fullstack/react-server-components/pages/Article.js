import React from "react";

import { URL_SEGMENT } from "../config.js";
import { ArticleGet } from "../handlers/article.js";
import { SERVER_EVENT_NAME, ServerEmit } from "../handlers/server.js";
import { Layout } from "../components/Layout/index.js";


/**
 * @param {Object} props
 * @param {string} props.slug
 */
export async function Article({ slug }) {
    const article = await ArticleGet(slug);

    if (!article) {
        ServerEmit(SERVER_EVENT_NAME.RENDER_STATUS, { status: 404 });
        return;
    }

    const href = `${URL_SEGMENT.ARTICLES}/${slug}`;
    const { content } = article;

    return (
        <Layout children={
            <article>
                <header>
                    <h2>
                        <a href={href}>{slug}</a>
                    </h2>
                </header>
                <section>{content}</section>
            </article>
        } />
    );
}
import React from "react";
export function Article({ slug, content }) {
    return (
        <article>
            <header>
                <h2>
                    <a href={`/article/${slug}`}>{slug}</a>
                </h2>
            </header>
            <section>{content}</section>
        </article>
    )
}
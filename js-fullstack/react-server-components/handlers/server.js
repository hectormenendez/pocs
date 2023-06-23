/** @typedef {import("http").IncomingMessage} ServerRequest */

/** @typedef {import("http").ServerResponse} ServerResponse */

import React from "react";

import {JSX2HTML} from "../utils/jsx2html.js";

import { Home } from "../pages/Home.js";
import { Article } from "../pages/Article.js";

import { ArticlesFetch } from "./article.js";

const URL_SEP = "/";

const PREFIX_BLOG = /** @type {const} */(`${URL_SEP}blog`);

/**
 * @param {ServerRequest} request
 * @param {ServerResponse} response
 */
export async function ServerCreate(request, response) {
    response.setHeader("Content-Type", "text/html");
    const { url } = request;
    const articles = await ArticlesFetch();
    const slugs = articles.map(({ slug }) => [PREFIX_BLOG, slug].join(URL_SEP));

    // invalid urls
    if (!url || !url.startsWith(URL_SEP)) return ServerRedirect(response);

    // root
    if (url === URL_SEP) {
        response.end(JSX2HTML(<Home articles={articles} />));
        return;
    }

    // blog
    if (url.startsWith(PREFIX_BLOG)) {
        const segments = url.replace(PREFIX_BLOG, "").split(URL_SEP).slice(1);

        // root gets redirected back Home
        if (!segments.length) return ServerRedirect(response);

        // extract the next url segment
        const section = segments.shift()
        if (!section) return ServerRender404(response)

        // determine if the current section has an equivalent article
        const article = articles.find(({ slug }) => slug === section);

        // no article? no content.
        if (!article) return ServerRender404(response);

        // the article is available, render it.
        response.end(JSX2HTML(<Article slug={article.slug} content={article.content} />));
        return;
    }

    // other ?
    ServerRender404(response);
}

/**
 * @param {ServerResponse} response
 * @param {string} Location
 */
export function ServerRedirect(response, Location=URL_SEP) {
    response.writeHead(302, { Location })
    response.end();
}

/**
 * @param {ServerResponse} response
 */
export function ServerRender404(response) {
    response.statusCode = 404;
    response.end("<h1>404</h1>");
}

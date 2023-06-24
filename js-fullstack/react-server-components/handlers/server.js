/** @typedef {import("http").IncomingMessage} ServerRequest */

/** @typedef {import("http").ServerResponse} ServerResponse */

import $HTTP from "http";

import React from "react";

import { URL_SEP, URL_SEGMENT_BLOG, ENV } from "../config.js";
import { JSX2HTML } from "../utils/jsx2html.js";

import { Home } from "../pages/Home.js";
import { Article } from "../pages/Article.js";

import { ArticlesFetch } from "./article.js";

/**
 * @param {ServerRequest} request
 * @param {ServerResponse} response
 */
export async function ServerCreate(request, response) {
    try {
        const url = new URL(request.url || "", `http://${request.headers.host}`);
        const { pathname: path } = url;
        // let the server know the type of content we're serving.
        response.setHeader("Content-Type", "text/html");
        // fetch all the articles to build the navigation
        const articles = await ArticlesFetch();
        // an invalid path was provided
        if (!path || !path.startsWith(URL_SEP)) return ServerRedirect(response);
        // root
        if (path === URL_SEP) {
            response.end(await JSX2HTML(<Home articles={articles} />));
            return;
        }
        // blog
        if (path.startsWith(URL_SEGMENT_BLOG)) {
            const segments = path.replace(URL_SEGMENT_BLOG, "").split(URL_SEP).slice(1);
            // root gets redirected back Home
            if (!segments.length) return ServerRedirect(response);
            // extract the next url segment
            const section = segments.shift()
            if (!section) return ServerRenderStatus(response, $HTTP.STATUS_CODES.NOT_FOUND)
            // determine if the current section has an equivalent article
            const article = articles.find(({ slug }) => slug === section);
            // no article? no content.
            if (!article) return ServerRenderStatus(response, $HTTP.STATUS_CODES.NOT_FOUND);
            // the article is available, render it.
            response.end(await JSX2HTML(<Article slug={article.slug} />));
            return;
        }
        // other ?
        ServerRenderStatus(response, $HTTP.STATUS_CODES[501]);
    } catch (err) {
        console.error(err);
        ServerRenderStatus(response, $HTTP.STATUS_CODES.INTERNAL_SERVER_ERROR)
    }
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
 * @param {string | undefined} status
 */
export function ServerRenderStatus(response, status = "200") {
    response.statusCode = Number(status);
    response.end(`<h1>{status}</h1>`);
}

export function ServerListen() {
    console.log(`Listening on port: ${ENV.PORT}`);
}

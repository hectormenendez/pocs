import React from 'react';

import { SERVER_EVENT_NAME, ServerEmit } from "../handlers/server.js";
import { URL_SEP } from "../config.js";
import { Home } from "../pages/Home.js";
import { Article } from "../pages/Article.js";

/**
 * @param {Object} props
 * @param {URL} props.url
 */
export async function Router({ url }) {
    const { pathname } = url;

    if (["/", "/index.html"].includes(pathname)) {
        return <Home />;
    }

    if (["/articles", "/articles/", "/articles/index.html"].includes(pathname)) {
        ServerEmit(SERVER_EVENT_NAME.REDIRECT, { location: "/" });
        return;
    }

    // if the path is an aricle let's determine if exists.
    if (pathname.startsWith("/articles/")) {
        const slug = pathname.split(URL_SEP).pop();
        if (!slug) {
            ServerEmit(SERVER_EVENT_NAME.RENDER_STATUS, { status: 500 });
            return;
        }
        return <Article slug={slug} />;
    }

}
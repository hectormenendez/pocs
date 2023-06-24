/** @typedef {{ slug: string; path: string; content: string }} Article */

import * as $FS from "fs/promises";
import * as $PATH from "path";

import { PATH } from "../config.js";

export async function ArticlesFetch() {
    const names = await $FS.readdir(PATH.ARTICLES);
    // obtain the full paths of all the files located in the articles directory
    // this will ignore all directories.
    const paths = /** @type {string[]} */(await Promise.all(names.map(async (name) => {
        const path = $PATH.join(PATH.ARTICLES, name);
        const stat = await $FS.stat(path);
        if (!stat.isFile()) return undefined;
        return path;
    }))).filter(Boolean);

    const articles = await paths.reduce(async (promise, path) => {
        const content = await $FS.readFile(path, "utf-8");
        const slug = $PATH.basename(path, $PATH.extname(path)).toLowerCase();
        return [...(await promise), { slug, path, content }];
    }, Promise.resolve(/** @type {Article[]}*/([])));

    return articles;
}

/**
 * @param {string} slug
 */
export async function ArticleGet(slug) {
    const articles = await ArticlesFetch();
    return articles.find((article) => article.slug === slug);
}

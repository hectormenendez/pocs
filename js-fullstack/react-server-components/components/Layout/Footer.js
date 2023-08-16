import React from "react";

/**
 * @param {Object} param0
 * @param {string} param0.author
 */
export function Footer({ author }) {
    return (
        <footer>
            <hr />
            <p><small><i>(c) {author}, {new Date().getFullYear()}</i></small></p>
        </footer>
    );
}

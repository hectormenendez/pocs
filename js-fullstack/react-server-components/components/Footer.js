import React from "react"; // needed for the JSX to work

/**
 * @param {Object} param0
 * @param {string} param0.author
 */
export function Footer({ author }) {
    return (
        <footer>
            <hr />
            <p><i>(c) {author}, {new Date().getFullYear()}</i></p>
        </footer>
    );
}

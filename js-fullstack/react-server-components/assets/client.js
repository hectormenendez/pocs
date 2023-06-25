const STATE = {
    /** The current location. @type {string | undefined} */
    LOCATION: undefined,
};

window.addEventListener("DOMContentLoaded", handleDOMReady);

/** @param {Event} ev */
function handleDOMReady(ev) {
    // When the user press back/forward on the browser, tap into that.
    window.addEventListener("popstate", (ev) => handlePopState);
    document
        .querySelectorAll("a")
        .forEach((el) => el.addEventListener("click", handleLinkNavigation, true));
}

/** @param {PopStateEvent} ev  */
function handlePopState(ev) {
    Navigate(window.location.pathname);
}

/** @param {MouseEvent} ev  */
function handleLinkNavigation(ev) {
    // ignore modifiers
    if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;

    const target = /** @type {HTMLElement} */(ev.target);

    // determine if we should ignore the element or not.
    const href = target.getAttribute("href");
    if (!href || !href.startsWith("/")) return;

    // an internal link,  prevent default behavior, add to history and navigate.
    ev.preventDefault();
    window.history.pushState(null, "", href);
    Navigate(href);
}

/** @param {string} href  */
async function Navigate(href) {
    if (STATE.LOCATION === undefined) STATE.LOCATION = window.location.pathname;
    if (STATE.LOCATION !== href) return;
    const response = await fetch(href);

    // TODO: handle this better.
    if (response.status !== 200) return alert("Error loading page");
    const html = await response.text();

    const bodyIni = html.match(/<[ ]*body[^>]*>/i);
    if (!bodyIni) return alert("Error: Could not find the start of <body>");

    const bodyEnd = html.match(/<\/[ ]*body[^>]*>/i);
    if (!bodyEnd) return alert("Error: Could not find the end of <body>");

    const indexIni = Number(bodyIni.index) + bodyIni[0].length;
    const indexEnd = Number(bodyEnd.index) - bodyEnd[0].length - 2;

    const body =  html.slice(indexIni, indexEnd)
    const elBody = document.querySelector("body");
    if (!elBody) return alert("Error: Could not find <body> element");

    elBody.innerHTML = body;
}

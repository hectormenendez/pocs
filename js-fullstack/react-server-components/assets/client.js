import { hydrateRoot } from "react-dom/client"; // loaded using index.importmap

const STATE = {
    /** The current location. @type {string} */
    HREF: new URL(window.location.href).pathname,
};


window.addEventListener("DOMContentLoaded", handleDOMReady);
window.addEventListener("load", handleLoad);


// -------------------------------------------------------------------------------------------------

async function handleLoad() {
    // download the jsx version of this website.
    // const jsx = await getJSX(STATE.HREF);

    /** The original handler for the React Root element */
    hydrateRoot(document, {
        "$$typeof": Symbol("react.element"),
        type: "div",
        key: null,
        ref: null,
        props: { children: "hola" },
        _owner: null,
        _store: {}
    });
}

/** @param {Event} ev */
async function handleDOMReady(ev) {
    // When the user press back/forward on the browser, tap into that.
    window.addEventListener("popstate", handlePopState);
    document
        .querySelectorAll("a")
        .forEach((el) => el.addEventListener("click", handleLinkNavigation, true));
}


function handleHydration() {
    console.log("Hydration!");
    return null;
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

async function getJSX(href) {
    const response = await fetch(`${href}?jsx`);
    // TODO: handle this better.
    if (response.status !== 200) return alert("Error loading page");
    const text = await response.text();
    try {
        return JSON.parse(text, handleJSXDeserialization);
    } catch (err) {
        console.error(err);
        return;
    }
}


/** @param {string} href  */
async function Navigate(href) {
    const currentHref = STATE.HREF;
    if (currentHref === href) return;
    STATE.HREF = new URL(window.location.href).pathname;
    const jsx = await getJSX(href);
    console.log(jsx);
}


function handleJSXDeserialization(key, value) {
    if (value === "$RE") return Symbol.for("react.element");
    if (typeof value === "string" && value.startsWith("$$")) return value.slice(1);
    return value;
}

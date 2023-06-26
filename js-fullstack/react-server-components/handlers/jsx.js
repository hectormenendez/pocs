import EscapeHTML from "escape-html";

/** @typedef {<R extends unknown, A extends unknown[]>(...args: A) => R} JSXFunc*/

/** @typedef {string | number | null | undefined | boolean} JSXPrimitive */

/** @typedef {Record<string, JSXPrimitive>} JSXObjectProps */

/** @typedef {Object} JSXObject
 *  @property {Symbol} $$typeof
 *  @property {JSXObjectProps | JSX} props
 *  @property {string | JSXFunc | Promise<JSXFunc>} type
 */

/** @typedef {JSXPrimitive | JSXPrimitive[] | JSXObject | JSXObject[]} JSX */

/** @param {JSX} jsx  */
export async function JSX2HTML(jsx) {
    // string and numbers just get escaped.
    if (typeof jsx === "string" || typeof jsx === "number") return EscapeHTML(String(jsx));
    // null and booleans are ignored.
    if (jsx === undefined || jsx === null || typeof jsx === "boolean") return "";
    // arrays are unwrapped and joined.
    if (Array.isArray(jsx)) {
        const children = await Promise.all(jsx.map(JSX2HTML));
        return children.join("");
    }
    // An object is the only remaining option.
    if (typeof jsx !== "object") throw new Error(`Not implemented. [${typeof jsx}]`);
    // but only if it's JSX
    if (!isJSXObject(jsx)) throw new Error("An object cannot be rendered.");
    // a component! be recursive.
    if (typeof jsx.type === "function") {
        return JSX2HTML(await jsx.type(jsx.props));
    }
    // assume a string otherwise
    let html = `<${jsx.type}`;
    const props = /** @type JSXObjectProps */(jsx.props);
    for (const propName in props) {
        if (!props.hasOwnProperty(propName) || propName === "children") continue;
        html += ` ${propName}="${EscapeHTML(String(props[propName]))}"`;
    }
    html += `> ${await JSX2HTML(props.children)}</${jsx.type}>`;
    return html;
}

/** @param {JSX} jsx */
export async function JSXParse(jsx) {
    // don't need to do anything special for primitives.
    if (isJSXPrimitive(jsx)) return;
    // resolve arrays recursively.
    if (Array.isArray(jsx)) return await Promise.all(jsx.map(JSXParse));
    // unknown cases
    if (typeof jsx !== "object") throw new Error(`Not implemented. [${typeof jsx}]`);
    // An arbitrary object, must be parsed as well, since it may contain JSX.
    if (!isJSXObject(jsx)) {
        return await Promise.all(
            Object
                .entries(/** @type any */(jsx))
                .map(async ([key, val]) => ([key, await JSXParse(val)]))
        );
    }
    // An element, like <div>, resolve recursively.
    if (typeof jsx.type === "string") {
        return { ...jsx, props: await JSXParse(/** @type JSX */(jsx.props)) };
    }
    // A component, like <MyComponent>, resolve recursively.
    if (typeof jsx.type === "function") {
        return await JSXParse(await jsx.type(jsx.props));
    }
    // unknown cases
    throw new Error(`Not Implemented. [${typeof jsx.type}]`);
}

/**
 * @template {unknown} T
 * @param {T} arg
 * @returns {T is JSXPrimitive}
*/
function isJSXPrimitive(arg) {
    return (
        arg === true  ||
        arg === false ||
        arg === null ||
        arg === undefined ||
        typeof arg === "string" ||
        typeof arg === "number"
    );
}

/**
 * @param {unknown} arg
 * @returns {arg is JSXObject}
 */
function isJSXObject(arg) {
    if (!arg || isJSXPrimitive(arg) || typeof arg !== "object") return false;
    return (/** @type JSXObject */(arg)).$$typeof === Symbol.for("react.element")
}
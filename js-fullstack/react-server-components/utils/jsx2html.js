import EscapeHTML from "escape-html";

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
    // objects with $$typeof are react elements.
    if (typeof jsx === "object") {
        if (jsx.$$typeof !== Symbol.for("react.element")) {
            throw new Error("An object cannot be rendered.");
        }
        // a component! be recursive.
        if (typeof jsx.type === "function") {
            return JSX2HTML(await jsx.type(jsx.props));
        }
        // assume a string otherwise
        let html = `<${jsx.type}`;
        for (const propName in jsx.props) {
            if (!jsx.props.hasOwnProperty(propName) || propName === "children") continue;
            html += ` ${propName}="${EscapeHTML(jsx.props[propName])}"`;
        }
        html += `> ${await JSX2HTML(jsx.props.children)}</${jsx.type}>`;
        return html;
    }
    throw new Error(`Not implemented. [${typeof jsx}]`);
}
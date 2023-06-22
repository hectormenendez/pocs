import EscapeHTML from "escape-html";
export function JSX2HTML(jsx) {
    // string and numbers just get escaped.
    if (typeof jsx === "string" || typeof jsx === "number") return EscapeHTML(String(jsx));
    // null and booleans are ignored.
    if (jsx === undefined || jsx === null || typeof jsx === "boolean") return "";
    // arrays are unwrapped and joined.
    if (Array.isArray(jsx)) return jsx.map(JSX2HTML).join("");
    // objects with $$typeof are react elements.
    if (typeof jsx === "object" && jsx.$$typeof === Symbol.for("react.element")) {
        let html = `<${jsx.type}`;
        for (const propName in jsx.props) {
            if (!jsx.props.hasOwnProperty(propName) || propName === "children") continue;
            html += ` ${propName}="${EscapeHTML(jsx.props[propName])}"`;
        }
        html += `> ${JSX2HTML(jsx.props.children)}</${jsx.type}>`;
        return html;
    }
    throw new Error("Not implemented.");
}
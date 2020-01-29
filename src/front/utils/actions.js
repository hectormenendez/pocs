/**
 * using <template>`s ability for not showing the content on the DOM
 * to emulate React's fragments.
 */
export function Template(node) {
    node.parentElement.insertBefore(node.content, node);
    // debugger;
    node.style = "display: none;";
    return {
        destroy() {
            // cleanup what we created
            if (node && node.parentElement) {
                node.remove();
            }
        },
    };
}

export function Commas(node) {
    debugger;
}
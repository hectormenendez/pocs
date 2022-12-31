export const TITLE = "etor.dev";

export function getTitle(title: null | string): string {
    if (!title) return TITLE;
    return `${title} ${TITLE}`;
}

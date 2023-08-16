const NEWLINE = "\n";
const NAME = "Error";

export function ErrorThrow({ message = "", name = "", hasStack = false }) {
    const stack = !hasStack ? "" : (new Error()).stack.split(NEWLINE).slice(2).join(NEWLINE);
    if (!name) name = NAME;
    if (message) message = `: ${message}`;
    process.stderr.write([
        `${name}${message}`,
        stack
    ].join(NEWLINE))
    process.exit(1);
}
import * as Dotenv from "dotenv";

Dotenv.config();

const RX_ENVVAR = new RegExp("{{([^}]+)}}");
export function onPreBuild({ netlifyConfig }) {
    if (!Array.isArray(netlifyConfig.edge_functions)) return;
    for (const [index, entry] of netlifyConfig.edge_functions.entries()) {
        const { path } = entry;
        const match = path.match(RX_ENVVAR);
        if (!match) continue;
        const [_, name] = match;
        if (!process.env[name]) {
            console.error(`Missing environment variable "${name}"`);
            process.exit(1);
        }
        netlifyConfig.edge_functions[index] = {
            ...netlifyConfig.edge_functions[index],
            path: path.replace(RX_ENVVAR, process.env[name]),
        };
    }
}

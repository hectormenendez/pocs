import Babel from "@babel/core";

const OPTIONS = {
    babelrc: false,
    ignore: [/\/(build|node_modules)\//],
    plugins: [["@babel/plugin-transform-react-jsx", { runtime: "automatic" }]],
};

export async function load(url, context, defaultLoad) {
    const result = await defaultLoad(url, context, defaultLoad);
    const base = { format: "module" }

    if (result && result.format === base.format) {
        const transformed = await Babel.transformAsync(
            result.source,
            Object.assign({ filename: url }, OPTIONS)
        );

        if (transformed) return Object.assign(base, { source: transformed.code });

        if (typeof result.source === "string") return result;

        return Object.assign(base, { source: Buffer.from(result.source).toString("utf-8") });
    }

    return defaultLoad(url, context, defaultLoad);
}

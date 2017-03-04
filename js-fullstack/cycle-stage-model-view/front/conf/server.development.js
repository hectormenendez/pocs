module.exports = conf => ({
    port: 8080,

    // NOTE: Cannot use conf.webpack here, since this is run before it's available.
    webpack: {

        // Only compile the bundle when its requested (requires filename)
        lazy: false,

        // The bundled files will be availeable under this path
        publicPath: '/',

        // Shows a full-screen overlay in the browser on compiler errors
        overlay: {
            warnings: false,
            errors  : true,
        },

        // Determine what will be shown on the stats output
        stats: {
            colors: true
        }
    }
});

const UTIL = require('util');

const Webpack = require('webpack');
const Server  = require('webpack-dev-server');
const Conf$   = require('./conf');

// Resolve the configuration stream and then start listening on the server.
Conf$.addListener({
    error: error => { throw error },
    next : conf  => {

        const webpack = Webpack(conf.webpack);
        const server  = new Server(webpack, Object.assign({
            filename: conf.webpack.output.filename
        }, conf.server.webpack));

        server.listen(conf.server.port, conf.server.host, () => {
            process.stdout.write("\n\n\n" + UTIL.inspect(conf, {
                // show non-enumerables
                showHidden: false,
                // The number of times to recurse in properties (null = infinity)
                depth: null,
                // Style ouput with ANSI Color codes
                colors: true,
                // Max number of array elements to show (null = infinity)
                maxArrayLength: null,
                // The lenggth in which an object keys are split across multiple lines
                breakLength: 1,
            }) + "\n\n\n");
        })
    }
})

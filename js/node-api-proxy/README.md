# API-PROXY
An utility for quick redirection of http traffic.


## Installation

``` bash
npm i
```

## Usage
The default PORT used is `8888` if you wish to change it  use an environment variable.

``` bash
# POSIX
PORT=9999 npm start

# WINDOWS
npx crossenv PORT=9999 npm start
```

## Configuration
The main configuration for the proxy is available on `src/config/proxy.js` (check the documentation 
on `http-proxy-middleware` for more information).

The endpoints are available on `src/config/endpoints.js` the default endpoint is `pass`.
You can customize which endpoint will act as default target by using a environment variable.

``` bash
# POSIX
TARGET=debug npm start

# WINDOWS
npx crossenv TARGET=debug npm start
```

Customize the `src/config/routes.js` file by specifying either a `route object`, a `constant`
or a combination of both.

``` javascript
{

    // Using constants (see src/config/constants for more info)
    'OPTIONS:/target': PASS, // METHOD:PATH: Constant/Route Object

    // Route object example (all properties are optional)
    'POST:/target': {
        host: Endpoints.test, // Redirect to a different hostname
        method: 'GET', // Redirect to a different method
        path: '/different/target', // Redirect to a different path

        onRequest(proxiedRequest, request, response) {
            // Modify the proxied request here
            // see Node's HTTP documentation for more info on how to do so.
        },

        onResponse(proxiedResponse, request, response) {
            // Modify the proxied request here
            // see Node's HTTP documentation for more info on how to do so.
        }
    },

    // Combined RouteObject/Constant example
    'PUT:/new': { ...DEBUG, host: Endpoints.pass }
}
```


#### Wildcards
At the moment, the paths specified on RouteObject **do not allow the use of wildcards**,
even if you only want to let traffic pass through you will have to manually specify all the
routes / methods for the proxy to process them.

#### Debugging
You can take advantage of included `debug` module by specifying which modules should output logs,
by default only the `proxy`module is available, if you wanto to -for example- output `express`'s
logs, you could do:

``` bash
# POSIX
DEBUG=express:route*,nodemon:* TARGET=pass PORT=9999 npm start

# WINDOWS
npx crossenv DEBUG=express* TARGET=pass PORT=9999 npm start
```

#### Support
This tools was originally developed by Héctor Menéndez, all inquiries please redirect them
to him to his email <hmenendez@technisys.com>.

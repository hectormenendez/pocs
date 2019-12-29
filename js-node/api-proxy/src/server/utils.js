import URL from 'url';

export class Routes {

    constructor(routes) {
        this.routes = Object
            .keys(routes)
            .map((key) => {
                const parts = key.split(':');
                if (parts.length !== 2) throw new Error('Expecting METHOD:/path');
                const [method, path] = parts;
                return {
                    ...routes[key],
                    method: {
                        orig: method,
                        dest: routes[key].method || method,
                    },
                    path: {
                        orig: path,
                        dest: routes[key].path || path,
                    },
                };
            });
    }

    get(request) {
        const { pathname } = URL.parse(request.originalUrl);
        return this.routes
            .filter(
                ({ path, method }) => path.orig === pathname && method.orig === request.method,
            )
            .shift();
    }

}

export default { Routes };

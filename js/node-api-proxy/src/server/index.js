import Middleware from 'http-proxy-middleware';
import Express from 'express';

import ConfigProxy from '~/config/proxy';
import { Logger } from '~/logger';
import { Errors, Paths, Routes, Requests, Responses, Urls } from './handlers';

export const Proxy = Middleware(Urls, {
    ...ConfigProxy,

    logProvider: () => Logger,

    onError: Errors,
    pathRewrite: Paths,
    router: Routes,
    onProxyReq: Requests,
    onProxyRes: Responses,
});

export const Server = Express();

Server.set('port', process.env.PORT || 8888);
Server.set('host', process.env.HOST || '0.0.0.0');
Server.set('prot', process.env.PROT || 'http');

Server.use(Proxy);

export { Express };
export default Server;

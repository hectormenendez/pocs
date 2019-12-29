import ConfigEndpoints from '~/config/endpoints';
import ConfigProxy from '~/config/proxy';

export const PASS = { host: ConfigProxy.target };

export const DEBUG = {
    host: ConfigEndpoints.debug,
    onResponse (proxiedResponse, request) {
        let body = new Buffer('');
        proxiedResponse.on('data', (data) => (body = Buffer.concat([body, data])));
        proxiedResponse.on('end', function () {
            body = body.toString();
            console.log([
                `[${request.method}] ${request.originalUrl}`,
                `requestHeaders: ${JSON.stringify(request.headers, null, ' ')}`,
                `requestBody: ${JSON.stringify(request.body, null, ' ')}`,
                `responseHeaders: ${JSON.stringify(proxiedResponse.headers, null, ' ')}`,
                `responseBody:\n${body}`,
                '\n\n',
            ].join('\n'));
        });
    },
};


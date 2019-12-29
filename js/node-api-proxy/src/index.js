import { Proxy as Config } from '~/config';
import Server from '~/server';
import { Logger } from '~/logger';

const server = Server.listen(
    Server.get('port'),
    Server.get('host'),
    function onListen() {
        const { address, port } = server.address();
        Logger.info('Listening: %s://%s:%s', Server.get('prot'), address, port);
        Logger.info('Configuration: %o', Config);
    },
);

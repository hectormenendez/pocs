import Server from './app';

const port = Server.get('port');
const host = Server.get('host');

Server
    .listen(port)
    .on('listening', () => {
        console.log(`Feathers application started on ${host}:${port}`)
    })

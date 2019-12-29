import Endpoints from './endpoints';

const target = process.env.TARGET
    ? Endpoints[process.env.TARGET]
    : Endpoints.pass;

if (!target) throw new Error('TARGET_NOT_FOUND');

export default {
    target,
    secure: false,
    changeOrigin: true,
    headers: {},
    logLevel: 'debug',
};

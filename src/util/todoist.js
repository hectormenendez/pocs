
// TODO: Use root-import
import { todoist as Config } from '../config.json';

const Request = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: {
        token: Config.token,
        resource_types: JSON.stringify(['items']),
    },
};

export default (syncToken) => {
    // Convert body into x-www-form-urlencoded
    const body = Object
        .entries(Object.assign({ sync_token: syncToken }, Request.body))
        .reduce((acc, [k, v]) => acc.concat(`${k}=${encodeURIComponent(v)}`), [])
        .join('&');
    return fetch(Config.endpoint, { ...Request, body })
        .then(response => response.json())
        .then(({ sync_token: sync, items }) => ({ sync, items }));
};

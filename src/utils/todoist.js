import { todoist as Config } from '~/utils/config.json';

export function Sync(syncToken) {

    const request = {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: Object
            .entries({
                token: Config.token,
                resource_types: JSON.stringify(['items']),
                sync_token: syncToken,
            })
            .reduce((acc, [k, v]) => acc.concat(`${k}=${encodeURIComponent(v)}`), [])
            .join('&'),
    };

    // Convert body into x-www-form-urlencoded
    return fetch(`${Config.endpoint}/sync`, request)
        .then(response => response.json())
        .then(({ sync_token: sync, items }) => ({ sync, items }));
}

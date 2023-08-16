import UUID from 'uuid/v4';
import { todoist as Config } from '~/utils/config.json';

export const API = (body) => {
    const fullBody = { token: Config.token, ...body };
    const request = {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        // Merge body and convert it into x-www-form-urlencoded
        body: Object
            .entries(fullBody)
            .reduce((acc, [k, v]) => acc.concat(`${k}=${encodeURIComponent(v)}`), [])
            .join('&'),
    };
    const url = `${Config.endpoint}/sync`;
    return fetch(url, request)
        .then(response => response.json())
        .then((json) => {
            if (__DEV__) { // eslint-disable-line no-undef
                /* eslint-disable no-console */
                console.groupCollapsed('~/utils/todoist');
                const style = 'font-weight:bold';
                console.log('%cbody', style, fullBody);
                console.log('%crequest', style, request);
                console.log('%cresponse', style, json);
                console.groupEnd();
                /* eslint-enable no-console */
            }
            return json;
        })
        .catch((error) => { throw error; });
};

export const Read = (syncToken, types) => API({
    sync_token: syncToken,
    resource_types: JSON.stringify(types),
});

export const Write = commands => API({
    commands: JSON.stringify(commands.map(([type, args]) => ({
        type,
        args,
        uuid: UUID(),
        temp_id: UUID(),
    }))),
});

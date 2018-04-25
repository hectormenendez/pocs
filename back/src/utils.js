import TodoistClient from 'todoist-js';
import { Observable } from 'rxjs';

import { todoist as Config } from '../config.json';

export const Todoist = new TodoistClient(Config.token);

const items$ = Observable
    .fromPromise(Todoist.sync())
    .map(state => state.items)
    .share();

export const $fromInput = text => Observable.create((observer) => {
    process.stdout.write(`${text}\n`);
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (data) => {
        observer.next(String(data).trim());
        observer.complete();
    });
});

export const $fromItemId = id => Observable
    .fromPromise(Todoist.items.get(id))
    .switchMap(({ item }) => items$
        .map(items => items.filter(node => String(node.parent_id) === String(id)))
        .switchMap(children => !children.length
            ? Observable.of([])
            : Observable
                .from(children)
                .mergeMap(child => $fromItemId(child.id))
                .toArray(),
        )
        .map(children => ({ ...item, children })),
    );


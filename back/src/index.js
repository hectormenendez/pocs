import API from 'todoist-js';
import { Observable } from 'rxjs';

import { todoist as Config } from '../config.json';

const Todoist = new API(Config.token);
const Ids = Config.labels.map(label => label.id);
const Vals = Config.labels.map(label => label.value);

const items$ = Observable
    .fromPromise(Todoist.sync())
    .map(state => state.items)
    .share();

const $fromInput = text => Observable.create((observer) => {
    process.stdout.write(`${text}\n`);
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (data) => {
        observer.next(String(data).trim());
        observer.complete();
    });
});

const $fromId = id => Observable
    .fromPromise(Todoist.items.get(id))
    .switchMap(({ item }) => items$
        .map(items => items.filter(node => String(node.parent_id) === String(id)))
        .switchMap(children => !children.length
            ? Observable.of([])
            : Observable
                .from(children)
                .mergeMap(child => $fromId(child.id))
                .toArray(),
        )
        .map(children => ({ ...item, children })),
    );

/* eslint-disable no-param-reassign, no-return-assign */
const parseItem = (item) => {
    const gomodoros = [];
    // Reset the label for this item.
    item.children.forEach((child) => {
        if (child.children.length) child = parseItem(child);
        const matches = child.labels
            .filter(label => Ids.indexOf(label) !== -1);
        if (matches.length) gomodoros.push(...matches);
    });
    if (gomodoros.length) {
        // Determine how many gomodoros the children sum
        const sum = gomodoros
            .map(gomodoro => Config.labels.filter(({ id }) => id === gomodoro)[0].value)
            .reduce((acc, cur) => acc + cur, 0);
        // Which of the label values is the closest to sum?
        let value = Vals[0];
        Vals
            .forEach(v => Math.abs(sum - v) < Math.abs(sum - value) && (value = v));
        // Set the corresponding label.
        item.labels = item.labels
            .filter(label => Ids.indexOf(label) === -1)
            .concat(Config.labels[Vals.indexOf(value)].id);
    }
    delete item.children;
    return item;
};
/* eslint-enable no-param-reassign, no-return-assign */

const input$ = $fromInput('Type the ID for the item to calculate:');

const target$ = input$
    .map(input => parseInt(input, 10))
    .switchMap(id => $fromId(id)) // get item-tree from id
    .catch(err => throw `Invalid identifier: ${err.message}`)
    .map(item => parseItem(item)) // Determine pomodoros from item-tree
    // Update the item.
    .switchMap((item) => {
        const params = { labels: item.labels };
        Todoist.items.update(item.id, params);
        return Todoist
            .commit()
            .then(() => item);
    })
    .switchMap(({ labels }) => labels.filter(id => Ids.indexOf(id) !== -1))
    .map(value => `🍎 ${Config.labels[Ids.indexOf(value)].value}`);

/* eslint-disable no-console */
target$.subscribe(
    response => console.log('Response:', response),
    error => {
        console.error('Error:', error);
        process.exit(1);
    },
    () => {
        console.log('DONE');
        process.exit(0);
    },
);
/* eslint-enable no-console */

import { Observable } from 'rxjs';

import { todoist as Config } from '../config.json';
import { Todoist, $fromInput, $fromItemId } from './utils';

const Ids = Config.labels.map(label => label.id);
const Vals = Config.labels.map(label => label.value);

/* eslint-disable no-param-reassign, no-return-assign */
const getGomodoros = (item, gomodoros = []) => {
    // populate the gomodoros traversing all the children.
    item.children.forEach((node) => {
        // if this node has children, parse them first.
        if (node.children.length) getGomodoros(node, gomodoros);
        else {
            // this node has no children, so if it has matching labels add them.
            const matches = node.labels.filter(id => Ids.indexOf(id) !== -1);
            if (matches.length) gomodoros.push(...matches);
        }
    });

    if (!gomodoros.length) return item;

    // Determine how many gomodoros the children sum
    const sum = gomodoros
        .map(gomodoro => Config.labels.filter(({ id }) => id === gomodoro)[0].value)
        .reduce((acc, cur) => acc + cur, 0);
    // Which of the label values is the closest to sum?
    const value = Vals.sort((a, b) => Math.abs(sum - a) - Math.abs(sum - b))[0];
    console.log('[ real gomodoros: %s approx: %s ]', sum, value);
    const label = Config.labels.filter(cfg => cfg.value === value).shift();
    if (!label) throw new Error(`No label found for value: ${value}`);
    // Set the corresponding label.
    return item.labels
        .filter(id => Ids.indexOf(id) === -1)
        .concat(label.id);
};
/* eslint-enable no-param-reassign, no-return-assign */

const input$ = $fromInput('Item ID to calculate Gomodoros:');

export default input$
    .map(input => parseInt(input, 10))
    .switchMap(id => $fromItemId(id)) // get item-tree from id
    // Update the item.
    .switchMap((item) => {
        const labels = getGomodoros(item);
        Todoist.items.update(item.id, { labels });
        return Observable
            .fromPromise(Todoist.commit())
            .switchMap(() => labels.filter(id => Ids.indexOf(id) !== -1));

    })
    .map(id => `🍎 ${Config.labels[Ids.indexOf(id)].value}`);


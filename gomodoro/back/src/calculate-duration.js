import { Todoist, $fromInput, $fromItemId } from './utils';

const input$ = $fromInput('Item ID to calculate duration');

const getDuration = (item, duration = { est: [], act: [] }) => {

    // populat the duration traversing all the children
    item.children.forEach((node) => {
        // get duration recursively if this item has children of its own.
        if (node.children.length) getDuration(node, duration);
        // No childrens, store duration (if available)
        else if (node.notes.length) {
            node.notes
                // iterate each note to find time notation marks.
                .map(({ content }) => content
                    .match(/\d+:\d+/g)
                    .map((text) => {
                        const [mm, ss] = text.split(':');
                        return { mm, ss };
                    }),
                )
                .filter(times => times.length === 2)
                .forEach(([est, act]) => {
                    duration.est.push(est);
                    duration.act.push(act);
                });
        }
    });

    const calculate = (target) => {
        const sum = target.reduce((acc, cur) => ({
            mm: acc.mm + parseInt(cur.mm, 10),
            ss: acc.ss + parseInt(cur.ss, 10),
        }), { mm: 0, ss: 0 });
        const hh = Math.floor(sum.mm / 60);
        const mm = (sum.mm % 60) + Math.floor(sum.ss / 60);
        const ss = (sum.ss % 60);
        return [hh, mm, ss]
            .map(time => String(time).padStart(2, '0'))
            .join(':');
    };

    const est = calculate(duration.est);
    const act = calculate(duration.act);
    return `**Estimated:** ${est} **Actual:** ${act}`;
};

export default input$
    .map(input => parseInt(input, 10))
    .switchMap(id => $fromItemId(id))
    .switchMap((item) => {
        const note = getDuration(item);
        Todoist.notes.add(item.id, note);
        return Todoist
            .commit()
            .then(() => note);
    })
    .catch((err) => {
        throw new Error(`Error updating note: ${err.message}`);
    });

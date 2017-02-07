import $ from 'xstream';
import flattenConcurrently from 'xstream/extra/flattenConcurrently';

function MVI(sources) {
    const files = ['intent', 'model', 'view.jsx'];
    return $
        .from(files)
        .map(file => $
            .fromPromise(import(`${__dirname}/../${this.type}/${this.name}/${file}`))
            .map(esmodule => ({file, default: esmodule.default}))
        )
        .compose(flattenConcurrently)
        .fold((acc, cur) =>{
            // first obtain intents using sources
            if (!acc) return cur.default(sources);
            // Send the intents to the model and obtain a state$
            if (cur.file === 'model') return cur.default(acc);
            // Pass the state into the view
            return acc.map(state => cur.default(state))
        })
        .last()
        .flatten()
}

export default function (name, type='component') {
    return MVI.bind({ type, name });
}

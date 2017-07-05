const PATH = require('path');

const Rx = require('rxjs');
const Loki = require('lokijs');
const LokiFS = require('lokijs/src/loki-fs-structured-adapter');

const loki = new Loki(PATH.join(__dirname, 'data', 'twitter.json'), {
    adapter: new LokiFS(),
    autoLoad: false,
    autoSave: false
});

const rxLoad = Rx.Observable.bindNodeCallback(loki.loadDatabase.bind(loki));

const db$ =
    // load database
    rxLoad({})
    // grab tweet collection
    .map(() => loki.getCollection('tweets'))
    // if the collection does not exist, do nothing
    .filter(Boolean);

db$.subscribe(
    si => console.log('si', si),
    no => console.log('no', no),
    () => console.log('------')
);


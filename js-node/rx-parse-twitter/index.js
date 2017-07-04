const PATH = require('path');

const Rx = require('rxjs');
const Loki = require('lokijs');
const LokiFS = require('lokijs/src/loki-fs-structured-adapter');

const loki = new Loki(PATH.join(__dirname, 'twitter.json'), {
    adapter: new LokiFS(),
    autoLoad: false,
    autoSave: false
});

const lokiLoad = Rx.Observable.bindNodeCallback(loki.loadDatabase.bind(loki));
const lokiSave = Rx.Observable.bindNodeCallback(loki.saveDatabase.bind(loki));

lokiLoad({})
    .mapTo(loki.collections)
    .subscribe(
        si => console.log('si', si),
        no => console.log('no', no),
        () => console.log('------')
    )

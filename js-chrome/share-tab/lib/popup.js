const $ = Rx.Observable;

const load$ = $.fromEvent(window, 'load');
const tab$  = load$.switchMap(e => $.bindCallback(chrome.tabs.getSelected)(null));

tab$.subscribe(
    si => { console.info('si', si) },
    no => { console.info('no', no) },
    () => { console.info('done') }
);

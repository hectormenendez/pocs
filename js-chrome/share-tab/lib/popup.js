const $ = Rx.Observable;

const rxGetSelected = $.bindCallback(chrome.tabs.getSelected);
const rxSendMessage = $.bindCallback(chrome.tabs.sendMessage);

const load$ = $.fromEvent(window, 'load');

const tab$  = load$
    .switchMap(e => rxGetSelected.call(chrome, null))
    .map(({id, title, url}) => ({id, title, url}))

const image$ = tab$.switchMap(tab => rxSendMessage.call(chrome, tab.id, {})
    .map(response => Object.assign({images:[], kwords:''}, response, tab)))

image$.subscribe(
    si => { console.info('si', si) },
    no => { console.info('no', no) },
    () => { console.info('done') }
);

const $ = Rx.Observable;

const rxGetSelected = $.bindCallback(chrome.tabs.getSelected);
const rxSendMessage = $.bindCallback(chrome.tabs.sendMessage);

const load$ = $.fromEvent(window, 'load');

const tab$  = load$
    .switchMap(e => rxGetSelected.call(chrome, null))
    .map(({id, title, url}) => ({id, title, url}))

const data$ = tab$.switchMap(tab => rxSendMessage.call(chrome, tab.id, {})
    .map(response => Object.assign({images:[], kwords:''}, response, tab)))

let domTitle, domKwords, domImgBtn, domShrBtn;

// Declarations
const setup$ = data$.switchMap(data => {
    domTitle = document.querySelector('input[name=title]');
    domKwords = document.querySelector('input[name=kwords]');
    domImages = document.querySelector('section#images');
    domImgBtn = document.querySelectorAll('aside nav div');
    domShrBtn = document.querySelector('main button');
    // Assignations
    domTitle.value = data.title;
    domKwords.value = data.kwords;
    const images = data.images.map((image, i) => {
        const domImage = document.createElement('img');
        domImage.src = image.src;
        if (!i) domImage.classList.add('curr');
        domImage.id = `image-${i}`;
        domImages.appendChild(domImage);
        return domImage;
    });
    // Events
    const ImgBtn$ = $.fromEvent(domImgBtn, 'click').do(e => {
        const dir = e.srcElement.className == 'lft'? -1 : +1;
        const img = document.querySelector('#images img.curr');
        const cur = parseInt(img.id.replace('image-', ''), 10);
        let neo = cur + dir;
        if (dir < 0 && neo < 0) neo = images.length - 1;
        else if (dir > 0 && neo >= images.length) neo = 0;
        img.classList.remove('curr');
        images[neo].classList.add('curr');
    });
    // TODO: obtain the current values and make the call
    const ShrBtn$ = $.fromEvent(domShrBtn, 'click').do(e => {
        console.info(domTitle, domKwords);
        if (!domTitle.value.length || !domKwords.value.length) {
            domShrBtn.classList.add('error');
            return setTimeout(() => domShrBtn.classList.remove('error'), 2000);
        }
        const img = document.querySelector('section#images img.curr');
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://gik.mx:8001/xare', true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.onreadystatechange = ()=> xhr.readyState == 4 && window.close();
        xhr.send(JSON.stringify({
            title  : domTitle.value,
            kwords : domKwords.value,
            image  : img.src
        }));
    })

    return $.merge(ImgBtn$, ShrBtn$);
});

setup$.subscribe(
    si => { console.info('si', si) },
    no => { console.info('no', no) },
    () => { console.info('done') }
);

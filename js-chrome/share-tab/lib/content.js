chrome.runtime.onMessage.addListener((request, sender, reply) => {
    const domImages = document.getElementsByTagName('img');
    const images = Array.prototype.slice.call(domImages)
        .map(({width,height,src}) => ({width, height, src}))
    const kwords = document.querySelector('meta[name=keywords]');
    reply({images, kwords: kwords? kwords.content : null});
    return true;
});;

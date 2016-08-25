chrome.runtime.onMessage.addListener((request, sender, reply) => {
    const images = Array.prototype.slice
        .call(document.getElementsByTagName('img'))
        .map(({width,height,src}) => ({width, height, src}))
    const kwords = document.querySelector('meta[name=keywords]').content;
    reply({images, kwords});
    return true;
});

chrome.runtime.onMessage.addListener((request, sender, reply) => {
    // search for images or videos with a poster.
    const domImages = document.getElementsByTagName('img');
    const domVideos = document.querySelectorAll('video[poster]');
    const videos = Array.prototype.slice.call(domVideos)
        .map(({poster, offsetHeight, offsetWidth}) => ({
            src    : poster,
            width  : offsetWidth,
            height : offsetHeight
        }));
    const images = Array.prototype.slice.call(domImages)
        .map(({width,height,src}) => ({width, height, src}))
        .concat(videos);
    const kwords = document.querySelector('meta[name=keywords]');
    reply({images, kwords: kwords? kwords.content : null});
    return true;
});;

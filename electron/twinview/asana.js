window.onload = function(){
    // main tasks body
    const body = document.querySelector('.asanaView-body');
    body.style.paddingTop = 0;
    body.style.border = "1px solid #EEE";
    // Bars on top
    document.querySelector('.lunaUiMyTasksPageHeaderView-mountNode').remove();
    document.querySelector('.remix-topbar').remove();
    // all invisible gutters surrounding the main view
    for (let el of document.querySelectorAll('.asanaView-paneGutter')) el.remove();
    // The top bar that allows to sort and create tasks
    const topbar = document.querySelector('.GridHeaderWithCustomProperties');
    const topbarButton = topbar.querySelector('.GridHeaderWithCustomProperties-left');
    topbar.style.position = 'absolute';
    topbar.style.bottom = '0';
    topbar.style.width = '100%';
    topbar.style.backgroundColor = 'rgba(0,0,0,0)';
    topbar.style.backgroundImage = `linear-gradient(
        to top,
        rgba(255,255,255,1) 50%,
        rgba(255,255,255,0) 100%
    )`;
    topbar.style.paddingLeft = '0';
    topbarButton.style.paddingLeft = '30px';
}

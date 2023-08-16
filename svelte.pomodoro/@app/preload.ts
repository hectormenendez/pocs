// All of node APIs are available here.
// it has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", function () {
    ["chrome", "node", "electron"].forEach((type) => {
        const el = document.getElementById(`${type}-version`);
        if (!el) return;
        const version = process.versions[type];
        if (!version) return;
        el.innerText = version;
    });
});

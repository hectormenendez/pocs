import { app, BrowserWindow } from "electron";

import { WIN_WIDTH, WIN_HEIGHT, PATH_PRELOAD, IS_PRODUCTION, WWW_LOCATION } from "./constants";

app.on("ready", handleWindowCreate);
app.on("activate", handleActivate);
app.on("window-all-closed", handleWindowAllClosed);

function handleActivate() {
    if (BrowserWindow.getAllWindows().length) return;
    handleWindowCreate();
}

function handleWindowAllClosed() {
    if (process.platform === "darwin") return;
    app.quit();
}

function handleWindowCreate() {
    const win = new BrowserWindow({
        height: WIN_HEIGHT,
        width: WIN_WIDTH,
        webPreferences: {
            preload: PATH_PRELOAD,
            contextIsolation: true,
        },
    });

    win.setMenu(null);

    const loader = WWW_LOCATION.startsWith("http") ? win.loadURL.bind(win) : win.loadFile.bind(win);
    loader(WWW_LOCATION)
        .then(() => {
            if (!IS_PRODUCTION) win.webContents.openDevTools();
        })
        .catch((err) => {
            console.error((err as Error).message);
            process.exit(1);
        });
}

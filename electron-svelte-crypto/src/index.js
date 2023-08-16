import {app as App, Menu, BrowserWindow } from "electron";

import MenuTemplate from "./app/menu";
import { Build, Join, ROOT, LEVEL_SUB, INDEX_HTML } from "/etc/path";
import { Settings, Handler } from "./app/settings";
import { WINDOW_BOUNDS } from "./app/constants";

let Window; // keep a reference to avoid closing the Window when garbage collected

const Path = Build(ROOT, LEVEL_SUB);

App.commandLine.appendSwitch("--enable-experimental-web-platform-features");

function handleBounds() {
    if (this._timeoutBoundsHandler) clearTimeout(this._timeoutBoundsHandler);
    this._timeoutBoundsHandler = setTimeout(() => {
        this._timeoutBoundsHandler = undefined;
        const bounds = this.getNormalBounds();
        console.log(WINDOW_BOUNDS, bounds);
        Handler.set(WINDOW_BOUNDS, bounds);
    }, 1000);
}

App.on("ready", () => {
    // Create the window
    const settings = Settings.BrowserWindow;
    Window = new BrowserWindow(settings);

    Window.loadFile(Join(Path.FRONT, INDEX_HTML));

    Window.once("ready-to-show", () => {
        Window.show()
        // TODO: Remove this
        Window.webContents.openDevTools()
    });
    Window.once("closed", () => (Window = null));

    Window.on("resize", handleBounds.bind(Window));
    Window.on("move", handleBounds.bind(Window));

    Menu.setApplicationMenu(MenuTemplate);
});

App.on("window-all-closed", () => App.quit());
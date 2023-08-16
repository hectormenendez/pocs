import ElectronConfig from "electron-config";
import { screen as Screen } from "electron";

import { WINDOW_BOUNDS } from "./constants";

export const Handler = new ElectronConfig();

export const Settings = {
    get BrowserWindow() {
        const defaults = {
            show: false,
            x: 0,
            y: 0,
            width: 800,
            height: 600,
            titleBarStyle: 'hiddenInset',
            webPreferences: {
                nodeIntegration: true,
                nodeIntegrationInWorker: true,
                contextIsolation: false,
                experimentalFeatures: true,
                webviewTag: true,
                webSecurity:false,
            },
        };
        // If there are previously defined measurements for the app, use them instead.
        const bounds =
            Handler.get(WINDOW_BOUNDS) ||
            (({ x, y, width, height }) => ({ x, y, width, height }))(defaults);
        const { workArea: area } = Screen.getDisplayMatching(bounds);
        const isValidPosition = [
            bounds.x >= area.x,
            bounds.y >= area.y,
            bounds.x + bounds.width <= area.x + area.width,
            bounds.y + bounds.height <= area.y + area.height,
        ].every(Boolean);
        const isValidSize =
            [bounds.width <= area.width, bounds.height <= area.height].filter(Boolean).length > 0;
        return {
            ...defaults,
            ...((isValidPosition && { x: bounds.x, y: bounds.y }) || {}),
            ...((isValidSize && { width: bounds.width, height: bounds.height }) || {}),
        };
    },
};

export default Settings;
import { contextBridge, ipcRenderer } from "electron";
import { preloadBindings } from "i18next-electron-fs-backend";

import type { Config } from "@main/config/models/config.dto";

contextBridge.exposeInMainWorld("ipcRenderer", {
    on: (channel: string, listener: (...args: any[]) => void) => {
        ipcRenderer.on(channel, listener);
    },

    send: (channel: string, ...args: any[]) => {
        ipcRenderer.send(channel, ...args);
    },

    removeListener: (channel: string, listener: (...args: any[]) => void) => {
        ipcRenderer.removeListener(channel, listener);
    },
});

contextBridge.exposeInMainWorld("app", {
    getPreferredSystemLanguages: () => {
        return new Promise<string[]>(res => {
            ipcRenderer.once("getPreferredSystemLanguages", (event, languages) => {
                res(languages);
            });

            ipcRenderer.send("getPreferredSystemLanguages");
        });
    },

    getConfig: () => {
        return new Promise<Config>(res => {
            ipcRenderer.once("getConfig", (event, args) => {
                res(args);
            });

            ipcRenderer.send("getConfig");
        });
    },
});

contextBridge.exposeInMainWorld("api", {
    i18nextElectronBackend: preloadBindings(ipcRenderer, process),
});

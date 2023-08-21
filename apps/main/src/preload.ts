import { contextBridge, ipcRenderer } from "electron";
import { preloadBindings } from "i18next-electron-fs-backend";
import type { ConfigType } from "@config/config.service";

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
contextBridge.exposeInMainWorld("api", {
    i18nextElectronBackend: preloadBindings(ipcRenderer, process),
});

contextBridge.exposeInMainWorld("appBridge", {
    getConfig: () => {
        return new Promise<ConfigType>(res => {
            ipcRenderer.once("getConfig", (event, args) => {
                res(args);
            });

            ipcRenderer.send("getConfig");
        });
    },
});

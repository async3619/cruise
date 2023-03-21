import * as path from "path";
import * as os from "os";
import { app, BrowserWindow, dialog, protocol, OpenDialogOptions } from "electron";
import { createIPCHandler } from "electron-trpc/main";

import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import { Injectable, OnModuleInit } from "@nestjs/common";

import { router } from "@main/api";

const mainDistPath = path.join(__dirname, "../");
const distPath = path.join(mainDistPath, "../dist");
const publicPath = process.env.VITE_DEV_SERVER_URL ? path.join(mainDistPath, "../public") : distPath;

interface SelectPathOptions<TMultiple extends boolean> extends Omit<OpenDialogOptions, "properties"> {
    multiple: TMultiple;
    directory: boolean;
}
type SelectPathResult<TMultiple extends boolean> = TMultiple extends true ? string[] : string;

@Injectable()
export class ElectronService implements OnModuleInit {
    private mainWindow: BrowserWindow | null = null;

    public async onModuleInit() {
        if (os.release().startsWith("6.1")) {
            app.disableHardwareAcceleration();
        }

        if (process.platform === "win32") {
            app.setAppUserModelId(app.getName());
        }

        if (!app.requestSingleInstanceLock()) {
            app.quit();
            process.exit(0);
        }

        await app.whenReady();
        this.onAppReady();
    }
    private async onAppReady() {
        // Set app user model id for windows
        electronApp.setAppUserModelId("com.electron");

        // Default open or close DevTools by F12 in development
        // and ignore CommandOrControl + R in production.
        // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
        app.on("browser-window-created", (_, window) => {
            optimizer.watchWindowShortcuts(window);
        });

        this.mainWindow = await this.createWindow();

        app.on("activate", async () => {
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (BrowserWindow.getAllWindows().length === 0) {
                this.mainWindow = await this.createWindow();
            }
        });
    }

    private async createWindow() {
        protocol.registerFileProtocol("cruise", (request, callback) => {
            callback({
                path: decodeURIComponent(request.url.slice("cruise://".length)),
            });
        });

        const window = new BrowserWindow({
            title: "Main window",
            icon: path.join(publicPath, "favicon.ico"),
            frame: false,
            width: 1300,
            height: 800,
            webPreferences: {
                preload: path.join(__dirname, "../preload/index.js"),
                nodeIntegration: true,
                contextIsolation: true,
            },
        });

        if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
            await window.loadURL(process.env["ELECTRON_RENDERER_URL"]);
        } else {
            await window.loadFile(path.join(__dirname, "../renderer/index.html"));
        }

        createIPCHandler({
            router,
            windows: [window],
            createContext: async ({ event }) => {
                return {
                    window: BrowserWindow.fromWebContents(event.sender),
                };
            },
        });

        return window;
    }

    public async selectPath<TMultiple extends boolean>(
        options: SelectPathOptions<TMultiple>,
    ): Promise<SelectPathResult<TMultiple> | null> {
        if (!this.mainWindow) {
            throw new Error("Main window is not ready");
        }

        const { multiple, directory, ...rest } = options;
        const openDialogOptions: OpenDialogOptions = {
            properties: directory ? ["openDirectory"] : ["openFile"],
            ...rest,
        };

        if (multiple) {
            openDialogOptions.properties?.push("multiSelections");
        }

        const result = await dialog.showOpenDialog(this.mainWindow, openDialogOptions);
        if (result.canceled) {
            return null;
        }

        if (multiple) {
            return result.filePaths as SelectPathResult<TMultiple>;
        }

        return result.filePaths[0] as SelectPathResult<TMultiple>;
    }
}

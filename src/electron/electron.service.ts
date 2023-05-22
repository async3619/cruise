import * as path from "path";
import * as os from "os";
import fs from "fs-extra";
import { app, BrowserWindow, dialog, ipcMain, IpcMainEvent, OpenDialogOptions, protocol, session } from "electron";
import decompress from "decompress";
import { mainBindings } from "i18next-electron-fs-backend";

import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";

import { MAXIMIZED_STATE_CHANGED } from "@main/electron/electron.constants";
import { SelectPathInput } from "@main/electron/models/select-path.dto";

import { ConfigService } from "@main/config/config.service";

import { REACT_DEVTOOLS_DIR, REACT_DEVTOOLS_PATH } from "@main/constants";
import pubSub from "@main/pubsub";

import type { Nullable } from "@common/types";

const mainDistPath = path.join(__dirname, "../");
const distPath = path.join(mainDistPath, "../dist");
const publicPath = process.env.VITE_DEV_SERVER_URL ? path.join(mainDistPath, "../public") : distPath;

@Injectable()
export class ElectronService implements OnModuleInit {
    private mainWindow: BrowserWindow | null = null;

    public constructor(@Inject(ConfigService) private readonly configService: ConfigService) {}

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

        ipcMain.on("getPreferredSystemLanguages", this.onGetPreferredSystemLanguages);
        ipcMain.on("getConfig", this.onGetConfig);
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
        this.mainWindow.on("maximize", () => {
            pubSub.publish(MAXIMIZED_STATE_CHANGED, {
                maximizedStateChanged: true,
            });
        });

        this.mainWindow.on("unmaximize", () => {
            pubSub.publish(MAXIMIZED_STATE_CHANGED, {
                maximizedStateChanged: false,
            });
        });

        app.on("activate", async () => {
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (BrowserWindow.getAllWindows().length === 0) {
                this.mainWindow = await this.createWindow();
            }
        });
    }

    public isMaximized() {
        if (!this.mainWindow) {
            throw new Error("Main window is not ready");
        }

        return this.mainWindow.isMaximized();
    }

    public maximize() {
        if (!this.mainWindow) {
            throw new Error("Main window is not ready");
        }

        if (this.mainWindow.isMaximized()) {
            this.mainWindow.unmaximize();
        } else {
            this.mainWindow.maximize();
        }

        return true;
    }
    public minimize() {
        if (!this.mainWindow) {
            throw new Error("Main window is not ready");
        }

        this.mainWindow.minimize();
        return true;
    }
    public async close() {
        if (!this.mainWindow) {
            throw new Error("Main window is not ready");
        }

        const [x, y] = this.mainWindow.getPosition();
        const [width, height] = this.mainWindow.getSize();

        await this.configService.setConfig(config => ({
            ...config,
            lastPosition: {
                x,
                y,
                width,
                height,
            },
        }));

        this.mainWindow.close();

        return true;
    }

    private async createWindow() {
        protocol.registerFileProtocol("cruise", (request, callback) => {
            callback({
                path: decodeURIComponent(request.url.slice("cruise://".length)),
            });
        });

        if (is.dev) {
            if (!fs.existsSync(REACT_DEVTOOLS_DIR)) {
                await decompress(REACT_DEVTOOLS_PATH, REACT_DEVTOOLS_DIR);
            }

            await session.defaultSession.loadExtension(REACT_DEVTOOLS_DIR);

            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const devtools = require("electron-devtools-installer");

            await devtools.default([devtools.APOLLO_DEVELOPER_TOOLS]);
        }

        const config = await this.configService.getConfig();
        const window = new BrowserWindow({
            title: "Main window",
            icon: path.join(publicPath, "favicon.ico"),
            frame: false,
            ...config.lastPosition,
            width: 1300,
            height: 800,
            minWidth: 500,
            webPreferences: {
                preload: path.join(__dirname, "../preload.js"),
                nodeIntegration: true,
                contextIsolation: true,
                devTools: true,
            },
        });

        if (is.dev) {
            window.webContents.openDevTools({
                mode: "bottom",
            });
        }

        if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
            await window.loadURL(process.env["ELECTRON_RENDERER_URL"]);
        } else {
            await window.loadFile("./out/renderer/index.html");
        }

        mainBindings(ipcMain, window, fs);

        return window;
    }

    private onGetPreferredSystemLanguages = (e: IpcMainEvent) => {
        const locales = app.getPreferredSystemLanguages();
        e.reply("getPreferredSystemLanguages", locales);
    };

    private onGetConfig = async (e: IpcMainEvent) => {
        const config = await this.configService.getConfig();
        e.reply("getConfig", config);
    };

    public async selectPath(options: Nullable<SelectPathInput>): Promise<Nullable<string[]>> {
        if (!this.mainWindow) {
            throw new Error("Main window is not ready");
        }

        const { directory, filters, multiple } = options || {};
        const openDialogOptions: OpenDialogOptions = {
            properties: directory ? ["openDirectory"] : ["openFile"],
            filters: filters || [],
        };

        if (multiple) {
            openDialogOptions.properties?.push("multiSelections");
        }

        const result = await dialog.showOpenDialog(this.mainWindow, openDialogOptions);
        if (result.canceled) {
            return null;
        }

        return result.filePaths;
    }

    public getLocales() {
        return app.getPreferredSystemLanguages();
    }
}

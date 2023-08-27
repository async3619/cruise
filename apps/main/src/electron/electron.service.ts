import os from "os";
import { app, BrowserWindow, ipcMain, protocol, net } from "electron";
import * as path from "path";
import { PubSub } from "graphql-subscriptions";
import fs from "fs-extra";
import { clearMainBindings, mainBindings } from "i18next-electron-fs-backend";

import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { electronApp, is, optimizer } from "@electron-toolkit/utils";

import { ConfigService, ConfigType } from "@config/config.service";

import { BaseEventMap, EventEmitter } from "@utils/event-emitter";
import { ROOT_PATH } from "@root/constants";

export const windowPubSub = new PubSub();

interface ElectronEventMap extends BaseEventMap {
    "window-all-closed": () => void;
}

@Injectable()
export class ElectronService extends EventEmitter<ElectronEventMap> implements OnApplicationBootstrap {
    private mainWindow: BrowserWindow | null = null;
    private lastWindowState: ConfigType["windowState"] | null = null;

    public constructor(@Inject(ConfigService) private readonly configService: ConfigService) {
        super();
    }

    public getMainWindow(): BrowserWindow {
        if (!this.mainWindow) {
            throw new Error("Main window is not ready");
        }

        return this.mainWindow;
    }

    public async onApplicationBootstrap() {
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
        await this.onAppReady();

        ipcMain.on("getConfig", this.onGetConfig.bind(this));
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

    private async onWindowAllClosed() {
        if (this.lastWindowState) {
            await this.configService.setConfig({
                windowState: this.lastWindowState,
            });
        }

        clearMainBindings(ipcMain);
        this.emit("window-all-closed");
    }
    private async onClose() {
        if (!this.mainWindow) {
            return;
        }

        const { x, y, width, height } = this.mainWindow.getBounds();
        const isMaximized = this.mainWindow.isMaximized();

        this.lastWindowState = {
            isMaximized,
            x,
            y,
            width,
            height,
        };
    }
    private async onGetConfig(event: Electron.IpcMainEvent) {
        const config = await this.configService.getConfig();
        event.reply("getConfig", config);
    }

    private async createWindow() {
        const config = await this.configService.getConfig();
        const window = new BrowserWindow({
            title: "Main window",
            x: config.windowState?.x,
            y: config.windowState?.y,
            width: config.windowState?.width ?? 1300,
            height: config.windowState?.height ?? 800,
            frame: false,
            minWidth: 500,
            webPreferences: {
                preload:
                    process.env.NODE_ENV === "production"
                        ? path.join(__dirname, "preload.js")
                        : path.join(__dirname, "..", "preload.js"),
                nodeIntegration: true,
                contextIsolation: true,
            },
        });

        app.on("window-all-closed", this.onWindowAllClosed.bind(this));

        protocol.handle("cruise", async request => {
            let targetPath = request.url.slice("cruise://".length);
            targetPath = `./${targetPath}`;
            targetPath = path.join(ROOT_PATH, targetPath);

            return net.fetch(`file://${targetPath}`);
        });

        protocol.registerFileProtocol("music", (request, callback) => {
            callback({
                path: decodeURIComponent(request.url.slice("music://".length)),
            });
        });

        window.on("close", this.onClose.bind(this));
        window.on("maximize", () => {
            windowPubSub.publish("maximizedStateChanged", {
                maximizedStateChanged: true,
            });
        });
        window.on("unmaximize", () => {
            windowPubSub.publish("maximizedStateChanged", {
                maximizedStateChanged: false,
            });
        });

        if (is.dev) {
            window.webContents.openDevTools({
                mode: "bottom",
            });
        }

        if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
            await window.loadURL(process.env["ELECTRON_RENDERER_URL"]);
        } else {
            await window.loadFile("./renderer/index.html");
        }

        mainBindings(ipcMain, window, fs);

        return window;
    }

    public async getElectronUrl(targetPath: string) {
        // check if path is in ROOT_PATH
        if (targetPath.startsWith(ROOT_PATH)) {
            const relativePath = path.relative(ROOT_PATH, targetPath);

            return `cruise:///${relativePath.replace(/\\/g, "/")}`;
        } else {
            throw new Error(`Path \`${targetPath}\` is not in ROOT_PATH`);
        }
    }
}

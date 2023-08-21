import os from "os";
import { BrowserWindow, app } from "electron";
import * as path from "path";
import { PubSub } from "graphql-subscriptions";

import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { electronApp, is, optimizer } from "@electron-toolkit/utils";

import { ConfigService } from "@config/config.service";

export const windowPubSub = new PubSub();

@Injectable()
export class ElectronService implements OnApplicationBootstrap {
    private mainWindow: BrowserWindow | null = null;

    public constructor(@Inject(ConfigService) private readonly configService: ConfigService) {}

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

    private async onClose() {
        if (!this.mainWindow) {
            return;
        }

        const { x, y, width, height } = this.mainWindow.getBounds();
        const isMaximized = this.mainWindow.isMaximized();

        await this.configService.setConfig({
            windowState: {
                isMaximized,
                x,
                y,
                width,
                height,
            },
        });
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
                nodeIntegration: false,
                contextIsolation: true,
            },
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

        return window;
    }
}

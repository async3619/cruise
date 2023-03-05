import { app, BrowserWindow, shell, ipcMain } from "electron";
import { createIPCHandler } from "electron-trpc/main";

import { printSchema } from "graphql";
import { release } from "node:os";
import { join } from "node:path";
import * as path from "path";
import * as fs from "fs-extra";

import { initializeDatabase, initializeSchema } from "@main/library";
import { createIpcExecutor, createSchemaLink } from "@main/graphql/server";
import { router } from "@main/api";

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
const mainDistPath = join(__dirname, "../");
const distPath = join(mainDistPath, "../dist");
const publicPath = process.env.VITE_DEV_SERVER_URL ? join(mainDistPath, "../public") : distPath;

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
    app.quit();
    process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, "./preload.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(distPath, "index.html");

async function createWindow() {
    win = new BrowserWindow({
        title: "Main window",
        icon: join(publicPath, "favicon.ico"),
        frame: false,
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: true,
        },
    });

    if (url) {
        // electron-vite-vue#298
        win.loadURL(url);
        // Open devTool if the app is not packaged
        win.webContents.openDevTools({
            mode: "undocked",
        });
    } else {
        win.loadFile(indexHtml);
    }

    // Test actively push message to the Electron-Renderer
    win.webContents.on("did-finish-load", () => {
        win?.webContents.send("main-process-message", new Date().toLocaleString());
    });

    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith("https:")) shell.openExternal(url);
        return { action: "deny" };
    });

    const dataSource = await initializeDatabase();
    const schema = await initializeSchema(dataSource);
    const schemaFileData = printSchema(schema);

    if (process.env.NODE_ENV === "development") {
        await fs.writeFile(path.join(process.cwd(), "schema.graphql"), schemaFileData);
    }

    await initializeDatabase();

    const link = createSchemaLink({ schema, context: () => ({}) });
    createIpcExecutor({ link, ipc: ipcMain });

    createIPCHandler({
        router,
        windows: [win],
        createContext: async ({ event }) => {
            return {
                window: BrowserWindow.fromWebContents(event.sender),
            };
        },
    });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    win = null;
    if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
    if (win) {
        // Focus on the main window if the user tried to open another
        if (win.isMinimized()) win.restore();
        win.focus();
    }
});

app.on("activate", () => {
    const allWindows = BrowserWindow.getAllWindows();
    if (allWindows.length) {
        allWindows[0].focus();
    } else {
        createWindow();
    }
});

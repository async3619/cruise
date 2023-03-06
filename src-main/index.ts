import { app, BrowserWindow, shell, ipcMain, protocol } from "electron";
import { createIPCHandler } from "electron-trpc/main";

import { printSchema } from "graphql";
import { release } from "node:os";
import { join } from "node:path";
import * as path from "path";
import * as fs from "fs-extra";
import URL from "url";
import { Container } from "typedi";

import { createIpcExecutor, createSchemaLink } from "@main/graphql/server";
import { initializeSchema } from "@main/graphql/schema";

import { router } from "@main/api";

import { initializeDatabase } from "@main/database";

import { createGraphQLContext } from "@main/graphql/context";
import ArtistService from "@main/artist/artist.service";
import AlbumService from "@main/album/album.service";
import MusicService from "@main/music/music.service";

const mainDistPath = join(__dirname, "../");
const distPath = join(mainDistPath, "../dist");
const publicPath = process.env.VITE_DEV_SERVER_URL ? join(mainDistPath, "../public") : distPath;

if (release().startsWith("6.1")) {
    app.disableHardwareAcceleration();
}

if (process.platform === "win32") {
    app.setAppUserModelId(app.getName());
}

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
    protocol.registerFileProtocol("cruise", (request, callback) => {
        const filePath = URL.fileURLToPath(`file://${request.url.slice("cruise://".length)}`);
        callback(filePath);
    });

    win = new BrowserWindow({
        title: "Main window",
        icon: join(publicPath, "favicon.ico"),
        frame: false,
        width: 1300,
        height: 800,
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

    const link = createSchemaLink({
        schema,
        context: createGraphQLContext(
            win,
            Container.get(ArtistService),
            Container.get(AlbumService),
            Container.get(MusicService),
        ),
    });
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

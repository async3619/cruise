import { app, BrowserWindow, ipcMain, protocol } from "electron";
import { createIPCHandler } from "electron-trpc/main";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";

import { printSchema } from "graphql";
import { release } from "node:os";
import { join } from "node:path";
import * as path from "path";
import * as fs from "fs-extra";
import { Container } from "typedi";

import { createIpcExecutor, createSchemaLink } from "@main/graphql/server";
import { initializeSchema } from "@main/graphql/schema";

import { router } from "@main/api";

import { initializeDatabase } from "@main/database";

import { createGraphQLContext } from "@main/graphql/context";
import ArtistService from "@main/artist/artist.service";
import AlbumService from "@main/album/album.service";
import MusicService from "@main/music/music.service";
import AlbumArtService from "@main/album-art/album-art.service";

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

let win: BrowserWindow | null = null;

async function createWindow() {
    protocol.registerFileProtocol("cruise", (request, callback) => {
        callback({
            path: decodeURIComponent(request.url.slice("cruise://".length)),
        });
    });

    win = new BrowserWindow({
        title: "Main window",
        icon: join(publicPath, "favicon.ico"),
        frame: false,
        width: 1300,
        height: 800,
        webPreferences: {
            preload: join(__dirname, "../preload/index.js"),
            nodeIntegration: true,
            contextIsolation: true,
        },
    });

    if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
        win.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    } else {
        win.loadFile(join(__dirname, "../renderer/index.html"));
    }

    const dataSource = await initializeDatabase();
    const schema = await initializeSchema(dataSource);
    const schemaFileData = printSchema(schema);

    if (process.env.NODE_ENV === "development") {
        await fs.writeFile(path.join(process.cwd(), "schema.graphql"), schemaFileData);
    }

    const link = createSchemaLink({
        schema,
        context: createGraphQLContext(
            win,
            Container.get(ArtistService),
            Container.get(AlbumService),
            Container.get(MusicService),
            Container.get(AlbumArtService),
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

app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId("com.electron");

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on("browser-window-created", (_, window) => {
        optimizer.watchWindowShortcuts(window);
    });

    createWindow();

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

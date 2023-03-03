import { app, BrowserWindow } from "electron";

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        webPreferences: {},
    });

    win.webContents.openDevTools({
        mode: "undocked",
    });

    win.loadURL("http://localhost:1420");
}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

let callback: (() => void) | null = null;
app.on("window-all-closed", () => {
    if (callback) {
        callback();
    }

    if (process.platform !== "darwin") {
        app.quit();
    }
});

module.exports = (cb: () => void) => {
    callback = cb;
};

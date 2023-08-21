import React from "react";
import ReactDOM from "react-dom/client";

import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import backend from "i18next-electron-fs-backend";

import { App } from "@components/App";

i18next
    .use(backend)
    .use(initReactI18next)
    .init({
        backend: {
            loadPath: "../../locales/{{lng}}/{{ns}}.json",
            addPath: "../../locales/{{lng}}/{{ns}}.missing.json",
            contextBridgeApiKey: "api", // needs to match first parameter of contextBridge.exposeInMainWorld in preload file; defaults to "api"
        },

        // other options you might configure
        debug: true,
        saveMissing: true,
        saveMissingTo: "current",
        lng: "en",
    });

const container = document.getElementById("app");
if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(<App />);
}

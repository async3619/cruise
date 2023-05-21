import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import i18nBackend from "i18next-electron-fs-backend";

import "locales/ko/translation.json";

(async () => {
    const languages = await window.app.getPreferredSystemLanguages();

    await i18n
        .use(i18nBackend)
        .use(initReactI18next)
        .init({
            backend: {
                loadPath: "./locales/{{lng}}/{{ns}}.json",
                addPath: "./locales/{{lng}}/{{ns}}.missing.json",
                ipcRenderer: window.api.i18nextElectronBackend, // important!
            },

            // other options you might configure
            debug: true,
            ns: ["translation"],
            defaultNS: "translation",
            saveMissing: true,
            saveMissingTo: "current",
            lng: languages[0],
        });
})();

export default i18n;

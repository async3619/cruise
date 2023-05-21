import "@emotion/react";
import "i18next";

import type { Config } from "@main/config/models/config.dto";

import { experimental_extendTheme as extendTheme } from "@mui/material/styles";

import ns1 from "locales/ko/translation.json";

declare module "@emotion/react" {
    export interface Theme extends ReturnType<typeof extendTheme> {}
}

declare module "i18next" {
    // Extend CustomTypeOptions
    interface CustomTypeOptions {
        // custom namespace type, if you changed it
        defaultNS: "ns1";
        // custom resources type
        resources: {
            ns1: typeof ns1;
        };
        // other
    }
}

declare global {
    interface Window {
        api: {
            i18nextElectronBackend: any;
        };
        app: {
            getPreferredSystemLanguages: () => Promise<string[]>;
            getConfig: () => Promise<Config>;
        };
    }
}

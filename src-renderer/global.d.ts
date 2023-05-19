import "@emotion/react";

import { experimental_extendTheme as extendTheme } from "@mui/material/styles";

declare module "@emotion/react" {
    export interface Theme extends ReturnType<typeof extendTheme> {}
}

// import the original type declarations
import "i18next";
// import all namespaces (for the default language, only)
import ns1 from "locales/en/translation.json";

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

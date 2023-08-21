import "i18next";

import ns1 from "../../../locales/ko/translation.json";

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

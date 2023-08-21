import { ConfigData } from "@utils/types";

declare global {
    interface Window {
        appBridge: {
            getConfig: () => Promise<ConfigData>;
        };
    }
}

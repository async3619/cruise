// This file was generated by [tauri-specta](https://github.com/oscartbeaumont/tauri-specta). Do not edit this file manually.

declare global {
    interface Window {
        __TAURI_INVOKE__<T>(cmd: string, args?: Record<string, unknown>): Promise<T>;
    }
}

const invoke = window.__TAURI_INVOKE__;

export function getConfig() {
    return invoke<Config>("get_config")
}

export function setConfig(config: Config) {
    return invoke<Config>("set_config", { config })
}

export type Config = { library_directory: string[]; app_theme: AppTheme }
export type AppTheme = "Light" | "Dark" | "System"

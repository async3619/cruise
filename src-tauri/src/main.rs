// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod config;
mod library;

use crate::config::Config;
use specta::collect_types;
use tauri::Manager;
use tauri_specta::ts;
use window_shadows::set_shadow;

#[tauri::command]
#[specta::specta]
fn get_config() -> Result<Config, String> {
    let config = config::get_config()?;

    Ok(config)
}

#[tauri::command]
#[specta::specta]
fn set_config(config: Config) -> Result<Config, String> {
    let config = config::set_config(config)?;

    Ok(config)
}

fn export_bindings() {
    #[cfg(debug_assertions)]
    ts::export(collect_types![get_config, set_config], "../src/bindings.ts").unwrap();
}

fn main() {
    export_bindings();

    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();

            #[cfg(any(windows, target_os = "macos"))]
            set_shadow(&window, true).unwrap();

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_config, set_config])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

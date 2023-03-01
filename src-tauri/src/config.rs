#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use specta::Type;
use std::fs;
use std::path::PathBuf;
use tauri::api::path;

#[derive(Serialize, Deserialize, Type, Debug)]
pub enum AppTheme {
    Light,
    Dark,
    System,
}

impl Default for AppTheme {
    fn default() -> Self {
        AppTheme::System
    }
}

#[derive(Serialize, Deserialize, Type, Debug)]
pub struct Config {
    library_directory: Vec<String>,

    #[serde(default)]
    app_theme: AppTheme,
}

fn initialize_config() -> Result<Config, String> {
    let mut config = Config {
        library_directory: Vec::new(),
        app_theme: AppTheme::System,
    };

    let music_directory = match path::audio_dir() {
        Some(path) => path,
        None => {
            println!("Error: Could not find music directory");
            return Err("Could not find music directory".to_string());
        }
    };

    config
        .library_directory
        .push(music_directory.to_str().unwrap().to_string());

    Ok(config)
}

fn read_config() -> Result<Config, String> {
    let home_directory = match path::home_dir() {
        Some(path) => path,
        None => {
            println!("Error: Could not find home directory");
            return Err("Could not find home directory".to_string());
        }
    };

    let path = PathBuf::from(home_directory);
    let path = path.join(".cruise");

    // ensure config directory exists
    fs::create_dir_all(&path).map_err(|err| err.to_string())?;

    let path = path.join("config.json");

    // check if config file exists
    if !path.exists() {
        // write default config file
        let config = initialize_config()?;
        let config_json = serde_json::to_string(&config).unwrap();
        println!("{} {}", config_json, path.to_str().unwrap());

        // create and write to config file
        fs::write(&path, config_json).map_err(|err| err.to_string())?;
    }

    // read config file
    let config_json = fs::read_to_string(&path).map_err(|err| err.to_string())?;

    // parse config file
    let config: Config = serde_json::from_str(&config_json).map_err(|err| err.to_string())?;

    Ok(config)
}
fn write_config(config: Config) -> Result<Config, String> {
    let config_json = serde_json::to_string(&config).unwrap();
    let home_directory = match path::home_dir() {
        Some(path) => path,
        None => {
            println!("Error: Could not find home directory");
            return Err("Could not find home directory".to_string());
        }
    };

    let path = PathBuf::from(home_directory);
    let path = path.join(".cruise");

    // ensure config directory exists
    fs::create_dir_all(&path).map_err(|err| err.to_string())?;

    let path = path.join("config.json");

    // delete if config file already exists
    if path.exists() {
        fs::remove_file(&path).map_err(|err| err.to_string())?;
    }

    // create and write to config file
    fs::write(&path, config_json).map_err(|err| err.to_string())?;

    Ok(config)
}

pub fn get_config() -> Result<Config, String> {
    let config = read_config()?;
    println!("Get Config: {:?}", config);

    Ok(config)
}

pub fn set_config(config: Config) -> Result<Config, String> {
    let config = write_config(config)?;
    println!("Set Config: {:?}", config);

    Ok(config)
}

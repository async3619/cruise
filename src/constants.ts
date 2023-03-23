import * as path from "path";
import * as os from "os";

export const CONFIG_FILE_PATH = path.join(os.homedir(), ".cruise", "config.json");
export const CONFIG_FILE_DIR = path.join(os.homedir(), ".cruise");

export const SQLITE_DATABASE_PATH = path.join(os.homedir(), ".cruise", "database.sqlite");
export const SQLITE_DATABASE_DIR = path.join(os.homedir(), ".cruise");

export const ALBUM_ART_DIR = path.join(os.homedir(), ".cruise", "album-arts");

export const EXTENSIONS_DIR = path.join(process.cwd(), "extensions");
export const REACT_DEVTOOLS_PATH = path.join(EXTENSIONS_DIR, "react-devtools.zip");
export const REACT_DEVTOOLS_DIR = path.join(EXTENSIONS_DIR, "react-devtools");

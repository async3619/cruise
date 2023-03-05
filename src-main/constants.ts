import * as os from "os";
import * as path from "path";

export const INTERNAL_ROOT_PATH = path.join(os.homedir(), ".cruise");
export const CONFIG_FILE_PATH = path.join(INTERNAL_ROOT_PATH, "config.json");
export const CONFIG_FILE_DIR = INTERNAL_ROOT_PATH;

export const DATABASE_PATH = path.join(INTERNAL_ROOT_PATH, "database.sqlite");

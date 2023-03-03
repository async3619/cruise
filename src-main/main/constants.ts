import * as os from "os";
import * as path from "path";

export const CONFIG_FILE_PATH = path.join(os.homedir(), ".cruise", "config.json");
export const CONFIG_FILE_DIR = path.dirname(CONFIG_FILE_PATH);

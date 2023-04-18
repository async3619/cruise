import chalk from "chalk";
import fs from "fs-extra";
import path from "path";

import { logger } from "./utils/logger";

export async function clean() {
    const outDir = path.join(process.cwd(), "out");
    if (!fs.existsSync(outDir)) {
        return;
    }

    const startTime = Date.now();
    logger.info("cleaning output directory ...");

    await fs.rm(outDir, { recursive: true });

    const elapsedTime = Date.now() - startTime;
    logger.info(`complete to clean output directory. ${chalk.gray(`(${elapsedTime}ms)`)}`);
}

// call the function if this file is executed directly
if (require.main === module) {
    clean();
}

import { fileURLToPath } from "url";
import { createServer } from "vite";
import * as path from "path";

(async () => {
    const server = await createServer({
        // any valid user config options, plus `mode` and `configFile`
        configFile: path.join(process.cwd(), "vite.config.ts"),
        root: fileURLToPath(new URL("../", import.meta.url)),
        server: {
            port: 1420,
        },
    });

    await server.listen();

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("../main")(() => {
        server.close();
    });

    server.printUrls();
})();

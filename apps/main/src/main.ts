import { app as electronApp, protocol } from "electron";

import { NestFactory } from "@nestjs/core";
import { DummyAdapter } from "@nest/dummy.adapter";

import { AppModule } from "@root/app.module";

import { ElectronService } from "@electron/electron.service";

protocol.registerSchemesAsPrivileged([{ scheme: "cruise", privileges: { bypassCSP: true, supportFetchAPI: true } }]);

async function bootstrap() {
    const app = await NestFactory.create(AppModule, new DummyAdapter());
    const electronService = app.get(ElectronService);
    electronService.on("window-all-closed", async () => {
        await app.close();
        electronApp.quit();
    });

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    await app.listen(0, () => {});
}

bootstrap();

import { NestFactory } from "@nestjs/core";
import { DummyAdapter } from "@nest/dummy.adapter";
import { AppModule } from "@root/app.module";
import { ElectronService } from "@electron/electron.service";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, new DummyAdapter());
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    await app.listen(0, () => {});

    const mainWindow = app.get(ElectronService).getMainWindow();
    mainWindow.on("close", () => {
        app.close();
    });
}

bootstrap();

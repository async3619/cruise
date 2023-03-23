import { NestFactory } from "@nestjs/core";

import { DummyAdapter } from "@main/nest/dummy.adapter";
import { AppModule } from "@main/app.module";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("source-map-support").install();

async function bootstrap() {
    const app = await NestFactory.create(AppModule, new DummyAdapter());
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    await app.listen(0, () => {});
}

bootstrap();

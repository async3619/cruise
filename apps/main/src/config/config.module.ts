import { Module } from "@nestjs/common";

import { ConfigService } from "@config/config.service";
import { ConfigResolver } from "@config/config.resolver";

@Module({
    providers: [ConfigService, ConfigResolver],
    exports: [ConfigService],
})
export class ConfigModule {}

import { Module } from "@nestjs/common";

import { ConfigResolver } from "@main/config/config.resolver";
import { ConfigService } from "@main/config/config.service";

@Module({
    providers: [ConfigResolver, ConfigService],
    exports: [ConfigService],
})
export class ConfigModule {}

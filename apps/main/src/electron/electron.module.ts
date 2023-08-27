import { Module } from "@nestjs/common";

import { ConfigModule } from "@config/config.module";

import { ElectronService } from "@electron/electron.service";
import { ElectronResolver } from "@electron/electron.resolver";

@Module({
    imports: [ConfigModule],
    providers: [ElectronService, ElectronResolver],
    exports: [ElectronService],
})
export class ElectronModule {}

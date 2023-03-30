import { Module } from "@nestjs/common";

import { ConfigModule } from "@main/config/config.module";

import { ElectronService } from "@main/electron/electron.service";
import { ElectronResolver } from "@main/electron/electron.resolver";

@Module({
    imports: [ConfigModule],
    providers: [ElectronService, ElectronResolver],
    exports: [ElectronService],
})
export class ElectronModule {}

import { Module } from "@nestjs/common";

import { ElectronService } from "@main/electron/electron.service";
import { ElectronResolver } from "@main/electron/electron.resolver";

@Module({
    providers: [ElectronService, ElectronResolver],
    exports: [ElectronService],
})
export class ElectronModule {}

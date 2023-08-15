import { Module } from "@nestjs/common";

import { ElectronService } from "@electron/electron.service";
import { ElectronResolver } from "@electron/electron.resolver";

@Module({
    providers: [ElectronService, ElectronResolver],
})
export class ElectronModule {}

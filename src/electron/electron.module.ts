import { Module } from "@nestjs/common";
import { ElectronService } from "./electron.service";

@Module({
    providers: [ElectronService],
    exports: [ElectronService],
})
export class ElectronModule {}

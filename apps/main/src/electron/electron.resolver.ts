import { Inject } from "@nestjs/common";
import { Mutation, Query, Resolver } from "@nestjs/graphql";

import { ElectronService } from "@electron/electron.service";

@Resolver()
export class ElectronResolver {
    public constructor(@Inject(ElectronService) private readonly electronService: ElectronService) {}

    @Query(() => Boolean)
    public async isMaximized(): Promise<boolean> {
        return this.electronService.getMainWindow().isMaximized();
    }

    @Query(() => Boolean)
    public async isMinimized(): Promise<boolean> {
        return this.electronService.getMainWindow().isMinimized();
    }

    @Mutation(() => Boolean)
    public async close(): Promise<boolean> {
        this.electronService.getMainWindow().close();
        return true;
    }
}

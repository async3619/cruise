import { Inject } from "@nestjs/common";
import { Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";

import { ElectronService, windowPubSub } from "@electron/electron.service";

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
    public async maximize(): Promise<boolean> {
        this.electronService.getMainWindow().maximize();
        return true;
    }

    @Mutation(() => Boolean)
    public async unmaximize(): Promise<boolean> {
        this.electronService.getMainWindow().unmaximize();
        return true;
    }

    @Mutation(() => Boolean)
    public async minimize(): Promise<boolean> {
        this.electronService.getMainWindow().minimize();
        return true;
    }

    @Mutation(() => Boolean)
    public async close(): Promise<boolean> {
        this.electronService.getMainWindow().close();
        return true;
    }

    @Subscription(() => Boolean)
    public async maximizedStateChanged() {
        return windowPubSub.asyncIterator("maximizedStateChanged");
    }
}

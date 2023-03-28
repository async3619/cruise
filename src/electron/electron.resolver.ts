import { Inject } from "@nestjs/common";
import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";

import { ElectronService } from "@main/electron/electron.service";
import { MAXIMIZED_STATE_CHANGED } from "@main/electron/electron.constants";

import { SelectPathInput } from "@main/electron/models/select-path.dto";

import type { Nullable } from "@common/types";

import pubSub from "@main/pubsub";

@Resolver()
export class ElectronResolver {
    public constructor(@Inject(ElectronService) private readonly electronService: ElectronService) {}

    @Query(() => Boolean)
    public async isMaximized(): Promise<boolean> {
        return this.electronService.isMaximized();
    }

    @Mutation(() => Boolean)
    public async maximize(): Promise<boolean> {
        return this.electronService.maximize();
    }

    @Mutation(() => Boolean)
    public async minimize(): Promise<boolean> {
        return this.electronService.minimize();
    }

    @Mutation(() => Boolean)
    public async close(): Promise<boolean> {
        return this.electronService.close();
    }

    @Mutation(() => [String])
    public async selectPath(
        @Args("options", { type: () => SelectPathInput }) options: Nullable<SelectPathInput>,
    ): Promise<Nullable<string[]>> {
        return this.electronService.selectPath(options);
    }

    @Subscription(() => Boolean)
    public maximizedStateChanged() {
        return pubSub.asyncIterator(MAXIMIZED_STATE_CHANGED);
    }
}

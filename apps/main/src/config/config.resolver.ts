import { Inject } from "@nestjs/common";
import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";

import { CONFIG_UPDATED, configPubSub, ConfigService } from "@config/config.service";

import { ConfigData, ConfigUpdateInput } from "@config/models/config.dto";

@Resolver()
export class ConfigResolver {
    public constructor(@Inject(ConfigService) private readonly configService: ConfigService) {}

    @Query(() => ConfigData)
    public async config(): Promise<ConfigData> {
        return this.configService.getConfig();
    }

    @Mutation(() => Boolean)
    public async updateConfig(
        @Args("config", { type: () => ConfigUpdateInput }) config: ConfigUpdateInput,
    ): Promise<boolean> {
        await this.configService.setConfig(config);
        return true;
    }

    @Subscription(() => ConfigData)
    public configUpdated() {
        return configPubSub.asyncIterator(CONFIG_UPDATED);
    }
}

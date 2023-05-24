import { Inject } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { ConfigService } from "@main/config/config.service";
import { Config, ConfigInput } from "@main/config/models/config.dto";
import { Language } from "@main/config/models/language.dto";

@Resolver()
export class ConfigResolver {
    public constructor(@Inject(ConfigService) private readonly configService: ConfigService) {}

    @Query(() => Config)
    public async config(): Promise<Config> {
        return this.configService.getConfig();
    }

    @Query(() => [Language])
    public async availableLanguages(): Promise<Language[]> {
        return this.configService.getAvailableLanguages();
    }

    @Mutation(() => Config)
    public async updateConfig(@Args("config", { type: () => ConfigInput }) config: ConfigInput): Promise<Config> {
        await this.configService.setConfig(config);

        return this.configService.getConfig();
    }
}

import { Inject } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";

import { ConfigService } from "@config/config.service";

import { ConfigData } from "@config/models/config.dto";

@Resolver()
export class ConfigResolver {
    public constructor(@Inject(ConfigService) private readonly configService: ConfigService) {}

    @Query(() => ConfigData)
    public async config(): Promise<ConfigData> {
        return this.configService.getConfig();
    }
}

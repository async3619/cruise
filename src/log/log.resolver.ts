import { Inject } from "@nestjs/common";
import { Args, Context, Int, Mutation, Query, ResolveField, Resolver, Root, Subscription } from "@nestjs/graphql";

import { LogService } from "@main/log/log.service";

import { PlayingLog } from "@main/log/models/playing-logs.model";
import { Music } from "@main/music/models/music.model";

import { GraphQLContext } from "@main/context";

@Resolver(() => PlayingLog)
export class LogResolver {
    public constructor(@Inject(LogService) private readonly logService: LogService) {}

    @Query(() => [PlayingLog])
    public async playingLogs(@Args("take", { type: () => Int }) take: number): Promise<PlayingLog[]> {
        return this.logService.findAll({
            take,
            order: {
                id: "DESC",
            },
        });
    }

    @Mutation(() => Boolean)
    public async createLog(@Args("musicId", { type: () => Int }) musicId: number): Promise<boolean> {
        await this.logService.create(musicId);

        return true;
    }

    @Subscription(() => PlayingLog)
    public async playingLogCreated() {
        return this.logService.subscribe("playingLogCreated");
    }

    @ResolveField(() => Music)
    public async music(
        @Root() log: PlayingLog,
        @Context("loaders") loaders: GraphQLContext["loaders"],
    ): Promise<Music> {
        return loaders.music.load(log.musicId);
    }
}

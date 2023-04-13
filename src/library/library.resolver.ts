import { Inject } from "@nestjs/common";
import { Args, Int, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";

import { LibraryService } from "@main/library/library.service";
import { SCANNING_STATE_CHANGED } from "@main/library/library.constants";
import { SearchResult } from "@main/library/models/search-result.dto";

import pubSub from "@main/pubsub";

import type { Nullable } from "@common/types";

@Resolver()
export class LibraryResolver {
    public constructor(@Inject(LibraryService) private readonly libraryService: LibraryService) {}

    @Query(() => Boolean)
    public async needScan(): Promise<boolean> {
        return this.libraryService.needScan();
    }

    @Query(() => SearchResult)
    public async search(@Args("query", { type: () => String }) query: string): Promise<SearchResult> {
        return this.libraryService.search(query);
    }

    @Mutation(() => Boolean)
    public async scan(): Promise<boolean> {
        this.libraryService.scan().then();

        return true;
    }

    @Mutation(() => Boolean)
    public async syncAlbumData(
        @Args("albumId", { type: () => Int }) albumId: number,
        @Args("targetId", { type: () => String }) hauntedId: string,
        @Args("locale", { type: () => String, nullable: true }) locale: Nullable<string>,
    ): Promise<boolean> {
        return this.libraryService.syncAlbumData(albumId, hauntedId, locale);
    }

    @Subscription(() => Boolean)
    public scanningStateChanged() {
        return pubSub.asyncIterator(SCANNING_STATE_CHANGED);
    }
}

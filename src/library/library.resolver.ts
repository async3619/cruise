import { Inject } from "@nestjs/common";
import { Args, Int, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";

import { LibraryService } from "@main/library/library.service";
import { SearchResult } from "@main/library/models/search-result.dto";
import { SearchSuggestion } from "@main/library/models/search-suggestion.dto";

import type { Nullable } from "@common/types";
import { LibraryScanningService } from "@main/library/library-scanning.service";

@Resolver()
export class LibraryResolver {
    public constructor(
        @Inject(LibraryService) private readonly libraryService: LibraryService,
        @Inject(LibraryScanningService) private readonly scanningService: LibraryScanningService,
    ) {}

    @Query(() => Boolean)
    public async needScan(): Promise<boolean> {
        return this.scanningService.needScan();
    }

    @Query(() => SearchResult)
    public async search(@Args("query", { type: () => String }) query: string): Promise<SearchResult> {
        return this.libraryService.search(query);
    }

    @Query(() => [SearchSuggestion])
    public async searchSuggestions(
        @Args("query", { type: () => String }) query: string,
        @Args("limit", { type: () => Int }) limit: number,
    ): Promise<SearchSuggestion[]> {
        return this.libraryService.getSearchSuggestions(query, limit);
    }

    @Mutation(() => Boolean)
    public async scan(): Promise<boolean> {
        this.scanningService.scan().then();

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
        return this.scanningService.subscribe("scanningStateChanged");
    }
}

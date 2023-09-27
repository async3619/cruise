import { Inject } from "@nestjs/common";
import { Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";

import { LibraryScannerService } from "@library/library.scanner.service";
import { LibraryService } from "@library/library.service";

import { SearchSuggestion } from "@library/models/search-suggestion.model";

@Resolver()
export class LibraryResolver {
    public constructor(
        @Inject(LibraryScannerService) private readonly libraryScannerService: LibraryScannerService,
        @Inject(LibraryService) private readonly libraryService: LibraryService,
    ) {}

    @Query(() => [SearchSuggestion])
    public async searchSuggestions(): Promise<SearchSuggestion[]> {
        return this.libraryService.getSearchSuggestions();
    }

    @Mutation(() => Boolean)
    public async scanLibrary(): Promise<boolean> {
        await this.libraryScannerService.scanLibrary();
        return true;
    }

    @Subscription(() => Boolean)
    public async libraryScanningStateChanged() {
        return this.libraryScannerService.subscribeToLibraryScanningStateChanged();
    }
}

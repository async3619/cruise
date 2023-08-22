import { Inject } from "@nestjs/common";
import { Mutation, Resolver, Subscription } from "@nestjs/graphql";

import { LibraryScannerService } from "@library/library.scanner.service";

@Resolver()
export class LibraryResolver {
    public constructor(@Inject(LibraryScannerService) private readonly libraryScannerService: LibraryScannerService) {}

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

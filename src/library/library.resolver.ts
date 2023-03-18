import { Inject } from "@nestjs/common";
import { Mutation, Resolver } from "@nestjs/graphql";

import { LibraryService } from "@main/library/library.service";

@Resolver()
export class LibraryResolver {
    public constructor(@Inject(LibraryService) private readonly libraryService: LibraryService) {}

    @Mutation(() => Boolean)
    public async scan(): Promise<boolean> {
        this.libraryService.scan().then();

        return true;
    }
}

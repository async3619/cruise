import { Mutation, Resolver } from "type-graphql";
import { Service } from "typedi";

import { LibraryService } from "@main/library/library.service";

@Service()
@Resolver()
export default class LibraryResolver {
    public constructor(private readonly historyService: LibraryService) {}

    @Mutation(() => Boolean)
    public async rescanLibrary(): Promise<boolean> {
        return this.historyService.rescan();
    }
}

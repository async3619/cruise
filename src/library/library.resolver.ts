import { Inject } from "@nestjs/common";
import { Mutation, Resolver, Subscription } from "@nestjs/graphql";

import { LibraryService } from "@main/library/library.service";
import { SCANNING_STATE_CHANGED } from "@main/library/library.constants";

import pubSub from "@main/pubsub";

@Resolver()
export class LibraryResolver {
    public constructor(@Inject(LibraryService) private readonly libraryService: LibraryService) {}

    @Mutation(() => Boolean)
    public async scan(): Promise<boolean> {
        await pubSub.publish(SCANNING_STATE_CHANGED, {
            scanningStateChanged: true,
        });

        await this.libraryService.scan().then(() =>
            pubSub.publish(SCANNING_STATE_CHANGED, {
                scanningStateChanged: false,
            }),
        );

        return true;
    }

    @Subscription(() => Boolean)
    public scanningStateChanged() {
        return pubSub.asyncIterator(SCANNING_STATE_CHANGED);
    }
}

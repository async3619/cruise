import { Module } from "@nestjs/common";

import { LibraryService } from "@library/library.service";
import { LibraryResolver } from "@library/library.resolver";
import { LibraryScannerService } from "@library/library.scanner.service";

import { MusicModule } from "@music/music.module";

@Module({
    imports: [MusicModule],
    providers: [LibraryService, LibraryScannerService, LibraryResolver],
})
export class LibraryModule {}

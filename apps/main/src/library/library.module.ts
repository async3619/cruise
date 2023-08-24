import { Module } from "@nestjs/common";

import { LibraryService } from "@library/library.service";
import { LibraryResolver } from "@library/library.resolver";
import { LibraryScannerService } from "@library/library.scanner.service";

import { MusicModule } from "@music/music.module";
import { AlbumModule } from "@album/album.module";

@Module({
    imports: [MusicModule, AlbumModule],
    providers: [LibraryService, LibraryScannerService, LibraryResolver],
})
export class LibraryModule {}

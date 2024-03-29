import { Module } from "@nestjs/common";

import { LibraryService } from "@library/library.service";
import { LibraryResolver } from "@library/library.resolver";
import { LibraryScannerService } from "@library/library.scanner.service";

import { MusicModule } from "@music/music.module";
import { AlbumModule } from "@album/album.module";
import { ArtistModule } from "@artist/artist.module";
import { ImageModule } from "@image/image.module";
import { AlbumArtModule } from "@album-art/album-art.module";

@Module({
    imports: [MusicModule, AlbumModule, ArtistModule, ImageModule, AlbumArtModule],
    providers: [LibraryService, LibraryScannerService, LibraryResolver],
})
export class LibraryModule {}

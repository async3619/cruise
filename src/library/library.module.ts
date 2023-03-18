import { Module } from "@nestjs/common";

import { LibraryService } from "@main/library/library.service";
import { LibraryResolver } from "@main/library/library.resolver";

import { MusicModule } from "@main/music/music.module";
import { AlbumModule } from "@main/album/album.module";
import { ArtistModule } from "@main/artist/artist.module";
import { AlbumArtModule } from "@main/album-art/album-art.module";

@Module({
    imports: [MusicModule, AlbumModule, ArtistModule, AlbumArtModule],
    providers: [LibraryService, LibraryResolver],
})
export class LibraryModule {}

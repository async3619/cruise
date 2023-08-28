import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PlaylistService } from "@playlist/playlist.service";
import { PlaylistResolver } from "@playlist/playlist.resolver";

import { MusicModule } from "@music/music.module";

import { Playlist } from "@playlist/models/playlist.model";

@Module({
    imports: [TypeOrmModule.forFeature([Playlist]), MusicModule],
    providers: [PlaylistService, PlaylistResolver],
    exports: [PlaylistService],
})
export class PlaylistModule {}
